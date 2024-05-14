import { MutableRefObject } from 'react';

interface RecordAudio {
  recognition: MutableRefObject<SpeechRecognition | null>;
  handleTranscript: (transcript: string) => void;
  stopRecording: () => void;
  mediaRecorder: MutableRefObject<MediaRecorder | null>;
}

export const recordAudio = ({ recognition, handleTranscript, stopRecording, mediaRecorder }: RecordAudio) => {
  recognition.current = new webkitSpeechRecognition();
  recognition.current.continuous = true;
  recognition.current.interimResults = false;

  const handleStop = () => {
    stopRecording();
    recognition?.current?.stop();
    mediaRecorder?.current?.stop();
  };

  recognition.current.onresult = (event) => {
    const result = event.results[event.results.length - 1];
    const transcript = result[0].transcript;
    handleTranscript(transcript);
  };

  recognition.current.onend = handleStop;
  recognition.current.start();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream: MediaStream) => {
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.onstop = () => {
        handleStop();

        for (const track of stream.getTracks()) {
          track.stop();
        }
      };
      
      mediaRecorder.current.ondataavailable = () => {

      };
      
      mediaRecorder.current.start();
    })
    .catch((error) => {
      console.error('Error accessing microphone:', error);
    });
};

export const requestMicrophonePermission = () => {
  return navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream: MediaStream) => {
      // just asking for mic permission here so stop stream
      for (const track of stream.getTracks()) {
        track.stop();
      }
    });  
}