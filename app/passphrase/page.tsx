'use client';

import { RandomColorContext } from '@/providers/random-color.provider';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLongPress } from 'use-long-press';
import { page as styles } from './styles';

const MAX_PASSPHRASE_LENGTH = 100;

const SignInWithPassphrase = () => {
  const { primaryColor, secondaryColor } = useContext(RandomColorContext);
  const [micAvailable, setMicAvailable] = useState<boolean>(true);
  const [micListening, setMicListening] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const router = useRouter();

  let promptTimeout: NodeJS.Timeout | null = null;
  const actionButtonStyle = { backgroundColor: secondaryColor, color: primaryColor };

  const stopRecording = useCallback(() => {
    setMicListening(false);
    setShowPrompt(false);

    if (promptTimeout) {
      clearTimeout(promptTimeout);
    }

    if (recognition.current) {
      recognition.current.stop();
    }

    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
  }, [setMicListening, setShowPrompt]);

  const micToggle = useLongPress(useCallback(() => {
    setMicListening(true);
    
    promptTimeout = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);
  }, [setMicListening, setShowPrompt]), 
  { 
    onCancel: stopRecording, 
    onFinish: stopRecording,
    threshold: 300,
  });

  useEffect(() => {
    if (micListening) {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        setPassphrase(passphrase => passphrase.concat(' ', transcript.toLowerCase()));
      };

      recognition.current.onend = stopRecording;
      recognition.current.start();

      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream: MediaStream) => {
          mediaRecorder.current = new MediaRecorder(stream);

          mediaRecorder.current.onstop = () => {
            stopRecording();

            for (const track of stream.getTracks()) {
              track.stop();
            }
          };

          mediaRecorder.current.start();
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });
    }
  }, [micListening]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        // just asking for mic permission here so stop stream
        for (const track of stream.getTracks()) {
          track.stop();
        }
      })
      .catch(() => setMicAvailable(false));
  }, []);

  const logIn = async () => {
    await fetch('/api/passphrase', { 
      method: 'POST',
      body: JSON.stringify({ 
        passphrase: passphrase.substring(0, MAX_PASSPHRASE_LENGTH).trim() 
      }),
    }).catch(() => setPassphrase(''));// TODO: handle

    void router.push('/entries/record');
  };

  return (
    <div className="flex flex-col items-center justify-between font-extrabold h-screen overflow-hidden">
      <div className="flex items-center justify-between p-4 text-9xl w-max">
        <span>PALATE PALETTE</span>
      </div>

      {micAvailable &&
        <>
          <div className="p-8">
            {micListening && !passphrase && showPrompt && 
              <span className="text-xs">First time? Use a unique phrase and DO NOT forget it.</span>
            }
            {passphrase && 
              <div className="flex items-center">
                <span className="text-xl border-b-current border-b-2 border-dotted">{passphrase}</span>
                <button className="cursor-pointer ml-4" onClick={() => setPassphrase('')}>
                  <CloseIcon fontSize="small"></CloseIcon>
                </button>
              </div>
            }
          </div>

          <div className="mx-auto max-w-[4rem] mb-72">
            {(!passphrase || micListening) &&
              <button className={`${styles.actionButton} relative`} style={ micListening ? actionButtonStyle : {} } { ...micToggle() }>
                PRESS AND HOLD

                {micListening &&
                  <svg 
                    viewBox="0 0 200 200" 
                    width="200" 
                    height="200" 
                    fill={secondaryColor} 
                    className="absolute text-[1.0625rem] -top-[108%] -left-[106%] animate-spin"
                    style={{ animationDuration: '3.5s' }}
                  >
                    <defs>
                      <path 
                        id="circle" 
                        d="M 100, 100
                          m -75, 0
                          a 75, 75 0 1, 0 150, 0
                          a 75, 75 0 1, 0 -150, 0
                        "
                      >
                      </path>
                    </defs>
                    <text>
                      <textPath alignmentBaseline="middle" xlinkHref="#circle" style={{ letterSpacing: '0.75rem' }}>
                        SAY YOUR  PASSPHRASE
                      </textPath>
                    </text>
                  </svg>
                }
              </button>
            }
            {passphrase && !micListening && 
              <button className={`${styles.actionButton}`} style={ actionButtonStyle } onClick={logIn}>
                <EastIcon fontSize="large"></EastIcon>
              </button>
            }
          </div>
        </>
      }

      {!micAvailable && <span className="mb-72">Permission to use microhpone required.</span>}
    </div>
  );
}

export default SignInWithPassphrase;