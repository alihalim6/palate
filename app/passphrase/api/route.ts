import speech from '@google-cloud/speech';


const client = new speech.SpeechClient();

export async function POST() {
  return Response.json({});
}