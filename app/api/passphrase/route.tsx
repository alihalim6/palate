import { genSalt, hash } from 'bcryptjs';
import { NextRequest } from 'next/server';

const PASSPHRASE_SALT_ROUNDS = 9;

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json() as { passphrase: string };
  const id = await hash(passphrase, await genSalt(PASSPHRASE_SALT_ROUNDS));
  
  return Response.json({ });
}