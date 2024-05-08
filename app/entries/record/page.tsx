'use client';

import useRecordingAnimation from '@/lib/useRecordingAnimation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import uniqolor from 'uniqolor';

const RecordEntry = () => {
  const [flashingWord, setFlashingWord] = useState<'palate' | 'palette'>('palate');
  const [flashingWordColor, setFlashingWordColor] = useState<string>('');

  useEffect(() => {
    const flashingInterval = setInterval(() => {
      setFlashingWord(currentWord => currentWord === 'palate' ? 'palette' : 'palate');
      setFlashingWordColor(uniqolor.random().color);
    }, 2000);

    return () => clearInterval(flashingInterval);
  }, []);

  const record = () => {
    const button = document.querySelector('#record-button');
    const prompt = document.querySelector('#record-prompt');
    const cursor = document.querySelector('#record-cursor');

    if (button) {
      button.classList.add('hidden');
    }

    if (prompt) {
      prompt.classList.add('hidden');
    }

    if (cursor) {
      cursor.classList.remove('hidden');
    }

    useRecordingAnimation();
  };

  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <Link href="/entries">&lt; PAST ENTRIES</Link>
        <span>{new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
      </div>

      <canvas id="recording-animation" className="hidden self-center absolute animate-fade-in"></canvas>

      <div className="pt-32 pb-20 opacity-60">
        <h2 id="record-prompt" className="md:self-center">What's on your <span style={{ color: flashingWordColor }}>{flashingWord}</span>?</h2>
        <div id="record-cursor" className="w-1 h-9 bg-black animate-blink hidden"></div>
      </div>

      <button id="record-button" onClick={record} className="relative bg-red-600 p-8 self-center shadow-md rounded-full text-[0.6rem] hover:scale-110 w-fit"></button>
    </div>
  );
};

export default RecordEntry;