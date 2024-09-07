'use client';

import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import uniqolor from 'uniqolor';

import FinishRecording from '@/components/finish-recording';
import Ticker from '@/components/ticker';
import {
  blobToBuffer,
  recordAudio,
  requestMicrophonePermission,
} from '@/lib/audio';
import { AnalyzeEntryRequest, SaveAudioResponse } from '@/types';

const FINISH_RECORDING_DRAG_THRESHOLD = 85;

const Home = () => {
  const [flashingWord, setFlashingWord] = useState<'palate' | 'palette'>(
    'palate',
  );
  const [flashingWordColor, setFlashingWordColor] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [transcript, setTranscript] = useState<string>(''); //(`There's something truly magical about the early hours of the day, when the world is still waking up and the air is crisp and fresh. As someone who has never been much of a morning person, I recently decided to challenge myself to embrace the dawn and see what all the fuss was about. What I discovered was a whole new appreciation for the beauty and tranquility that comes with early morning hikes. There's something truly magical about the early hours of the day, when the world is still waking up and the air is crisp and fresh. As someone who has never been much of a morning person, I recently decided to challenge myself to embrace the dawn and see what all the fuss was about. What I discovered was a whole new appreciation for the beauty and tranquility that comes with early morning hikes.`);
  const [isRecording, setIsRecording] = useState<boolean>(false); //
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(true);
  const [audioChunks, setAudioChunks] = useState<Blob[] | null>(null);
  const [finishRecordingKey, setFinishRecordingKey] = useState<number>(0); // to trigger rerender/reset of drag element
  const [finishRecordingDragPercent, setFinishRecordingDragPercent] =
    useState(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const router = useRouter();

  const finishRecordingAnimationClassName =
    'absolute flex flex-col h-screen justify-end bottom-0 gap-y-2';

  useEffect(() => {
    const flashingInterval = setInterval(() => {
      setFlashingWord((currentWord) =>
        currentWord === 'palate' ? 'palette' : 'palate',
      );
      setFlashingWordColor(uniqolor.random().color);
    }, 2000);

    return () => clearInterval(flashingInterval);
  }, []);

  useEffect(() => {
    requestMicrophonePermission().catch(() => setIsMicAvailable(false));
  }, []);

  useEffect(() => {
    const absoluteDragPercent = Math.abs(finishRecordingDragPercent);

    if (absoluteDragPercent >= FINISH_RECORDING_DRAG_THRESHOLD) {
      if (finishRecordingDragPercent > 0) {
        setIsSaving(true);
        saveEntry();
      } else discardEntry();
    }
  }, [finishRecordingDragPercent]);

  const hasTranscript = useMemo(
    () => transcript.trim().length > 0,
    [transcript],
  );
  const transcriptOpacity = useMemo(
    () => 1 - Math.abs(finishRecordingDragPercent) * 0.01,
    [finishRecordingDragPercent],
  );

  const stopRecording = () => {
    recognition?.current?.stop();
    mediaRecorder?.current?.stop();
    setIsRecording(false);
  };

  const discardEntry = () => {
    setTranscript('');
    setAudioChunks(null);
    stopRecording();
  };

  const saveEntry = async () => {
    if (!audioChunks) {
      //TODO at least save transcript
      console.error('no audio chunks');
      return;
    }

    if (isSaving) return;

    try {
      setIsRecording(false);
      const audioBlob = new Blob(audioChunks, {
        type: mediaRecorder.current?.mimeType,
      });
      const audio = await blobToBuffer(audioBlob);
      const formData = new FormData();
      formData.append('transcript', transcript);
      formData.append('audio', new Blob([audio]));

      const saveAudioResponse = await fetch('/api/entry/audio', {
        method: 'POST',
        body: formData,
      });

      const { entryId } = (await saveAudioResponse.json()) as SaveAudioResponse;

      await fetch('/api/entry/analysis', {
        method: 'POST',
        body: JSON.stringify({
          transcript,
          entryId,
        } satisfies AnalyzeEntryRequest),
      });

      router.push('/entries');
    } catch (error) {
      console.error(error);
      /*TODO at least save transcript */
    }
  };

  const record = async () => {
    setIsRecording(true);

    if ('vibrate' in navigator) {
      navigator.vibrate(400);
    }

    audioRef.current?.play();

    recordAudio({
      recognition,
      handleTranscript: (t) =>
        setTranscript((transcript) => transcript.concat(' ', t.trim())),
      handleStop: stopRecording,
      handleAudioChunks: (audioChunks) => setAudioChunks(audioChunks),
      mediaRecorder,
    });
  };

  const handleDragStop = () => {
    if (!isSaving) {
      setFinishRecordingKey((previousKey) => previousKey + 1);
      setFinishRecordingDragPercent(0);
    }
  };

  return (
    <div className="flex h-screen flex-col p-8 pb-20">
      {!isRecording && <Ticker label="PAST ENTRIES" navPath="/entries" direction="left" className="mb-12" />}
      <div className="flex items-center justify-end">
        <span>
          {new Date().toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {isMicAvailable && (
        <>
          <div className="animate-fade-in py-16 opacity-60">
            <h2
              className={clsx(
                'md:self-center',
                (isRecording || hasTranscript) && 'hidden',
              )}
            >
              What&apos;s on your{' '}
              <span style={{ color: flashingWordColor }}>{flashingWord}</span>?
            </h2>
            <div className="mt-4 flex items-center">
              {hasTranscript && (
                <p
                  className="leading-8 transition-opacity"
                  style={{ opacity: transcriptOpacity }}
                >
                  {transcript}{' '}
                  {isRecording && <span className="animate-blink">|</span>}
                </p>
              )}
              {isRecording && !hasTranscript && (
                <div
                  className={clsx(
                    'ml-1 h-9 w-1 animate-blink bg-black',
                    isRecording ? 'block' : 'hidden',
                  )}
                ></div>
              )}
            </div>
          </div>

          <button
            onClick={record}
            className={clsx(
              'relative w-fit animate-fade-in self-center rounded-full bg-red-500 p-8 text-[0.6rem] shadow-md hover:scale-110',
              (isRecording || hasTranscript) && 'hidden',
            )}
          ></button>

          {isRecording && (
            <div className="sticky bottom-0 mt-auto flex justify-center bg-white/60 p-4">
              <FinishRecording
                onDrag={(dragPercent) =>
                  setFinishRecordingDragPercent(dragPercent)
                }
                onStop={handleDragStop}
                key={finishRecordingKey}
              />
            </div>
          )}

          <audio ref={audioRef} src="/audio/begin-recording.wav" />
        </>
      )}

      {!isMicAvailable && (
        <span className="mt-72">Permission to use microhpone required.</span>
      )}

      {(isRecording || isSaving) && (
        <>
          <div
            className={clsx(
              'left-0 items-start',
              finishRecordingAnimationClassName,
            )}
          >
            <div
              className="w-3 bg-red-600"
              style={{ height: `${finishRecordingDragPercent * -1}%` }}
            ></div>
          </div>

          <div
            className={clsx(
              'right-0 items-end',
              finishRecordingAnimationClassName,
            )}
          >
            {isSaving && (
              <CircularProgress
                className="text-green-600"
                style={{ width: '1rem', height: '1rem' }}
              />
            )}
            <div
              className="w-3 bg-green-600"
              style={{ height: `${finishRecordingDragPercent}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
