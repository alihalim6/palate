// copy/pasted from Kysely documentation

import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './generated-types';

const dialect = new PostgresDialect({
  pool: new Pool({
    max: 10,
    connectionString: process.env.DATABASE_URL,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  plugins: [
    new CamelCasePlugin()
  ],
})