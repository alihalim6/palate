import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { sessionOptions } from '@/lib/session';

export type User = {
  id: string;
};

export async function GET() {
  const session = await getIronSession<User>(cookies(), sessionOptions);
  return Response.json({ id: session.id });
}