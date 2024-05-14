import { sessionOptions } from '@/lib/session.options';
import { User } from '@/lib/useUser';
import { saveUser } from '@/users/users.repository';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json() as { passphrase: string };
  const session = await getIronSession<User>(cookies(), sessionOptions);

  try {
    const id = createHash('sha256').update(passphrase).digest('base64');
    await saveUser(id);
    session.id = id;
    await session.save();
  } catch (error) {
    // TODO: handle
    console.error(error);
  };
  
  return Response.json({});
}