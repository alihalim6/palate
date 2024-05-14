import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useLongPress } from 'use-long-press';

interface FinishRecordingProps { 
  onFinish: () => void,
  onSave?: () => void, 
  onDiscard?: () => void,
  variant?: 'save' | 'discard',
}

const FINISH_THRESHOLD_SECS = 3;

const FinishRecording = (
  { 
    onFinish,
    onSave, 
    onDiscard,
    variant = 'save',
  } : FinishRecordingProps
) => {
  const [showRestOfCircles, setShowRestOfCircles] = useState<boolean>(false);
  
  const circleStyle = `
    cursor-pointer 
    bg-black 
    text-white
    w-12
    h-12
    rounded-full 
    hover:scale-105 
    flex 
    items-center 
    justify-center
    shadow-2xl
  `;

  const isSave = useMemo(() => variant === 'save', [variant]);

  const finishRecording = useLongPress(() => {
    onFinish();

    if (onSave) onSave();
    if (onDiscard) onDiscard();
  },
  { 
    onStart: () => setShowRestOfCircles(true),
    onCancel: () => setShowRestOfCircles(false), 
    onFinish: () => setShowRestOfCircles(false),
    threshold: (FINISH_THRESHOLD_SECS + 1) * 1000, // +1 -> give time for saved/discarded verbiage to show
  });

  return (
    <div className={clsx('flex flex-col-reverse gap-y-3 self-end items-start', isSave && 'items-end')}>
      <motion.div
        className={circleStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        { ...finishRecording() }
      >
        {isSave ? <SaveIcon /> : <DeleteIcon />}
      </motion.div>

      {showRestOfCircles && Array.from({ length: FINISH_THRESHOLD_SECS }).map((_, index) => (
        <motion.div
          key={index}
          className={clsx(circleStyle, 'bg-white !text-black border-4 border-black pointer-events-none')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: index }}
        >
          {FINISH_THRESHOLD_SECS - index}
        </motion.div>
      ))}

      {showRestOfCircles && (
        <motion.div
          className={clsx('rounded-3xl text-sm', isSave && 'bg-black text-white p-3', !isSave && 'p-2 bg-white text-black border-4 border-black')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: FINISH_THRESHOLD_SECS }}
        >
          {isSave ? 'SAVING...' : 'DISCARDING...'}
        </motion.div>
      )}
    </div>
  );
};

export default FinishRecording;
