import { Entries } from '@/database/generated-types';

export type User = {
  'palate-user-id': string;
};

type EntryAnalysisItem = {
  value: string;
  reason: string;
}

export type EntryAnalysisResponse = {
  textColor: EntryAnalysisItem;
  backgroundColor: EntryAnalysisItem;
  id: string;
}

export type SavePassphraseRequest = {
  passphrase: string;
}

export type AnalyzeEntryRequest = {
  transcript: string;
  entryId: string;
};

export type GetEntriesRequest = {
  offset?: number;
}

export type Entry = Omit<Entries, 'createdAt'> & { createdAt: Date };

export type GetEntriesResponse = {
  entries: Entry[];
  total: number;
}

export type SaveAudioResponse = {
  entryId: string;
}