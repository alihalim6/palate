
    import { Kysely, sql } from 'kysely';

    export async function up(db: Kysely<any>): Promise<void> {
      await db
        .schema.createTable('users')
        .addColumn('id', 'varchar', (col) => col.primaryKey())
        .addColumn('passphrase', 'varchar', (col) => col.unique())
        .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

      await db
        .schema.createTable('entries')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('user_id', 'varchar', (col) => col.references('users.id').notNull().onDelete('cascade'))
        .addColumn('audio_uri', 'text', (col) => col.notNull())
        .addColumn('transcript', 'text')
        .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .execute();
    }

    export async function down(db: Kysely<any>): Promise<void> {
      await db.schema.dropTable('users').execute();
      await db.schema.dropTable('entries').execute();
    }
  