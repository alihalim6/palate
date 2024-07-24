'use client';

import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLongPress } from 'use-long-press';

import { recordAudio, requestMicrophonePermission } from '@/lib/audio';
import { RandomColorContext } from '@/providers/random-color.provider';
import { SavePassphraseRequest } from '@/types';

import { page as styles } from './styles';

const MAX_PASSPHRASE_LENGTH = 100;

const SignInWithPassphrase = () => {
  const { primaryColor, secondaryColor } = useContext(RandomColorContext);
  const [isMicAvailable, setIsMicAvailable] = useState<boolean>(true);
  const [isMicListening, setIsMicListening] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const router = useRouter();

  let promptTimeout: NodeJS.Timeout | null = null;
  const actionButtonStyle = {
    backgroundColor: secondaryColor,
    color: primaryColor,
    border: 'none',
  };

  const stopRecording = () => {
    recognition?.current?.stop();
    mediaRecorder?.current?.stop();

    setIsMicListening(false);
    setShowPrompt(false);

    if (promptTimeout) {
      clearTimeout(promptTimeout);
    }
  };

  const micToggle = useLongPress(
    () => {
      setIsMicListening(true);

      recordAudio({
        recognition,
        handleTranscript: (transcript) =>
          setPassphrase((passphrase) =>
            passphrase.concat(' ', transcript.toLowerCase()),
          ),
        handleStop: stopRecording,
        mediaRecorder,
      });

      promptTimeout = setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    },
    {
      onCancel: stopRecording,
      onFinish: stopRecording,
      threshold: 275,
    },
  );

  useEffect(() => {
    requestMicrophonePermission().catch(() => setIsMicAvailable(false));
  }, []);

  const logIn = async () => {
    await fetch('/api/passphrase', {
      method: 'POST',
      body: JSON.stringify({
        passphrase: passphrase.substring(0, MAX_PASSPHRASE_LENGTH).trim(),
      } satisfies SavePassphraseRequest),
    });

    router.push('/');
  };

  return (
    <div className="flex h-screen flex-col items-center justify-between overflow-hidden font-extrabold">
      <div className="flex w-max items-center justify-between p-4 text-9xl">
        <span className="bg-[url('/images/colorful-background.jpg')] bg-contain bg-clip-text bg-center text-transparent">
          PALATE PALETTE
        </span>
      </div>

      {isMicAvailable && (
        <>
          <div className="p-8">
            {isMicListening && !passphrase && showPrompt && (
              <span className="text-xs">
                First time? Use a unique phrase and DO NOT forget it.
              </span>
            )}
            {passphrase && (
              <div className="flex items-center">
                <span className="border-b-2 border-dotted border-b-current text-xl">
                  {passphrase}
                </span>
                <button
                  className="ml-4 cursor-pointer"
                  onClick={() => setPassphrase('')}
                >
                  <CloseIcon fontSize="small"></CloseIcon>
                </button>
              </div>
            )}
          </div>

          <div className="mx-auto mb-72 max-w-[4rem]">
            {(!passphrase || isMicListening) && (
              <button
                className={`${styles.actionButton} relative`}
                style={isMicListening ? actionButtonStyle : {}}
                {...micToggle()}
              >
                PRESS AND HOLD
                {isMicListening && (
                  <svg
                    viewBox="0 0 200 200"
                    width="200"
                    height="200"
                    fill={secondaryColor}
                    className="absolute -left-[106%] -top-[108%] animate-spin text-[1.0625rem]"
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
                      ></path>
                    </defs>
                    <text>
                      <textPath
                        alignmentBaseline="middle"
                        xlinkHref="#circle"
                        style={{ letterSpacing: '0.75rem' }}
                      >
                        SAY YOUR PASSPHRASE
                      </textPath>
                    </text>
                  </svg>
                )}
              </button>
            )}
            {passphrase && !isMicListening && (
              <button
                className={clsx(styles.actionButton, 'hover:scale-110')}
                style={actionButtonStyle}
                onClick={logIn}
              >
                <EastIcon fontSize="large"></EastIcon>
              </button>
            )}
          </div>
        </>
      )}

      {!isMicAvailable && (
        <span className="mb-72">Permission to use microhpone required.</span>
      )}
    </div>
  );
};

export default SignInWithPassphrase;
