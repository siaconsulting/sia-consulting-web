import { sql, type MigrateDownArgs, type MigrateUpArgs } from '@payloadcms/db-postgres'

export const name = '20261003_030000_submission_rate_limits'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS sia_private`)
  await db.execute(sql`
    DO $$
    BEGIN
      IF to_regclass('public.sia_submission_rate_limits') IS NOT NULL
         AND to_regclass('sia_private.sia_submission_rate_limits') IS NULL THEN
        ALTER TABLE public.sia_submission_rate_limits SET SCHEMA sia_private;
      END IF;
    END $$
  `)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sia_private.sia_submission_rate_limits (
      id bigserial PRIMARY KEY,
      scope text NOT NULL,
      client_key_hash char(64) NOT NULL,
      window_seconds integer NOT NULL CHECK (window_seconds > 0),
      window_start timestamptz NOT NULL,
      expires_at timestamptz NOT NULL,
      hit_count integer NOT NULL CHECK (hit_count > 0)
    )
  `)
  await db.execute(sql`
    DO $$
    DECLARE current_primary_key text;
            current_definition text;
    BEGIN
      SELECT conname, pg_get_constraintdef(oid) INTO current_primary_key, current_definition
      FROM pg_constraint
      WHERE conrelid = 'sia_private.sia_submission_rate_limits'::regclass AND contype = 'p';
      IF current_primary_key IS NOT NULL AND current_definition <> 'PRIMARY KEY (id)' THEN
        EXECUTE format('ALTER TABLE sia_private.sia_submission_rate_limits DROP CONSTRAINT %I', current_primary_key);
        current_primary_key := NULL;
      END IF;
      IF current_primary_key IS NULL THEN
        ALTER TABLE sia_private.sia_submission_rate_limits ADD CONSTRAINT sia_submission_rate_limits_pkey PRIMARY KEY (id);
      END IF;
    END $$
  `)
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS sia_submission_rate_limits_bucket_key
    ON sia_private.sia_submission_rate_limits (scope, client_key_hash, window_seconds, window_start)
  `)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS sia_submission_rate_limits_expires_at_idx
    ON sia_private.sia_submission_rate_limits (expires_at)
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS sia_private.sia_submission_rate_limits`)
  await db.execute(sql`DROP SCHEMA IF EXISTS sia_private`)
}
