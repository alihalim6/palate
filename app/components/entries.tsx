import React, { useCallback, useEffect, useRef, useState } from 'react';

import Ticker from '@/components/ticker';
import { Entry } from '@/types';

import CurrentEntryBar from './current-entry-bar';

interface EntriesProps {
  entries: Entry[];
}

const Entries = ({ entries }: EntriesProps) => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const currentEntryBarRef = useRef<HTMLDivElement>(null);
  const [currentEntry, setCurrentEntry] = useState<Entry | undefined>(undefined);

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


  return (
    <>
      <Ticker label="RECORD NEW ENTRY" navPath="/" className="mt-2" />
      <div className="flex h-[475px] flex-col items-center justify-center p-6">
        {/*eslint-disable-next-line tailwindcss/no-custom-classname*/}
        <div className={`rounded-xs relative flex size-full h-full items-center justify-center text-center text-3xl ${currentEntry === undefined ? '' : 'shadow-md'}`} style={{ backgroundColor: currentEntry?.backgroundColor }}>
          <span className="text-white opacity-50">{currentEntry?.transcript.substring(0, 10)}</span>

          <div className="absolute -bottom-6 left-1 text-sm font-medium text-gray-300">
            {currentEntry && <span>{currentEntry.backgroundColor}</span>}
          </div>
        </div>
        <div className="absolute top-[60%] h-2/5 w-full overflow-y-scroll" ref={listContainerRef}>
          <div className="sticky top-10 z-10 h-16 w-full bg-white shadow-sm" ref={currentEntryBarRef}>
            {currentEntry && <CurrentEntryBar entry={currentEntry} />}
          </div>
          {/* calc(50vh - X): X = height of the current entry bar */}
          <div className="relative top-10 mx-auto mb-[calc(44vh-4rem)]">
            <ul className="list-none">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  data-id={entry.id}
                  className={`cursor-pointer truncate py-2 text-center text-gray-600 ${isEntryScrolledPast(entry) ? 'opacity-0' : ''}`}
                >
                  {entry.transcript.substring(0, 30)}
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
