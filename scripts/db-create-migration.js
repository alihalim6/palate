import fs from 'node:fs/promises';
import path from 'node:path';

if (process.argv.length !== 3) {
  console.error('Usage: bun scripts/db-create-migration.js <migration-name>');
  process.exit(1);
}

try {
  const migrationName = process.argv[2].toLowerCase().replace(/[^a-z0-9]/g, '_');
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const migrationDir = path.join('app', 'database', 'migrations');

  await fs.mkdir(migrationDir, { recursive: true });

  const migrationPath = path.join(migrationDir, `${timestamp}_${migrationName}.ts`);

  await fs.writeFile(migrationPath, `
    import { Kysely } from 'kysely'

    export async function up(db: Kysely<any>): Promise<void> {
      // migration code
    }

    export async function down(db: Kysely<any>): Promise<void> {
      // migration code
    }
  `);

  console.log(`Created ${migrationPath}`);
} catch(error) {
  console.error(error);
  process.exit(1);
}