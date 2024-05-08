import { saveUser } from '@/users/users.repository';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json() as { passphrase: string };
  await saveUser(createHash('sha256').update(passphrase).digest('base64'));
  
  return Response.json({});
}