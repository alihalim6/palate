import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

import Ticker from '@/components/ticker';
import { entryDurationNum, entryDurationString } from '@/lib/helpers';
import { Entry } from '@/types';

interface PlaybackParams {
  entry: Entry;
  audioTimeUpdateFn: (currentTime: number) => void;
}

const SEEK_INCREMENT_SECS = 10;

const Playback = ({ entry, audioTimeUpdateFn }: PlaybackParams) => {
  const { textColor, backgroundColor, fileName } = entry;

  const seekIconSize = '2.5rem';
  const seekIconStyle: React.CSSProperties = {
    height: seekIconSize,
    width: seekIconSize,
  };

  const playPauseIconSize = '4rem';
  const playPauseIconStyle: React.CSSProperties = {
    height: playPauseIconSize,
    width: playPauseIconSize,
  };

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const audioUrlMap: Record<string, string> = {};

  const handleTimeUpdate = () => {
    if (audioRef) {
      audioTimeUpdateFn(audioRef?.currentTime);
    }
  };

  useEffect(() => {
    fetchAudioUrl();

    if (!audioRef) return;

    audioRef.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      setIsAudioPlaying(false);

      audioRef.pause();
      audioRef.currentTime = 0;
      audioRef.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [entry, audioRef]);

  const fetchAudioUrl = async () => {
    if (audioUrlMap[entry.id]) return;

    try {
      const urlResponse = await fetch(`/api/entry/audio?fileName=${fileName}`);
      const { url } = (await urlResponse.json()) as { url: string };
      setAudioUrl(url);
      audioUrlMap[entry.id] = url;
    } catch (error) {
      //TDOO
    }
  };

  const playEntry = () => {
    if (isAudioPlaying) {
      audioRef?.pause();
    } else {
      audioRef?.play();
    }

    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleRewind = () => {
    if (audioRef && isAudioPlaying) {
      audioRef.currentTime -= SEEK_INCREMENT_SECS;
    }
  };

  const handleFastForward = () => {
    if (audioRef && isAudioPlaying) {
      audioRef.currentTime += SEEK_INCREMENT_SECS;
    }
  };

  const duration = useMemo(() => {
    return entryDurationString(entry);
  }, [entry]);

  const elapsedTime = () => {
    if (!audioRef) return '0s';

    if (duration && audioRef.currentTime > entryDurationNum(entry))
      return duration;

    return `${Math.floor(audioRef.currentTime)}s`;
  };

  return (
    <div
      className={clsx(
        'mt-3 flex flex-col gap-y-2 opacity-0 transition-opacity',
        audioUrl && 'opacity-100',
      )}
    >
      <div className="mx-auto flex w-fit gap-x-4">
        <button className="cursor-pointer" onClick={handleRewind}>
          <FastRewindIcon style={seekIconStyle} className="cursor-pointer" />
        </button>
        {!isAudioPlaying && (
          <PlayArrowIcon
            style={playPauseIconStyle}
            className="cursor-pointer"
            onClick={() => playEntry()}
          />
        )}
        {isAudioPlaying && (
          <PauseIcon
            style={{
              ...playPauseIconStyle,
              backgroundColor: textColor,
              color: backgroundColor,
            }}
            className="cursor-pointer"
            onClick={() => playEntry()}
          />
        )}
        <button className="cursor-pointer" onClick={handleFastForward}>
          <FastForwardIcon style={seekIconStyle} />
        </button>
        {audioUrl && (
          <audio
            ref={setAudioRef}
            src={audioUrl}
            onEnded={() => setIsAudioPlaying(false)}
          />
        )}
      </div>
      <div
        className={clsx(
          'invisible mx-auto w-fit rounded-sm px-2 py-1 text-xs',
          audioRef && duration && '!visible',
        )}
        style={{
          backgroundColor: entry.backgroundColor,
          color: entry.textColor,
        }}
      >
        {`${elapsedTime()} / ${duration}`}
      </div>
      <Ticker label="RECORD NEW ENTRY" navPath="/" className="mt-12" />
    </div>
  );
};

export default Playback;
