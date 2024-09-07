import { createId } from '@paralleldrive/cuid2';

import { db } from '@/database';
import { EntryAnalysisResponse } from '@/types';

export async function saveEntry({
  userId,
  fileName,
  transcript,
}: {
  userId: string;
  fileName: string;
  transcript: string;
}) {
  const id = createId();

  await db
    .insertInto('entries')
    .values({
      id,
      userId,
      fileName,
      transcript,
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
    })
    .execute();

  return db
    .selectFrom('entries')
    .where('id', '=', id)
    .select('id')
    .executeTakeFirst();
}
export async function saveEntryAnalysis(
  { textColor, backgroundColor }: EntryAnalysisResponse,
  entryId: string,
) {
  return db
    .updateTable('entries')
    .set({
      textColor: textColor.value,
      textColorReason: textColor.reason,
      backgroundColor: backgroundColor.value,
      backgroundColorReason: backgroundColor.reason,
    })
    .where('id', '=', entryId)
    .execute();
}

export async function getEntries(userId: string, offset?: number) {
  const getEntriesQuery = db
    .selectFrom('entries')
    .where('userId', '=', userId)
    .selectAll();

  const count = await getEntriesQuery
    .clearSelect()
    .select((eb) => eb.fn.countAll().as('total'))
    .executeTakeFirstOrThrow();

  const entries = await getEntriesQuery
    .offset(offset ?? 0)
    .limit(7)
    .orderBy('createdAt desc')
    .execute();

  return {
    entries,
    total: Number(count.total),
  };
}
