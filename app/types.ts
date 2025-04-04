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

interface MetaTranscriptChunk {
  words: string;
  endTime: number;
}

export type Entry = Omit<Entries, 'createdAt' | 'metaTranscript'> & {
  createdAt: Date;
  metaTranscript: MetaTranscriptChunk[] | null;
};

export interface GetEntriesResponse {
  fetchedEntries: Entry[];
  totalEntries: number;
}

export interface SaveAudioResponse {
  entryId: string;
}
