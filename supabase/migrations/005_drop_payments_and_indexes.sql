-- 005_drop_payments_and_indexes.sql
-- Rollback: remove payments indexes and drop table.
-- Note: CONCURRENTLY removed to allow execution within migration transactions.

-- Drop indexes (standard locking behavior).
DROP INDEX IF EXISTS payments_event_id_idx;
DROP INDEX IF EXISTS payments_created_at_idx;

-- Drop table (this is destructive) - use with caution.
DROP TABLE IF EXISTS public.payments;
