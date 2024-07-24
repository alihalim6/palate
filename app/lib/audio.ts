import { MutableRefObject } from 'react';

interface RecordAudio {
  recognition: MutableRefObject<SpeechRecognition | null>;
  handleTranscript: (transcript: string) => void;
  handleStop: () => void;
  handleAudioChunks?: (audioChunks: Blob[]) => void;
  mediaRecorder: MutableRefObject<MediaRecorder | null>;
}

export function recordAudio({
  recognition,
  handleTranscript,
  handleStop,
  handleAudioChunks,
  mediaRecorder,
}: RecordAudio) {
  recognition.current = new webkitSpeechRecognition();
  recognition.current.continuous = true;
  recognition.current.interimResults = false;
  const audioChunks: Blob[] = [];

  recognition.current.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    handleTranscript(transcript);
  };

  recognition.current.onend = handleStop;
  recognition.current.start();

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream: MediaStream) => {
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.onstop = () => {
        handleStop();

        for (const track of stream.getTracks()) {
          track.stop();
        }
      };

      mediaRecorder.current.ondataavailable = ({ data }) => {
        audioChunks.push(data);

        if (handleAudioChunks) handleAudioChunks(audioChunks);
      };

      mediaRecorder.current.start(5000);
    })
    .catch((error) => {
      handleStop();
      console.error('There was an error using the mic:', error);
    });
}

export function requestMicrophonePermission() {
  return navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream: MediaStream) => {
      // just asking for mic permission here so stop stream
      for (const track of stream.getTracks()) {
        track.stop();
      }
    });
}

export function blobToBuffer(blob: Blob): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      resolve(buffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
