'use client';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
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
  const [transcript, setTranscript] = useState<string>(''); //(`There's something truly magical about the early hours of the day, when the world is still waking up and the air is crisp and fresh. As someone who has never been much of a morning person, I recently decided to challenge myself to embrace the dawn and see what all the fuss was about. What I discovered was a whole new appreciation for the beauty and tranquility that comes with early morning hikes. There's something truly magical about the early hours of the day, when the world is still waking up and the air is crisp and fresh. As someone who has never been much of a morning person, I recently decided to challenge myself to embrace the dawn and see what all the fuss was about. What I discovered was a whole new appreciation for the beauty and tranquility that comes with early morning hikes.`);
  const [isRecording, setIsRecording] = useState<boolean>(false); //
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(true);
  const [audioChunks, setAudioChunks] = useState<Blob[] | null>(null);
  const [finishRecordingKey, setFinishRecordingKey] = useState<number>(0); // to trigger rerender/reset of drag element
  const [finishRecordingDragPercent, setFinishRecordingDragPercent] =
    useState(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [flashingWordColor, setFlashingWordColor] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const router = useRouter();

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

  const transcriptOpacity = useMemo(() => {
    if (finishRecordingDragPercent > 0) return;

    return 1 + finishRecordingDragPercent * 0.01;
  }, [finishRecordingDragPercent]);

  const isSliding = useMemo(() => {
    return finishRecordingDragPercent !== 0;
  }, [finishRecordingDragPercent]);

  const finishRecordingLabel = useMemo(() => {
    if (!isRecording) return 'PAST ENTRIES';

    return finishRecordingDragPercent > 0
      ? 'SLIDE RIGHT TO SAVE'
      : 'SLIDE LEFT TO DISCARD';
  }, [finishRecordingDragPercent]);

  const finishRecordingLabelColor = useMemo(() => {
    if (!isRecording) return 'black';
    return finishRecordingDragPercent > 0 ? 'green' : 'red';
  }, [finishRecordingDragPercent]);

  const finishRecordingIcon = useMemo(() => {
    if (!isRecording) return null;
    return finishRecordingDragPercent > 0 ? (
      <CheckIcon htmlColor="green" />
    ) : (
      <CloseIcon htmlColor="red" />
    );
  }, [finishRecordingDragPercent]);

  const stopRecording = () => {
    recognition?.current?.stop();
    mediaRecorder?.current?.stop();
    setFinishRecordingDragPercent(0);
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
      setFinishRecordingKey((previousKey) => previousKey + 1); // force re-render of FinishRecording component to reset state
      setFinishRecordingDragPercent(0);
    }
  };

  return (
    <div className="flex h-screen flex-col p-8 pb-20">
      <Ticker
        label={finishRecordingLabel}
        navPath="/entries"
        direction="left"
        className={clsx('fixed mb-8', isRecording && !isSliding && 'invisible')}
        animate={!isSliding}
        translateXPerc={finishRecordingDragPercent}
        icon={finishRecordingIcon}
        labelColor={finishRecordingLabelColor}
      />

      <div className="mt-14 flex items-center justify-end">
        <span>
          {new Date().toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {isMicAvailable && (
        <>
          <div className="animate-fade-in pb-16 pt-8 opacity-60">
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
              {/* transcript */}
              {hasTranscript && !isSaving && (
                <p
                  className="leading-8 transition-opacity"
                  style={{ opacity: transcriptOpacity }}
                >
                  {transcript}{' '}
                  {isRecording && <span className="animate-blink">|</span>}
                </p>
              )}

              {isSaving && (
                <svg
                  viewBox="0 0 200 200"
                  width="200"
                  height="200"
                  className="mx-auto animate-spin text-[1.0625rem]"
                  style={{ animationDuration: '2.5s' }}
                >
                  <defs>
                    <path
                      id="circle"
                      d="M 100, 100
                        m -75, 0
                        a 75, 75 0 1, 0 150, 0
                        a 75, 75 0 1, 0 -150, 0
                      "
                    ></path>
                  </defs>
                  <text>
                    <textPath
                      alignmentBaseline="middle"
                      xlinkHref="#circle"
                      style={{ letterSpacing: '0.79rem' }}
                    >
                      SAVING SAVING SAVING
                    </textPath>
                  </text>
                </svg>
              )}

              {/* blinking cursor */}
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

          {isRecording && !isSaving && (
            <div className="sticky bottom-4 mt-auto flex justify-center rounded-3xl bg-gray-100">
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
    </div>
  );
};

export default Home;
