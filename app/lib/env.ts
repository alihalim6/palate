import * as envVar from 'env-var';

const env = {
  cookieEncryptPassword: envVar.get('COOKIE_ENCRYPT_PASSWORD').required().asString(),
  databaseHost: envVar.get('DATABASE_HOST').required().asString(),
  databaseName: envVar.get('DATABASE_NAME').required().asString(),
  databasePort: envVar.get('DATABASE_PORT').required().asIntPositive(),
  databaseUrl: envVar.get('DATABASE_URL').required().asString(),
  audioStorageBucket: envVar.get('AUDIO_STORAGE_BUCKET').required().asString(),
  transcriptsStorageBucket: envVar.get('TRANSCRIPTS_STORAGE_BUCKET').required().asString(),
  openaiApiKey: envVar.get('OPENAI_API_KEY').required().asString(),
};

export default env;
