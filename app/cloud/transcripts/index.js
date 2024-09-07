import functions from '@google-cloud/functions-framework';
import * as GCPStorage from '@google-cloud/storage';
import pg from 'pg';

const { Storage: CloudStorage } = GCPStorage;
const { Client } = pg;

const cloudStorage = new CloudStorage();
const bucketName = process.env.TRANSCRIPTS_STORAGE_BUCKET;

const pgClient = new Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
});

functions.cloudEvent('insertMetaTranscripts', async (event) => {
  if (!bucketName) return;

  const file = event.data;
  const fileName = file.name;

  const bucket = cloudStorage.bucket(bucketName);
  const fileDownload = await bucket.file(fileName).download();
  const metaTranscript = fileDownload[0].toString();

  await pgClient.connect();
  await pgClient.query('UPDATE entries SET meta_transcript = $1 WHERE file_name = $2', [metaTranscript, fileName]);
  await pgClient.end();
});
