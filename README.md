# PhasePlan

## Production database (Render / Supabase)

The backend expects tables `users`, `devices`, `locations`, `utility_providers`, `hourly_rates`, `bill_history`. If you see **`relation "devices" does not exist`** (or similar), the production database has not had the schema applied.

Apply the Prisma schema once against the **same DATABASE_URL** your Render service uses:

```bash
# From project root. Use the exact DATABASE_URL from Render → Environment.
DATABASE_URL="postgresql://user:pass@host:5432/dbname" npm run db:push:prod
```

Then redeploy or restart the backend on Render. No need to run this on every deploy unless the schema changes.
