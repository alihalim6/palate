import { Entry } from '@/types';

export function timestamp() {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, -3);
}

export function entryDurationString(entry: Entry) {
  if (!entry.metaTranscript) return null;

  return `${Math.floor(entry.metaTranscript[entry.metaTranscript.length - 1].endTime)}s`;
}

export function entryDurationNum(entry: Entry) {
  if (!entry.metaTranscript) return 0;

  return Math.floor(
    entry.metaTranscript[entry.metaTranscript.length - 1].endTime,
  );
}
