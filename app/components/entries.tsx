import 'swiper/css';

import AddIcon from '@mui/icons-material/Add';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import Playback from '@/components/playback';
import { entryDurationString } from '@/lib/helpers';
import { Entry } from '@/types';

interface EntriesProps {
  entries: Entry[];
}

const LONG_CHUNK_THRESHOLD = 75;

const Entries = ({ entries }: EntriesProps) => {
  const [currentEntryId, setCurrentEntryId] = useState<string>(
    entries[entries.length - 1]?.id ?? '',
  );
  const [showingTranscriptChunk, setShowingTranscriptChunk] =
    useState<boolean>(false);
  const [selectedInfo, setSelectedInfo] = useState<
    'transcript' | 'backgroundColor' | 'textColor'
  >('transcript');
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const swiperRef = useRef<SwiperClass>();
  const infoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const transcriptInfoSelected = useMemo(
    () => selectedInfo === 'transcript',
    [selectedInfo],
  );
  const backgroundColorInfoSelected = useMemo(
    () => selectedInfo === 'backgroundColor',
    [selectedInfo],
  );
  const textColorInfoSelected = useMemo(
    () => selectedInfo === 'textColor',
    [selectedInfo],
  );

  const slideContentClassName =
    'flex flex-col items-center justify-start w-auto h-full p-8 pt-16 animate-fade-in';

  const handleSlideChange = (swiper: SwiperClass) => {
    const currentEntry = entries[swiper.activeIndex];
    setCurrentEntryId(currentEntry.id);
    setSelectedInfo('transcript');

    if (showingTranscriptChunk && !currentEntry.metaTranscript) {
      setShowingTranscriptChunk(false);
    }
  };

  const scrollInfo = (direction: 'up' | 'down', entryId: string) => {
    const infoRef = infoRefs.current[entryId];

    if (!infoRef) return;

    const SCROLL_AMOUNT = 100;
    const currentTop = infoRef.scrollTop;
    const newTop =
      direction === 'up'
        ? currentTop - SCROLL_AMOUNT
        : currentTop + SCROLL_AMOUNT;
    infoRef.scrollTo({ top: newTop, behavior: 'smooth' });
  };

  const setInfoValueRef = useCallback(
    (node: HTMLParagraphElement | null, entryId: string) => {
      if (!node) return;

      infoRefs.current[entryId] = node;
    },
    [],
  );

  const currentEntry = useMemo(() => {
    return entries.find((entry) => entry.id === currentEntryId);
  }, [entries, currentEntryId]);

  const currentChunk = useMemo(() => {
    if (currentEntry?.metaTranscript) {
      if (
        elapsedTime >=
        currentEntry.metaTranscript[currentEntry.metaTranscript.length - 1]
          ?.endTime
      ) {
        return currentEntry.metaTranscript[0].words;
      }

      return (
        currentEntry.metaTranscript.find((chunk) => chunk.endTime > elapsedTime)
          ?.words ?? 'Loading...'
      );
    }

    return 'Loading...';
  }, [currentEntry, elapsedTime]);

  const selectedInfoValue = (entry: Entry) => {
    if (transcriptInfoSelected) {
      return (
        entry.metaTranscript?.map((chunk) => chunk.words).join('\n') ??
        entry.transcript
      );
    }

    if (backgroundColorInfoSelected) return entry.backgroundColorReason ?? '';
    if (textColorInfoSelected) return entry.textColorReason ?? '';
  };

  const entryDateAndTime = (createdAt: Date) =>
    format(createdAt, 'MMM d, yyyy @ h:mma');

  return (
    <div className="flex h-screen">
      <div className="flex h-screen flex-col">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={clsx(
              'relative left-[8px] w-[8px] flex-1 cursor-pointer opacity-100 transition-all',
              currentEntryId !== entry.id && '!left-0 opacity-30',
            )}
            style={{ backgroundColor: entry.backgroundColor }}
            onClick={() => swiperRef.current?.slideTo(index)}
          ></div>
        ))}
      </div>
      <div className="mx-auto flex w-[90%] min-w-0 flex-col overflow-hidden">
        <Swiper
          initialSlide={entries.length - 1}
          direction="vertical"
          className="w-full cursor-grabbing"
          freeMode={{
            sticky: true,
            minimumVelocity: 0.1,
            momentumRatio: 0.1,
          }}
          modules={[FreeMode]}
          onSwiper={(swiper: SwiperClass) => {
            swiperRef.current = swiper;

            if (entries?.at(entries.length - 1)?.metaTranscript)
              setShowingTranscriptChunk(true);
          }}
          onSlideChange={handleSlideChange}
        >
          {entries.map((entry) => (
            <SwiperSlide key={entry.id}>
              <div
                className="size-full rounded"
                style={{
                  backgroundColor: entry.backgroundColor,
                  color: entry.textColor,
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  width="200"
                  height="200"
                  className={clsx(
                    'absolute -top-6 right-0 z-10 rotate-[-40deg] scale-[0.55] rounded-full bg-white text-[1.18rem] shadow-md',
                    showingTranscriptChunk && 'left-0',
                  )}
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
                      className="tracking-[0.72rem]"
                    >
                      {entryDateAndTime(entry.createdAt)}
                    </textPath>
                  </text>
                </svg>
                {showingTranscriptChunk && (
                  <div className={slideContentClassName}>
                    <button
                      onClick={() => setShowingTranscriptChunk(false)}
                      className="self-end"
                    >
                      <InfoOutlinedIcon className="mb-6 cursor-pointer" />
                    </button>
                    <p
                      className={clsx(
                        'my-auto text-5xl leading-[3rem]',
                        currentChunk.length > LONG_CHUNK_THRESHOLD &&
                          'text-[2rem] leading-normal',
                      )}
                    >
                      {currentChunk}
                    </p>
                  </div>
                )}
                {!showingTranscriptChunk && (
                  <div className={slideContentClassName}>
                    {!!entry.metaTranscript && (
                      <button
                        onClick={() => setShowingTranscriptChunk(true)}
                        className="self-start"
                      >
                        <GraphicEqIcon className="mb-6 cursor-pointer" />
                      </button>
                    )}
                    <div className="flex size-full items-center gap-x-2">
                      <div
                        className="m-2 size-full overflow-scroll border-2 border-current p-1"
                        ref={(node) => setInfoValueRef(node, entry.id)}
                      >
                        <div className="border-b border-current">
                          <h1 className="text-3xl">Facts</h1>
                        </div>
                        <div className="flex flex-col gap-y-[2px] border-b-[5px] border-current py-1 short:hidden">
                          <h4 className="text-sm font-normal">
                            1 serving per container
                          </h4>
                          <div className="flex justify-between text-base font-semibold">
                            <h3>Serving size</h3>
                            <h3>1 Entry</h3>
                          </div>
                        </div>
                        <div className="flex flex-col border-b-4 border-current py-1 tracking-normal short:hidden">
                          <h4 className="text-xs">Amount Per Serving</h4>
                          <div className="flex justify-between text-2xl">
                            <h2 className="font-semibold">Duration</h2>
                            <h2>{entryDurationString(entry) ?? '??'}</h2>
                          </div>
                        </div>
                        <div className="flex flex-col py-1 text-xs">
                          <h6 className="w-full border-b border-current text-right text-[10px]">
                            % Daily Value
                          </h6>
                          <div
                            className={clsx(
                              'flex cursor-pointer justify-between border-b border-current py-px',
                              transcriptInfoSelected && 'p-[2px]',
                            )}
                            onClick={() => setSelectedInfo('transcript')}
                            style={{
                              backgroundColor: transcriptInfoSelected
                                ? entry.textColor
                                : '',
                              color: transcriptInfoSelected
                                ? entry.backgroundColor
                                : '',
                            }}
                          >
                            <h6 className="font-bold">Transcript</h6>
                            <h6>100%</h6>
                          </div>
                          <div
                            className={clsx(
                              'flex cursor-pointer justify-between border-b border-current py-px',
                              backgroundColorInfoSelected && 'p-[2px]',
                            )}
                            onClick={() => setSelectedInfo('backgroundColor')}
                            style={{
                              backgroundColor: backgroundColorInfoSelected
                                ? entry.textColor
                                : '',
                              color: backgroundColorInfoSelected
                                ? entry.backgroundColor
                                : '',
                            }}
                          >
                            <div className="flex gap-x-1">
                              <h6 className="font-bold">Background Color</h6>
                              <span className="font-normal">
                                {entry.backgroundColor}
                              </span>
                            </div>
                            <h6>100%</h6>
                          </div>
                          <div
                            className={clsx(
                              'flex cursor-pointer justify-between border-b-[5px] border-current py-px',
                              textColorInfoSelected && 'p-[2px]',
                            )}
                            onClick={() => setSelectedInfo('textColor')}
                            style={{
                              backgroundColor: textColorInfoSelected
                                ? entry.textColor
                                : '',
                              color: textColorInfoSelected
                                ? entry.backgroundColor
                                : '',
                            }}
                          >
                            <div className="flex gap-x-1">
                              <h6 className="font-bold">Text Color</h6>
                              <span className="font-normal">
                                {entry.textColor}
                              </span>
                            </div>
                            <h6>100%</h6>
                          </div>
                        </div>
                        <div className="max-h-full text-xs">
                          <p className="whitespace-pre-wrap pb-1 pt-2">
                            {selectedInfoValue(entry)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-y-6">
                        <RemoveIcon
                          className="cursor-pointer"
                          onClick={() => scrollInfo('up', entry.id)}
                        />
                        <AddIcon
                          className="cursor-pointer"
                          onClick={() => scrollInfo('down', entry.id)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {currentEntry && (
          <Playback
            entry={currentEntry}
            audioTimeUpdateFn={(currentTime: number) =>
              setElapsedTime(currentTime)
            }
          />
        )}
      </div>
    </div>
  );
};

export default Entries;
