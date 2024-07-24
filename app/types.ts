import { Entries } from '@/database/generated-types';

export interface User {
  'palate-user-id': string;
}

interface EntryAnalysisItem {
  value: string;
  reason: string;
}

export interface EntryAnalysisResponse {
  textColor: EntryAnalysisItem;
  backgroundColor: EntryAnalysisItem;
  id: string;
}

export interface SavePassphraseRequest {
  passphrase: string;
}

export interface AnalyzeEntryRequest {
  transcript: string;
  entryId: string;
}

export interface GetEntriesRequest {
  offset?: number;
}

export type Entry = Omit<Entries, 'createdAt'> & { createdAt: Date };

export interface GetEntriesResponse {
  entries: Entry[];
  total: number;
}

export interface SaveAudioResponse {
  entryId: string;
}
