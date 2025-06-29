import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { saveEntry } from '@/database/entries.repository';
import { getAudioUrl, transcribeAudio, uploadAudio } from '@/lib/google';
import { sessionConfig } from '@/lib/session.config';
import { SaveAudioResponse, User } from '@/types';

function timestamp() {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
}

export async function POST(request: NextRequest) {
  const session = await getIronSession<User>(cookies(), sessionConfig);
  const formData = await request.formData();
  const audioFile = formData.get('audio') as unknown as File;
  const fileName = `${timestamp()}.webm`;
  const transcript = formData.get('transcript') as string;

  await uploadAudio({
    audio: Buffer.from(await audioFile.arrayBuffer()),
    fileName,
  });

  transcribeAudio(fileName);

  const saveEntryResult = await saveEntry({
    userId: session['palate-user-id'],
    fileName,
    transcript,
  });

  if (!saveEntryResult?.id) return;

  return Response.json({
    entryId: saveEntryResult.id,
  } satisfies SaveAudioResponse);
}

export async function GET(request: NextRequest) {
  const fileName = await request.nextUrl.searchParams.get('fileName');

  if (!fileName) return new Response('fileName required', { status: 400 });

  const [url] = await getAudioUrl(fileName);

  return Response.json({ url });
}
