import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Entries {
  backgroundColor: string;
  backgroundColorReason: string | null;
  createdAt: Generated<Timestamp>;
  fileName: string;
  id: string;
  metaTranscript: string | null;
  textColor: string;
  textColorReason: string | null;
  transcript: string;
  userId: string;
}

export interface Users {
  createdAt: Generated<Timestamp>;
  id: string;
  passphrase: string | null;
}

export interface DB {
  entries: Entries;
  users: Users;
}
