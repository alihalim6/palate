
    import { Kysely } from 'kysely';

    export async function up(db: Kysely<any>): Promise<void> {
      await db
        .schema.alterTable('entries')
        .renameColumn('audio_uri', 'file_name')
        .execute();
    }

    export async function down(db: Kysely<any>): Promise<void> {
      await db
        .schema.alterTable('entries')
        .renameColumn('file_name', 'audio_uri')
        .execute();
    }
  