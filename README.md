# Brainly – Second Brain backend

Express + TypeScript + MongoDB API for saving "memories" (links, tweets, YouTube links, PDFs), searching them, and signing in with email/password or Google (Auth0).

## Setup
```bash
npm install
cp .env.Example .env     # fill in values
npm run dev              # ts-node-dev
npm test                 # compiles, then runs the API tests (no MongoDB needed)
npm run build && npm start
```
Required: `db_URL`, `JWT_SECRET_KEY`. Optional features: Auth0 (`secret`, `baseURL`, `clientID`, `issuerBaseURL`), Cloudinary (`cloud_name`, `api_key`, `api_secret`), Hugging Face (`HuggingFaceAccessKey`). See `.env.Example`.

## API (all under `/api`; JSON)
Send `Authorization: Bearer <token>` on every route except signup/signin.

| Method | Path | Notes |
|---|---|---|
| POST | `/signup` | `{name,email,password(8-72)}` → `201 {token,user}` |
| POST | `/signin` | `{email,password}` → `{token,user}`; `401` on bad credentials |
| GET | `/google-signin`, `/google-signup`, `/user-details` | Auth0 Google flow (503 when not configured); `/user-details` returns `{token}` |
| POST | `/signout` | Stateless: the client discards its token |
| POST | `/memory-post` | `{type: pdf\|tweet\|YoutubeLink\|link, link, title, desc, tags}`; the owner is the token's user |
| GET | `/memory-get` | The caller's memories (`?type=` filter) |
| GET | `/memory-getData?id=` | Title/desc/tags of one memory |
| POST | `/memory-update` | `{MemoryObjectId, ...changed fields}` (own memories only) |
| POST | `/memory-delete` | `{MemoryObjectId}` (own memories only) |
| POST | `/generate-embeddings` | `{MemoryObjectId}` – stores a Hugging Face embedding |
| POST | `/generate-Search-embedding` | `{keyword}` – searches the caller's memories only |
| POST | `/fileUpload` | multipart, field `pdf` (≤10 MB) → Cloudinary URL |
| GET | `/health` (no `/api`) | Health check |

Search uses MongoDB's built-in text index (ranked by title, tags, description; free, nothing to set up) and falls back to a partial-word match. Embeddings with a Hugging Face token are optional.

## Deploy (Render + Atlas)
1. MongoDB Atlas M0 cluster, allow `0.0.0.0/0`, copy the connection string into `db_URL`.
2. Render → New Web Service: build `npm install --include=dev && npm run build`, start `npm start`, health check `/health`.
3. Set the env vars; set `CORS_ORIGIN` to the frontend URL and `baseURL` to the Render URL.
4. In Auth0, add `<baseURL>/callback` as an allowed callback URL and the frontend URL as allowed logout URL.

**Security note:** earlier versions of this repo contained a Cloudinary API secret in the source. Rotate it in the Cloudinary dashboard.

## Demo
Set `SEED_DEMO=true` to create demo@brainly.dev (password Demo@12345) with 10 saved memories. Set `FRONTEND_URL` to redirect `/` to the web app.
