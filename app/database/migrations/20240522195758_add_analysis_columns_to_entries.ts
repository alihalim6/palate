
    import { Kysely } from 'kysely';

    export async function up(db: Kysely<any>): Promise<void> {
      await db
        .schema.alterTable('entries')
        .addColumn('text_color', 'varchar')
        .addColumn('text_color_reason', 'varchar')
        .addColumn('background_color', 'varchar')
        .addColumn('background_color_reason', 'varchar')
        .execute();
    }

    export async function down(db: Kysely<any>): Promise<void> {
      await db
        .schema.alterTable('entries')
        .dropColumn('text_color')
        .dropColumn('text_color_reason')
        .dropColumn('background_color')
        .dropColumn('background_color_reason')
        .execute();
    }
  