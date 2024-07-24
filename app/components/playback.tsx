import { Entry } from '@/types';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface PlaybackParams {
  entry: Entry;
  currentEntryId: string;
}

const SEEK_INCREMENT_SECS = 10;

const Playback = ({
  entry: { textColor, backgroundColor, id, fileName },
  currentEntryId,
}: PlaybackParams) => {
  const controlSize = '3.5rem';
  const controlStyle: React.CSSProperties = {
    height: controlSize,
    width: controlSize,
  };

  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    fetchAudioUrl();

    return () => {
      setIsAudioPlaying(false);

      if (currentAudioRef) {
        currentAudioRef.pause();
        currentAudioRef.currentTime = 0;
      }
    };
  }, [currentEntryId]);


  const fetchAudioUrl = async () => {
    if (audioUrl || currentEntryId !== id) return;

    try {
      const urlResponse = await fetch(`/api/entry/audio?fileName=${fileName}`);
      const { url } = (await urlResponse.json()) as { url: string };
      setAudioUrl(url);
    } catch (error) {
      //TDOO
    }
  };

  const playEntry = () => {
    if (isAudioPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }

    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleRewind = () => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.currentTime -= SEEK_INCREMENT_SECS;
    }
  };

  const handleFastForward = () => {
    if (audioRef.current && isAudioPlaying) {
      audioRef.current.currentTime += SEEK_INCREMENT_SECS;
    }
  };

  return (
    <div
      className={clsx(
        'flex flex-col opacity-0 transition-opacity',
        audioUrl && 'opacity-100',
      )}
    >
      <div className="mx-auto flex w-fit gap-x-4">
        <button className={clsx('cursor-pointer')} onClick={handleRewind}>
          <FastRewindIcon
            style={controlStyle}
            className={clsx('cursor-pointer')}
          />
        </button>
        {!isAudioPlaying && (
          <PlayArrowIcon
            style={controlStyle}
            className={clsx('cursor-pointer')}
            onClick={() => playEntry()}
          />
        )}
        {isAudioPlaying && (
          <PauseIcon
            style={{
              ...controlStyle,
              backgroundColor: textColor,
              color: backgroundColor,
            }}
            className={clsx('cursor-pointer')}
            onClick={() => playEntry()}
          />
        )}
        <button className={clsx('cursor-pointer')} onClick={handleFastForward}>
          <FastForwardIcon style={controlStyle} />
        </button>
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsAudioPlaying(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Playback;