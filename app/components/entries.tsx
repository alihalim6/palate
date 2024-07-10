import { Entry } from '@/types';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import NorthIcon from '@mui/icons-material/North';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SouthIcon from '@mui/icons-material/South';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useRef } from 'react';
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

interface EntriesProps {
  entries: Entry[];
}

const MAX_TRANSCRIPT_CHARS = 200;

const PlaybackControls = ({ backgroundColor }: { backgroundColor: string }) => {
  const controlSize = '3.5rem';
  const controlStyle = { height: controlSize, width: controlSize };
  const controlClassName = 'cursor-pointer border-2 border-current hover:bg-current';

  return (
    <div className="flex w-fit mx-auto">
      { /*conditional bg:current and color:backgroundColor for playing, ff-ing, rewinding */}
      <FastRewindIcon style={controlStyle} className={controlClassName} />
      <PlayArrowIcon style={controlStyle} className={controlClassName} />
      <FastForwardIcon style={controlStyle} className={controlClassName} />
    </div>
  );
};

const Entries = ({ entries }: EntriesProps) => {
  const swiperRef = useRef<SwiperClass>();
  const nextPrevEntryClassName = 'absolute p-3 flex items-center gap-x-1 w-3/4 text-xs cursor-pointer whitespace-nowrap';

  const entryDateAndTime = (createdAt: Date) => {
    return format(createdAt, 'MMM d, yyyy h:mma'); 
  };

  const previousEntry = (index: number) => {
    return entries[index - 1];
  };

  const nextEntry = (index: number) => {
    return entries[index + 1];
  };

  return (
    <Swiper 
      initialSlide={entries.length - 1} 
      direction="vertical" 
      className="cursor-grabbing h-screen" 
      freeMode={{ 
        sticky: true, 
        minimumVelocity: 0.4,
      }} 
      modules={[FreeMode]}
      onSwiper={(swiper: SwiperClass) => {
        swiperRef.current = swiper;
      }}
    >
      {entries.map((entry, index) => (
        <SwiperSlide
          key={entry.id}
          className="!flex flex-col justify-center items-center gap-y-10"
          style={{
            backgroundColor: entry.backgroundColor ?? 'white',
            color: entry.textColor ?? 'black',
          }}
        >
          <h1 className="text-2xl font-bold">{ entryDateAndTime(entry.createdAt) }</h1>
          <p className="text-lg leading-10 px-6">{ `${entry.transcript?.substring(0, MAX_TRANSCRIPT_CHARS)}...` }</p>
          <PlaybackControls backgroundColor={entry.backgroundColor ?? 'white'} />

          {/* Upper left */}
          {!!previousEntry(index) && (
            <button 
              onClick={() => swiperRef.current?.slidePrev()}
              className={clsx('top-0 left-0', nextPrevEntryClassName)}
              style={{ backgroundColor: previousEntry(index).backgroundColor ?? 'black', color: previousEntry(index).textColor ?? 'white' }}
            >
              <NorthIcon />
              <span className="border py-[0.1rem] px-[0.2rem]" style={{ borderColor: previousEntry(index).textColor ?? 'white' }}>
                {format(previousEntry(index).createdAt, 'MMM d')}
              </span>
              <p className="overflow-hidden text-ellipsis">{previousEntry(index).transcript}</p>
            </button>
          )}
          
          {/* Bottom right */}
          {!!nextEntry(index) && (
            <button 
              onClick={() => swiperRef.current?.slideNext()}
              className={clsx('bottom-0 right-0', nextPrevEntryClassName)} 
              style={{ backgroundColor: nextEntry(index).backgroundColor ?? 'black', color: nextEntry(index).textColor ?? 'white' }}
            >
              <SouthIcon />
              <span className="border py-[0.1rem] px-[0.2rem]" style={{ borderColor: nextEntry(index).textColor ?? 'white' }}>
                {format(nextEntry(index).createdAt, 'MMM d')}
              </span>
              <p className="overflow-hidden text-ellipsis">{nextEntry(index).transcript}</p>
            </button>
          )}
          
        </SwiperSlide>
      ))}
    </Swiper>
  );
};


export default Entries;