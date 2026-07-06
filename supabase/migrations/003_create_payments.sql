-- 003_create_payments.sql
-- Create a payments table to persist Stripe webhook events
-- Idempotent: uses IF NOT EXISTS and conditional indexes

-- Table
CREATE TABLE IF NOT EXISTS public.payments (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT,
  provider TEXT,
  type TEXT,
  payload JSONB,
  amount BIGINT,
  currency TEXT,
  created_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT now()
);

-- Unique index to prevent duplicate processing of the same Stripe event.
-- Use a partial unique index so NULL event_id values are allowed.
CREATE UNIQUE INDEX IF NOT EXISTS payments_event_id_idx
  ON public.payments (event_id)
  WHERE event_id IS NOT NULL;

-- Helpful index for time-based queries
CREATE INDEX IF NOT EXISTS payments_created_at_idx ON public.payments (created_at);

-- NOTE: For zero-downtime migrations in production you may prefer to
-- (1) create the new column/index concurrently and
-- (2) backfill any historical data in a separate step.
