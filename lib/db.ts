import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
export const pool = connectionString
  ? new Pool({ connectionString })
  : null;
