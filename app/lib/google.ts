import speech from '@google-cloud/speech';
import { google } from '@google-cloud/speech/build/protos/protos';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';

import env from '@/lib/env';

const speechClient = new speech.SpeechClient();
const storage = new Storage(getGCPCredentials());

/**
 * @link https://www.gcpvercel.com/docs/usage
 */
export function getGCPCredentials() {
  // for Vercel, use environment variables
  return process.env.GOOGLE_PRIVATE_KEY
    ? {
        credentials: {
          client_email: process.env.GCLOUD_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY,
        },
        projectId: env.gcpProjectId,
      }
    : // for local development, use gcloud CLI
      {};
}

export async function uploadAudio({
  audio,
  fileName,
}: {
  audio: Buffer;
  fileName: string;
}) {
  return storage.bucket(env.audioStorageBucket).file(fileName).save(audio);
}

export async function transcribeAudio(fileName: string) {
  const speechRequest: google.cloud.speech.v1.ILongRunningRecognizeRequest = {
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
    },
    audio: {
      uri: `gs://${env.audioStorageBucket}/${fileName}`,
    },
    outputConfig: {
      gcsUri: `gs://${env.transcriptsStorageBucket}/${fileName}.json`,
    },
  };

  speechClient.longRunningRecognize(speechRequest);
}

export async function getAudioUrl(fileName: string) {
  // https://github.com/googleapis/nodejs-storage/issues/360#issuecomment-440512054
  const storageClient =
    process.env.NODE_ENV === 'production'
      ? storage
      : new Storage({
          projectId: env.gcpProjectId,
          keyFilename: 'google_service_account.json',
        });

  const options: GetSignedUrlConfig = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  return await storageClient
    .bucket(env.audioStorageBucket)
    .file(fileName)
    .getSignedUrl(options);
}
