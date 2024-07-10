import { saveEntry } from '@/database/entries.repository';
import { transcribeAudio, uploadAudio } from '@/lib/google';
import { timestamp } from '@/lib/helpers';
import { sessionConfig } from '@/lib/session.config';
import { SaveAudioResponse, User } from '@/types';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

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

  return Response.json({ entryId: saveEntryResult.id } satisfies SaveAudioResponse);
}