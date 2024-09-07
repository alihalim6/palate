import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getEntries } from '@/database/entries.repository';
import { mapMetaTranscript } from '@/lib/google';
import { sessionConfig } from '@/lib/session.config';
import { GetEntriesRequest, GetEntriesResponse, User } from '@/types';

export async function GET(request: NextRequest) {
  const { offset } = (await request.nextUrl.searchParams.get(
    'offset',
  )) as GetEntriesRequest;
  const session = await getIronSession<User>(cookies(), sessionConfig);
  const { entries: fetchedEntries, total } = await getEntries(
    session['palate-user-id'],
    offset,
  );

  const mappedEntries = fetchedEntries.map(entry => {
    return {
      ...entry,
      metaTranscript: mapMetaTranscript(entry.metaTranscript),
    }
  });

  return Response.json({
    entries: mappedEntries.reverse(),
    total,
  } satisfies GetEntriesResponse);
}
