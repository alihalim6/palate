'use client';

import FinishRecording from '@/components/finish-recording';
import { recordAudio, requestMicrophonePermission } from '@/lib/audio';
import useUser from '@/lib/useUser';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import uniqolor from 'uniqolor';

const Home = () => {
  const { isLoading } = useUser();
  const [flashingWord, setFlashingWord] = useState<'palate' | 'palette'>('palate');
  const [flashingWordColor, setFlashingWordColor] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(true);

  useEffect(() => {
    const flashingInterval = setInterval(() => {
      setFlashingWord(currentWord => currentWord === 'palate' ? 'palette' : 'palate');
      setFlashingWordColor(uniqolor.random().color);
    }, 2000);

    return () => clearInterval(flashingInterval);
  }, []);
  
  useEffect(() => {
    requestMicrophonePermission().catch(() => setIsMicAvailable(false));
  }, []);

  const hasTranscription = useMemo(() => transcription.length > 0, [transcription]);

  const stopRecording = () => {
    setIsRecording(false);
  };

  const saveEntry = () => {
    stopRecording();
  };

  const record = async () => {
    setIsRecording(true);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(400);
    }

    audioRef.current?.play();

    // animation library internally uses window object, so lazy load it 
    // to avoid server-side error seen when using normal import
    const recordingAnimation = (await import('@/lib/recording.animation')).default;
    recordingAnimation();

    recordAudio({
      recognition,
      handleTranscript: (transcript) => setTranscription(transcription => transcription.concat(' ', transcript.toLowerCase())),
      stopRecording,
      mediaRecorder,
    });
  };
  
  if (isLoading) return <>LOADING...</>;

  return (
    <div className="flex flex-col p-6 h-screen">
      <div className="flex items-center justify-between">
        <Link href="/entries">&lt; PAST ENTRIES</Link>
        <span>{new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
      </div>

      {isMicAvailable && (
        <>
          {isRecording && <canvas id="recording-animation" className="hidden self-center absolute animate-fade-in"></canvas>}

          <div className="py-16 opacity-60">
            <h2 className={clsx('md:self-center', (isRecording || hasTranscription) && 'hidden')}>What's on your <span style={{ color: flashingWordColor }}>{flashingWord}</span>?</h2>
            <div className="flex items-center mt-14">
              {hasTranscription && (
                <span className={clsx('leading-8 transition-opacity', !isRecording && 'opacity-20')}>{transcription} {isRecording && <span className="animate-blink">|</span>}</span>
              )}
              {isRecording && !hasTranscription && <div className={clsx('ml-1 w-1 h-9 bg-black animate-blink', isRecording ? 'block' : 'hidden')}></div>}
            </div>
          </div>

          <button 
            onClick={record} 
            className={clsx(
              'relative bg-red-600 p-8 self-center shadow-md rounded-full text-[0.6rem] hover:scale-110 w-fit', 
              (isRecording || hasTranscription) && 'hidden',
            )}
          ></button>
          
          {isRecording && (
            <div className="flex justify-between py-6 z-10 sticky bottom-0 flex-grow">
              <FinishRecording onFinish={stopRecording} onDiscard={() => setTranscription('')} variant="discard" />
              <FinishRecording onFinish={stopRecording} onSave={saveEntry} />
            </div>
          )}
        
          <audio ref={audioRef} src="/audio/begin-recording.wav" />
        </>
      )}
      
      {!isMicAvailable && <span className="mt-72">Permission to use microhpone required.</span>}
    </div>
  );
}

export default Home;