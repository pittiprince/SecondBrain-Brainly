process.env.JWT_SECRET_KEY = 'test-secret';
process.env.AUTH_RATE_LIMIT = '1000';
process.env.RATE_LIMIT = '10000';
delete process.env.secret; // Auth0 stays disabled

const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { makeModel } = require('./helpers/fakeModel');

const dist = (p) => path.join(__dirname, '..', 'dist', p);
const users = makeModel({ unique: ['email'] });
const memories = makeModel();
const stub = (file, exportName, model) => {
    const id = require.resolve(dist(file));
    require.cache[id] = { id, filename: id, loaded: true, exports: { [exportName]: model } };
};
stub('models/SignupModel.js', 'SignupModel', users);
stub('models/MemoryModel.js', 'MemoryModel', memories);
stub('models/GoogleAuthModel.js', 'GoogleAuthModel', makeModel());
// the Hugging Face call is replaced: no network in tests
const embId = require.resolve(dist('utilities/vectorEmbeddingGenerator.js'));
require.cache[embId] = { id: embId, filename: embId, loaded: true, exports: { generateVectorEmbeddings: async () => [0.1, 0.2] } };

const app = require(dist('createApp.js')).createApp();

const signup = async (email, name = 'Test User') => {
    const res = await request(app).post('/api/signup').send({ name, email, password: 'password123' }).expect(201);
    return { token: res.body.token, id: res.body.user.id };
};
const bearer = (t) => ({ Authorization: `Bearer ${t}` });
const memory = { type: 'link', link: 'https://example.com', title: 'Example title', desc: 'A long enough description', tags: ['a'] };

test.beforeEach(() => { users.reset(); memories.reset(); });

test('health check', async () => { await request(app).get('/health').expect(200); });

test('signup returns a token, rejects duplicates and weak input', async () => {
    const { token } = await signup('a@x.com');
    assert.ok(token);
    await request(app).post('/api/signup').send({ name: 'Test User', email: 'A@x.com', password: 'password123' }).expect(409);
    await request(app).post('/api/signup').send({ name: 'Test User', email: 'b@x.com', password: 'short' }).expect(400);
    assert.notEqual(users._rows()[0].password, 'password123'); // stored hashed
    assert.equal(users._rows()[0].SecretKey, undefined);
});

test('signin: works without a pre-existing JWT, and fails generically', async () => {
    await signup('a@x.com');
    const ok = await request(app).post('/api/signin').send({ email: 'a@x.com', password: 'password123' }).expect(200);
    assert.ok(ok.body.token);
    await request(app).post('/api/signin').send({ email: 'a@x.com', password: 'wrongpassword' }).expect(401);
    await request(app).post('/api/signin').send({ email: 'nobody@x.com', password: 'password123' }).expect(401);
});

test('protected routes answer 401 JSON instead of redirecting', async () => {
    const res = await request(app).get('/api/memory-get').expect(401);
    assert.ok(res.body.message);
    await request(app).get('/api/memory-get').set(bearer('garbage')).expect(401);
});

test('memory CRUD; the owner comes from the token, not the body', async () => {
    const alice = await signup('alice@x.com');
    const created = await request(app).post('/api/memory-post').set(bearer(alice.token))
        .send({ ...memory, UserObjectId: 'someone-else' }).expect(201);
    assert.equal(memories._rows()[0].UserObjectId, alice.id);

    const list = await request(app).get('/api/memory-get').set(bearer(alice.token)).expect(200);
    assert.equal(list.body.length, 1);

    await request(app).post('/api/memory-update').set(bearer(alice.token))
        .send({ MemoryObjectId: created.body.MemoryObjectId, title: 'New title' }).expect(200);
    assert.equal(memories._rows()[0].title, 'New title');
    assert.equal(memories._rows()[0].desc, memory.desc); // other fields untouched

    await request(app).post('/api/memory-delete').set(bearer(alice.token))
        .send({ MemoryObjectId: created.body.MemoryObjectId }).expect(200);
    assert.equal(memories._rows().length, 0);
});

test('memory input is validated', async () => {
    const { token } = await signup('a@x.com');
    await request(app).post('/api/memory-post').set(bearer(token)).send({ ...memory, type: 'nope' }).expect(400);
    await request(app).post('/api/memory-post').set(bearer(token)).send({ ...memory, link: 'not a url' }).expect(400);
    await request(app).post('/api/memory-update').set(bearer(token)).send({ MemoryObjectId: 'zzz', title: 'abc' }).expect(400);
    await request(app).post('/api/memory-update').set(bearer(token)).send({ MemoryObjectId: 'a'.repeat(24) }).expect(400);
});

test("users cannot read, change, delete or embed each other's memories (IDOR)", async () => {
    const alice = await signup('alice@x.com');
    const bob = await signup('bob@x.com');
    const { body } = await request(app).post('/api/memory-post').set(bearer(alice.token)).send(memory).expect(201);
    const id = body.MemoryObjectId;

    const bobList = await request(app).get('/api/memory-get').set(bearer(bob.token)).expect(200);
    assert.deepEqual(bobList.body, []);
    await request(app).get('/api/memory-getData').query({ id }).set(bearer(bob.token)).expect(404);
    await request(app).post('/api/memory-update').set(bearer(bob.token)).send({ MemoryObjectId: id, title: 'hacked' }).expect(404);
    await request(app).post('/api/memory-delete').set(bearer(bob.token)).send({ MemoryObjectId: id }).expect(404);
    await request(app).post('/api/generate-embeddings').set(bearer(bob.token)).send({ MemoryObjectId: id }).expect(404);
    assert.equal(memories._rows()[0].title, memory.title);
    await request(app).get('/api/memory-getData').query({ id }).set(bearer(alice.token)).expect(200);
});

test('embeddings are generated for the owner', async () => {
    const { token } = await signup('a@x.com');
    const { body } = await request(app).post('/api/memory-post').set(bearer(token)).send(memory).expect(201);
    await request(app).post('/api/generate-embeddings').set(bearer(token)).send({ MemoryObjectId: body.MemoryObjectId }).expect(200);
    assert.deepEqual(memories._rows()[0].embedding_Vectors, [0.1, 0.2]);
});

test("search only returns the caller's memories (regex fallback when Atlas Search is missing)", async () => {
    const alice = await signup('alice@x.com');
    const bob = await signup('bob@x.com');
    await request(app).post('/api/memory-post').set(bearer(alice.token)).send({ ...memory, title: 'Kubernetes notes' }).expect(201);
    await request(app).post('/api/memory-post').set(bearer(bob.token)).send({ ...memory, title: 'Kubernetes secrets' }).expect(201);

    const res = await request(app).post('/api/generate-Search-embedding').set(bearer(alice.token)).send({ keyword: 'kubernetes' }).expect(200);
    assert.equal(res.body.results.length, 1);
    assert.equal(res.body.memories[0].title, 'Kubernetes notes');
    await request(app).post('/api/generate-Search-embedding').set(bearer(alice.token)).send({ keyword: 'a(b' }).expect(200); // regex characters are escaped
    await request(app).post('/api/generate-Search-embedding').set(bearer(alice.token)).send({ keyword: 'ab' }).expect(400);
});

test('unknown routes and bad JSON get JSON errors; Google sign-in is 503 when not configured', async () => {
    await request(app).get('/nope').expect(404);
    await request(app).post('/api/signin').set('Content-Type', 'application/json').send('{bad').expect(400);
    await request(app).get('/api/google-signin').expect(503);
});

test('upload requires auth and a file', async () => {
    await request(app).post('/api/fileUpload').expect(401);
    const { token } = await signup('a@x.com');
    await request(app).post('/api/fileUpload').set(bearer(token)).expect(400);
});
