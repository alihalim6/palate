import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

import { sessionOptions } from '@/lib/session.options';
import { User } from '@/lib/useUser';

export async function GET() {
  const session = await getIronSession<User>(cookies(), sessionOptions);
  
  return Response.json({ 
    id: session.id,
  } satisfies User);
}