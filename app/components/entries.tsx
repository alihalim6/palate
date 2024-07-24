import 'swiper/css';

import AddIcon from '@mui/icons-material/Add';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useMemo, useRef, useState } from 'react';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import Playback from '@/components/playback';
import { Entry } from '@/types';

interface EntriesProps {
  entries: Entry[];
}

type Subset<T, K extends keyof T> = Pick<T, K>;
type InfoOptions = Subset<Entry, 'transcript' | 'backgroundColor' | 'textColor'>;
type InfoValues = Subset<Entry, 'transcript' | 'backgroundColorReason' | 'textColorReason'>;

const MAX_TRANSCRIPT_CHARS = 75;

const Entries = ({ entries }: EntriesProps) => {
  const [currentEntryId, setCurrentEntryId] = useState<string>(
    entries[entries.length - 1]?.id ?? '',
  );
  const [showingInfo, setShowingInfo] = useState<boolean>(false);
  const [selectedInfo, setSelectedInfo] = useState<keyof InfoOptions>('transcript');
  const swiperRef = useRef<SwiperClass>();
  const infoRefs = useRef<Record<string, HTMLParagraphElement | null>>({});

  const infoMap: Record<keyof InfoOptions, keyof InfoValues> = {
    transcript: 'transcript',
    backgroundColor: 'backgroundColorReason',
    textColor: 'textColorReason',
  };

  const entryDateAndTime = (createdAt: Date) => format(createdAt, 'MMM d, yyyy / h:mma');
  const slideContentClassName = 'flex flex-col items-center justify-center p-6 animate-fade-in max-w-3xl';

  const transcriptInfoSelected = useMemo(() => selectedInfo === 'transcript', [selectedInfo]);
  const backgroundColorInfoSelected = useMemo(() => selectedInfo === 'backgroundColor', [selectedInfo]);
  const textColorInfoSelected = useMemo(() => selectedInfo === 'textColor', [selectedInfo]);

  const handleSlideChange = (swiper: SwiperClass) => {
    setCurrentEntryId(entries[swiper.activeIndex].id);
    setSelectedInfo('transcript');
    setShowingInfo(false);
  };

  const scrollInfo = (direction: 'up' | 'down', entryId: string) => {
    const infoRef = infoRefs.current[entryId];
    
    if (!infoRef) return;

    const SCROLL_AMOUNT = 100;
    const currentTop = infoRef.scrollTop;
    const newTop = direction === 'up' ? currentTop - SCROLL_AMOUNT : currentTop + SCROLL_AMOUNT;
    infoRef.scrollTo({ top: newTop, behavior: 'smooth' });
  };

  const setInfoValueRef = (node: HTMLParagraphElement | null, entryId: string) => {
    if (!node) return;

    infoRefs.current[entryId] = node;
  }

  return (
    <div className="flex gap-x-4">
      <div className="flex h-screen flex-col">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={clsx(
              'w-[10px] flex-1 cursor-pointer opacity-100 transition-opacity',
              currentEntryId !== entry.id && 'opacity-30',
            )}
            style={{ backgroundColor: entry.backgroundColor }}
            onClick={() => swiperRef.current?.slideTo(index)}
          ></div>
        ))}
      </div>
      <Swiper
        initialSlide={entries.length - 1}
        direction="vertical"
        className="h-screen cursor-grabbing"
        freeMode={{
          sticky: true,
          minimumVelocity: 0.5,
          momentumRatio: 0.5,
        }}
        modules={[FreeMode]}
        onSwiper={(swiper: SwiperClass) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {entries.map((entry) => (
          <SwiperSlide key={entry.id}>
            <div className="flex h-full flex-col items-center justify-center gap-y-6">
              <h1 className="text-2xl font-bold">
                {entryDateAndTime(entry.createdAt)}
              </h1>
              <div
                style={{
                  backgroundColor: entry.backgroundColor,
                  color: entry.textColor,
                }}
              >
                {!showingInfo && (
                  <div className={slideContentClassName}>
                    <button
                      className="self-end"
                      onClick={() => setShowingInfo(true)}
                    >
                      <InfoOutlinedIcon className="mb-6 cursor-pointer" />
                    </button>
                    <p className="text-5xl leading-[3rem]">
                      {`${entry.transcript?.substring(0, MAX_TRANSCRIPT_CHARS)}...`}
                    </p>
                  </div>
                )}
                {showingInfo && (
                  <div className={clsx('w-screen', slideContentClassName)}>
                    <button
                      className="self-end"
                      onClick={() => setShowingInfo(false)}
                    >
                      <GraphicEqIcon className="mb-6 cursor-pointer" />
                    </button>
                    <div className="border-2 border-current p-1 m-2 w-full">
                      <div className="border-b-[1px] border-current">
                        <h1 className="text-3xl">Facts</h1>
                      </div>
                      <div className="border-b-[5px] border-current flex flex-col py-1 gap-y-[2px]">
                        <h4 className="text-sm font-normal">1 serving per container</h4>
                        <div className="flex justify-between font-semibold text-base">
                          <h3>Serving size</h3>
                          <h3>1 Entry</h3>
                        </div>
                      </div>
                      <div className="border-b-4 border-current flex flex-col py-1 tracking-normal">
                        <h4 className="text-xs">Amount Per Serving</h4>
                        <div className="flex justify-between text-2xl">
                          <h2 className="font-semibold">Duration</h2>
                          <h2>4:36</h2>
                        </div>
                      </div>
                      <div className="flex flex-col text-xs py-1">
                        <h6 className="text-right border-b-[1px] border-current w-full text-[10px]">% Daily Value</h6>
                        <div
                          className={clsx('flex justify-between border-b-[1px] border-current py-[1px] cursor-pointer', transcriptInfoSelected && 'p-[2px]')}
                          onClick={() => setSelectedInfo('transcript')}
                          style={{ backgroundColor: transcriptInfoSelected ? entry.textColor : '', color: transcriptInfoSelected ? entry.backgroundColor : '' }}
                        >
                          <h6 className="font-bold">Transcript</h6>
                          <h6>100%</h6>
                        </div>
                        <div
                          className={clsx('flex justify-between border-b-[1px] border-current py-[1px] cursor-pointer', backgroundColorInfoSelected && 'p-[2px]')}
                          onClick={() => setSelectedInfo('backgroundColor')}
                          style={{ backgroundColor: backgroundColorInfoSelected ? entry.textColor : '', color: backgroundColorInfoSelected ? entry.backgroundColor : '' }}
                        >
                          <div className="flex gap-x-1">
                            <h6 className="font-bold">Background Color</h6>
                            <span className="font-normal">{entry.backgroundColor}</span>
                          </div>
                          <h6>100%</h6>
                        </div>
                        <div
                          className={clsx('flex justify-between border-b-[5px] border-current py-[1px] cursor-pointer', textColorInfoSelected && 'p-[2px]')}
                          onClick={() => setSelectedInfo('textColor')}
                          style={{ backgroundColor: textColorInfoSelected ? entry.textColor : '', color: textColorInfoSelected ? entry.backgroundColor : '' }}
                        >
                          <div className="flex gap-x-1">
                            <h6 className="font-bold">Text Color</h6>
                            <span className="font-normal">{entry.textColor}</span>
                          </div>
                          <h6>100%</h6>
                        </div>
                        <div className="flex justify-between gap-x-2">
                          <p className="pt-2 max-h-32 overflow-hidden" ref={(node) => setInfoValueRef(node, entry.id)}>{entry[infoMap[selectedInfo]] ?? ''}</p>
                          <div className="flex flex-col gap-y-1 items-center">
                            <RemoveIcon className="cursor-pointer" onClick={() => scrollInfo('up', entry.id)} />
                            <div className="flex-1 w-1 bg-current"></div>
                            <AddIcon className="cursor-pointer" onClick={() => scrollInfo('down', entry.id)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Playback entry={entry} currentEntryId={currentEntryId} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Entries;