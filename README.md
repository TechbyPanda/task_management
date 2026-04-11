psql -U postgres

npx prisma studio

## Prisma Invalid URL Error Debugging

### Error Message

```
 const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].task.findMany(
Invalid URL
```

### Cause

This error typically occurs when there are conflicting environment files (such as both `.env` and `.env.local`) defining `DATABASE_URL` differently. The Prisma client may pick up the wrong value or an invalid/empty one, leading to this error.

### Solution

- **Remove or consolidate your environment files.**
- In this case, deleting the `.env.local` file resolved the conflict and the error went away.

### Additional Notes

- The error originates from `lib/prisma.ts`, which loads `DATABASE_URL` from the environment.
- Always ensure only one valid `.env` file provides the correct `DATABASE_URL` for your environment.

---