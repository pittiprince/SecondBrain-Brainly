// In-memory stand-in for a mongoose model so the API can be tested without MongoDB.
const crypto = require('node:crypto');
const newId = () => crypto.randomBytes(12).toString('hex');

const matches = (row, filter) =>
    Object.entries(filter).every(([k, v]) => {
        if (k === '$or') return v.some((f) => matches(row, f));
        if (v instanceof RegExp) return Array.isArray(row[k]) ? row[k].some((x) => v.test(x)) : v.test(String(row[k]));
        return String(row[k]) === String(v);
    });

function makeModel({ unique = [] } = {}) {
    let rows = [];
    const query = (list) => {
        let result = list;
        const chain = {
            sort() { result = [...result].reverse(); return chain; },
            limit(n) { result = result.slice(0, n); return chain; },
            then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); },
        };
        return chain;
    };
    return {
        reset() { rows = []; },
        _rows: () => rows,
        async findOne(f) { return rows.find((r) => matches(r, f)) || null; },
        find(f = {}) { return query(rows.filter((r) => matches(r, f))); },
        async create(doc) {
            for (const u of unique) if (rows.some((r) => r[u] === doc[u])) { const e = new Error('dup'); e.code = 11000; throw e; }
            const row = { _id: newId(), createdAt: new Date(), updatedAt: new Date(), ...doc };
            rows.push(row);
            return row;
        },
        async findOneAndUpdate(f, update) {
            const row = rows.find((r) => matches(r, f));
            if (!row) return null;
            Object.assign(row, update.$set);
            return row;
        },
        async updateOne(f, update) {
            const row = rows.find((r) => matches(r, f));
            if (row) Object.assign(row, update.$set);
            return { matchedCount: row ? 1 : 0 };
        },
        async deleteOne(f) {
            const i = rows.findIndex((r) => matches(r, f));
            if (i >= 0) rows.splice(i, 1);
            return { deletedCount: i >= 0 ? 1 : 0 };
        },
        // Atlas Search is not available outside Atlas: the controller must fall back to a regex search
        async aggregate() { throw new Error('$search is not supported'); },
    };
}
module.exports = { makeModel };
