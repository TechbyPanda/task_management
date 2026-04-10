# Jadu

Next.js app with Prisma (SQL Server). See **[docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)** for architecture and rules for contributors.

## Todo API

Base URL: `/api/todos`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/todos` | List todos. Query: `status?` (int), `page?` (default 1), `limit?` (default 20, max 100) |
| `POST` | `/api/todos` | Create. Body: `{ "title": string, "status"?: number }` (default status: pending `0`) |
| `GET` | `/api/todos/:id` | Get one |
| `PATCH` | `/api/todos/:id` | Partial update. Body: `{ "title"?: string, "status"?: number }` (at least one field) |
| `DELETE` | `/api/todos/:id` | Delete (204 empty body) |

**Status integers** (see `lib/constants/todo-status.ts`): `0` pending, `1` rejected, `2` completed, `3` in progress. Responses include `statusLabel` for display.

## DB Setup

```
npm install prisma @prisma/client
npx prisma init
```

CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. `Run prisma db` pull to introspect your database.

CREATE NEW DATABASE:
  Local: `npx prisma dev` (runs Postgres locally in your terminal)
  Cloud: `npx create-db` (creates a free Prisma Postgres database)

UPDATING DATABASE:
  npx prisma db push

# Youtube
1. DB connection all
2. prisma.config.ts error and issue