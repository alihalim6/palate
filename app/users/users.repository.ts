import { db } from '@/database';
import { createId } from '@paralleldrive/cuid2';

export async function saveUser(passphrase: string) {
  await db
    .insertInto('users')
    .values({
      id: createId(),
      passphrase,
    })
    .onConflict((oc) => oc.column('passphrase').doNothing())
    .execute();
}