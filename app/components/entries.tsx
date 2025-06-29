import Close from '@mui/icons-material/Close';
import QuestionMark from '@mui/icons-material/QuestionMark';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Ticker from '@/components/ticker';
import { Entry } from '@/types';

import CurrentEntryBar from './current-entry-bar';

interface EntriesProps {
  entries: Entry[];
}

enum CurrentEntryContentType {
  Transcript = 'transcript',
  BackgroundColorReason = 'backgroundColorReason',
}

const Entries = ({ entries }: EntriesProps) => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const currentEntryBarRef = useRef<HTMLDivElement>(null);
  const [currentEntry, setCurrentEntry] = useState<Entry | undefined>(undefined);
  const [currentEntryContentType, setCurrentEntryContentType] = useState<CurrentEntryContentType>(CurrentEntryContentType.Transcript);

  useEffect(() => {
    const listContainer = listContainerRef.current;
    if (!listContainer) return;

    const entryItems = listContainer.querySelectorAll('li');

    const handleScroll = () => {
      const currentEntryBar = currentEntryBarRef.current;

      if (!currentEntryBar) return;

      const currentEntryBarRect = currentEntryBar.getBoundingClientRect();
      const THRESHOLD_OFFSET = 15;

      entryItems.forEach((entryItem, index) => {
        const entryRect = entryItem.getBoundingClientRect();
        /* const topThreshold = currentEntryBarRect.top - THRESHOLD_OFFSET;*/
        const bottomThreshold = currentEntryBarRect.bottom + THRESHOLD_OFFSET;

        // Check if entry is in view
        //if (!(entryRect.top <= topThreshold && entryRect.bottom >= bottomThreshold)) {
        //if (!(/* entryRect.top <= currentEntryBarRect.top &&  */entryRect.bottom >= currentEntryBarRect.bottom)) {
        if (entryRect.bottom >= bottomThreshold) {
          // Clear current entry if at top of list
          if (index === 0) {
            setCurrentEntry(undefined);
          }

          return;
        };

        const entryInBar = entries.find((entry) => entry.id === entryItem.getAttribute('data-id'));

        setCurrentEntry(entryInBar);
      });
    };

    listContainer.addEventListener('scroll', handleScroll);

    return () => {
      listContainer.removeEventListener('scroll', handleScroll);
    }
  }, [entries]);

  const isEntryScrolledPast = useCallback((entry: Entry) => {
    if (!currentEntry) return false;

    return entries.findIndex((e) => e.id === entry.id) < entries
      .findIndex((e) => e.id === currentEntry.id);
  }, [currentEntry]);

  const displayColorReason = () => {    
    setCurrentEntryContentType(CurrentEntryContentType.BackgroundColorReason);
  };

  const currentEntryContent = useMemo(() => {
    if (!currentEntry) return;

    // TODO: live chunks
    if (currentEntryContentType === CurrentEntryContentType.Transcript) {
      return currentEntry.transcript.substring(0, 10);
    }

    return currentEntry.backgroundColorReason;
  }, [currentEntry, currentEntryContentType]);

  const isDisplayingBackgroundColorReason = useMemo(() => {
    return currentEntryContentType === CurrentEntryContentType.BackgroundColorReason;
  }, [currentEntryContent]);

  const currentEntryContentBackgroundColor = useMemo(() => {
    if (isDisplayingBackgroundColorReason) return;

    return currentEntry?.backgroundColor;
  }, [currentEntry, isDisplayingBackgroundColorReason]);

  const currentEntryContentTextColor = useMemo(() => {
    if (isDisplayingBackgroundColorReason) {
      return 'text-black';
    }

    return 'text-white opacity-50';
  }, [isDisplayingBackgroundColorReason]);

  return (
    <>
      <Ticker label="RECORD NEW ENTRY" navPath="/" className="mt-2" />
      <div className="flex h-[475px] flex-col items-center justify-center p-6">
        {/* Big color square */}
        {/*eslint-disable-next-line tailwindcss/no-custom-classname*/}
        <div className={`rounded-xs relative flex size-full h-full items-center justify-center p-2 text-center text-3xl ${currentEntry ? 'shadow-md' : ''}`} style={{ backgroundColor: currentEntryContentBackgroundColor }}>
          {isDisplayingBackgroundColorReason && (
            <Close fontSize="large" className="absolute right-3 top-3 cursor-pointer" onClick={() => setCurrentEntryContentType(CurrentEntryContentType.Transcript)}/>
          )}
          <span className={currentEntryContentTextColor}>{currentEntryContent}</span>
            {/* Color hex code for current entry */}
            <div className="absolute -bottom-8 left-1 text-sm font-medium text-black">
             {currentEntry && (
                <div className="flex items-center justify-center space-x-2">
                  <span>{currentEntry.backgroundColor}</span>
                  {currentEntry.backgroundColorReason && 
                    !isDisplayingBackgroundColorReason && 
                    <QuestionMark fontSize="small" className="cursor-pointer rounded-full bg-black p-0.5 text-white" onClick={displayColorReason}/>
                  }
                </div>
              )}
            </div>
        </div>
        <div className="absolute top-[60%] h-2/5 w-full overflow-y-scroll" ref={listContainerRef}>
          <div className="sticky top-10 z-10 h-16 w-full bg-white pt-0.5 shadow-sm" ref={currentEntryBarRef}>
            {currentEntry && <CurrentEntryBar entry={currentEntry} />}
          </div>
          {/* calc(50vh - X): X = height of the current entry bar */}
          <div className="relative top-10 mx-auto mb-[calc(44vh-4rem)]">
            <ul className="list-none">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  data-id={entry.id}
                  className={`mx-auto my-0 block max-w-64 truncate py-3 text-center text-sm text-gray-500 ${isEntryScrolledPast(entry) ? 'opacity-0' : ''}`}
                >
                  {entry.transcript}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Entries;
