import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { getEntries } from '@/database/entries.repository';
import { sessionConfig } from '@/lib/session.config';
import { GetEntriesRequest, GetEntriesResponse, User } from '@/types';

export async function GET(request: NextRequest) {
  const { offset } = (await request.nextUrl.searchParams.get(
    'offset',
  )) as GetEntriesRequest;
  const session = await getIronSession<User>(cookies(), sessionConfig);
  const { entries, total } = await getEntries(
    session['palate-user-id'],
    offset,
  );

  return Response.json({
    entries: entries.reverse(),
    total,
  } satisfies GetEntriesResponse);
}
