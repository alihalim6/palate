import { createHash } from 'node:crypto';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

import { saveUser } from '@/database/users.repository';
import { sessionConfig } from '@/lib/session.config';
import { SavePassphraseRequest, User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { passphrase } = (await request.json()) as SavePassphraseRequest;
    const session = await getIronSession<User>(cookies(), sessionConfig);
    const encryptedPassphrase = createHash('sha256')
      .update(passphrase)
      .digest('base64');
    const user = await saveUser(encryptedPassphrase);

    if (!user) return; // TODO: handle

    session['palate-user-id'] = user.id;
    await session.save();
  } catch (error) {
    // TODO: handle
    console.error(error);
  }

  return Response.json({});
}
