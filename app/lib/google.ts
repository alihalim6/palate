import env from '@/lib/env';
import speech from '@google-cloud/speech';
import { google } from '@google-cloud/speech/build/protos/protos';
import { Storage } from '@google-cloud/storage';

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
        projectId: process.env.GCP_PROJECT_ID,
      }
      // for local development, use gcloud CLI
    : {};
};

export async function uploadAudio({ audio, fileName}: { audio: Buffer, fileName: string }) {
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