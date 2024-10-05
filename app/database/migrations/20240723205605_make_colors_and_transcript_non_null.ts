import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('entries')
    .alterColumn('text_color', (ac) => ac.setNotNull())
    .alterColumn('background_color', (ac) => ac.setNotNull())
    .alterColumn('transcript', (ac) => ac.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('entries')
    .alterColumn('text_color', (ac) => ac.dropNotNull())
    .alterColumn('background_color', (ac) => ac.dropNotNull())
    .alterColumn('transcript', (ac) => ac.dropNotNull())
    .execute();
}
