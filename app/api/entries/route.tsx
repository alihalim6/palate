import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getEntries } from '@/database/entries.repository';
import { mapMetaTranscript } from '@/lib/google';
import { sessionConfig } from '@/lib/session.config';
import { GetEntriesResponse, User } from '@/types';

export async function GET(request: NextRequest) {
  const offset = request.nextUrl.searchParams.get(
    'offset',
  );
  const session = await getIronSession<User>(cookies(), sessionConfig);
  const { entries: fetchedEntries, totalEntries } = await getEntries(
    session['palate-user-id'],
    offset,
  );

  const mappedEntries = fetchedEntries.map((entry) => {
    return {
      ...entry,
      metaTranscript: mapMetaTranscript(entry.metaTranscript),
    };
  });

  return Response.json({
    fetchedEntries: mappedEntries,
    totalEntries,
  } satisfies GetEntriesResponse);
}
