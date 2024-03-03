'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from '@mui/icons-material/Close';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import { useCallback, useContext, useState } from 'react';
/* import useSWR from 'swr';

import { fetcher } from '@/lib/fetcher';
 */
import { RandomColorContext } from '../providers/random-color.provider';
import { page as styles } from './styles';

const SignInWithPassphrase: React.FC= () => {
  const [ passphrase, setPassphrase ] = useState<string>('');
  const [ micListening, setMicListening ] = useState<boolean>(false);

  //const { data, mutate: mutateUser } = useSWR<object>('/passphrase/api', fetcher);

  const { primaryColor, secondaryColor } = useContext(RandomColorContext);
  
  const clearPassphrase = useCallback(() => {
    const passphraseForm = document.getElementById('passphraseForm');
    
    if (passphraseForm) {
      (passphraseForm as HTMLFormElement).reset();
    }

    setPassphrase('');
  }, [setPassphrase]);

  const toggleMic = useCallback(() => {
    setMicListening(listening => {
      if (!listening) {
        clearPassphrase();
      }

      return !listening;
    });
  }, [clearPassphrase]);

  return (
    <>
      <div className="flex flex-col items-center w-fit mx-auto z-10">
        <div className="flex items-center">
          {passphrase.trim() && 
            <button className="cursor-pointer" onClick={clearPassphrase}>
              <CloseIcon></CloseIcon>
            </button>
          }
          {micListening && <CircleIcon className="text-[0.625em] animate-pulse mr-2 text-red-500"></CircleIcon>}
          <form 
            id="passphraseForm" 
            className={`
              relative 
              p-[2px]
              rounded-[32px]
            `}
            style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`}}>
            <input 
              type="textarea" 
              className={`
                bg-white
                mx-auto 
                p-[0.625rem]
                text-inherit
                rounded-3xl
                placeholder:font-normal
                placeholder:text-sm
                ${micListening ? 'animate-mic-listening' : ''}
              `}
              placeholder={`${micListening ? 'Say' : 'Enter'} your passphrase`}
              onChange={e => setPassphrase(e.target.value)}
              maxLength={84}
              disabled={micListening}
            >
            </input>
          </form>
        </div>

        {!passphrase && 
          <button onClick={toggleMic} className={`${styles.actionButton} bg-red-500`}>
            {micListening && <CloseIcon fontSize="small"></CloseIcon>}
            {!micListening && <MicNoneOutlinedIcon fontSize="small"></MicNoneOutlinedIcon>}
          </button>
        }

        {passphrase && 
          <button onClick={() => {}} className={`${styles.actionButton} bg-green-500`}>
            <ArrowForwardIcon></ArrowForwardIcon>
          </button>
        }

        <span className="text-sm pt-8"><span>Don&apos;t have one?&nbsp;</span><span className="cursor-pointer underline" onClick={() => {}}>Create one.</span></span>
      </div>
    </>
  );
}

export default SignInWithPassphrase;