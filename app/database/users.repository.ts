import { createId } from '@paralleldrive/cuid2';

import { db } from '@/database';

export function saveUser(passphrase: string) {
  return db
    .insertInto('users')
    .values({
      id: createId(),
      passphrase,
    })
    .onConflict((oc) => oc.column('passphrase').doUpdateSet({ passphrase })) // not doNothing() as that returns 0 rows
    .returning('id')
    .executeTakeFirst();
}
