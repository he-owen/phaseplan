CREATE TABLE IF NOT EXISTS saved_schedules (
    schedule_id      TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule_date    DATE NOT NULL,
    day_of_week      TEXT NOT NULL,
    schedule_json    JSONB NOT NULL,
    appliances_json  JSONB,
    optimized_cost   NUMERIC(12,4) NOT NULL DEFAULT 0,
    typical_cost     NUMERIC(12,4) NOT NULL DEFAULT 0,
    carbon_optimized NUMERIC(10,4) NOT NULL DEFAULT 0,
    carbon_typical   NUMERIC(10,4) NOT NULL DEFAULT 0,
    status           TEXT NOT NULL DEFAULT 'pending',
    followed_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, schedule_date)
);

CREATE INDEX IF NOT EXISTS idx_saved_schedules_user_status ON saved_schedules(user_id, status);
CREATE INDEX IF NOT EXISTS idx_saved_schedules_user_date ON saved_schedules(user_id, schedule_date);
