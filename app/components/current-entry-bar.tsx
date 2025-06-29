import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

import { Entry } from '@/types';

interface CurrentEntryBarParams {
  entry: Entry;
}

function entryDurationString(entry: Entry) {
  if (!entry.metaTranscript) return null;

  const lastChunkTranscript = entry.metaTranscript[entry.metaTranscript.length - 1];
  const minutes = Math.floor(lastChunkTranscript.endTime / 60); 
  const seconds = Math.floor(lastChunkTranscript.endTime % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function timeDashesRemaining(entry: Entry, audioRef: HTMLAudioElement | null) {
  if (!entry.metaTranscript || !audioRef) return 0;

  const lastChunkTranscript = entry.metaTranscript[entry.metaTranscript.length - 1];
  const elapsedMinutes = Math.floor(audioRef.currentTime / 60);
  const totalMinutes = Math.floor(lastChunkTranscript.endTime / 60) + 1;

  return Math.max(totalMinutes - elapsedMinutes, 0);
}

const CurrentEntryBar = ({ entry }: CurrentEntryBarParams) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const audioUrlMap = useRef<Record<string, string>>({});

  const handleTimeUpdate = () => {
    // todo
  };

  const fetchAudioUrl = async () => {
    if (audioUrlMap.current[entry.id]) {
      setAudioUrl(audioUrlMap.current[entry.id]);
      return;
    }

    if (!entry.id) return;

    try {
      const urlResponse = await fetch(`/api/entry/audio?fileName=${entry.fileName}`);
      const { url } = (await urlResponse.json()) as { url: string };
      setAudioUrl(url);
      audioUrlMap.current[entry.id] = url;
    } catch (error) {
      //TDOO
    }
  };

  useEffect(() => {
    fetchAudioUrl();

    if (!audioRef) return;

    audioRef.addEventListener('timeupdate', handleTimeUpdate);

    const playTimeout = setTimeout(() => {
      audioRef.play();
    }, 1500);

    return () => {
      clearTimeout(playTimeout);
      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [entry, audioRef]);
  
  const isEntryYearNotCurrentYear = () => {
    return format(entry.createdAt, 'yyyy') !== format(new Date(), 'yyyy');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-full items-center justify-center gap-x-4">
        {/* YEAR */}
        {isEntryYearNotCurrentYear() && <div className="flex flex-col items-center bg-black px-2 py-0.5 text-[0.875rem] font-extrabold leading-[0.7rem] text-white">
          <span>{format(entry.createdAt, 'yyyy').substring(0, 2)}</span>
          <span>{format(entry.createdAt, 'yyyy').substring(2)}</span>
        </div>}
        {/* DATE */}
        <div className="flex scale-y-90 items-center gap-x-1">
          {['MMM', 'dd'].map((formatString) => (
            <div key={formatString} className="px-1 text-3xl font-extrabold">
              <span>{format(entry.createdAt, formatString).toUpperCase()}</span>
            </div>
          ))}
        </div>
        {/* TIME REMAINING */}
        <div className="flex w-28 justify-center rounded-3xl bg-black text-[1.75rem] font-semibold tracking-widest text-white">{entryDurationString(entry)}</div>
      </div>
      {/* BLACK DASHES FOR TIME REMAINING */}
      <div className="mt-2 flex gap-1">
        {Array.from({ length: timeDashesRemaining(entry, audioRef) }).map((_, index) => (
          <div key={index} className="h-1 w-4 bg-black"></div>
        ))}
      </div>
      {audioUrl && (
        <audio
          ref={setAudioRef}
          src={audioUrl}
        />
      )}
    </div>
  );
};

export default CurrentEntryBar;
