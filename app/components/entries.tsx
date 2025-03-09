import React, { useEffect, useRef, useState } from 'react';

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
      //const THRESHOLD_OFFSET = 100;

      entryItems.forEach((entryItem, index) => {
        const entryRect = entryItem.getBoundingClientRect();
        /* const topThreshold = currentEntryBarRect.top - THRESHOLD_OFFSET;
        const bottomThreshold = currentEntryBarRect.bottom + THRESHOLD_OFFSET; */

        // Check if entry is in view
        //if (!(entryRect.top <= topThreshold && entryRect.bottom >= bottomThreshold)) {
        if (!(entryRect.top <= currentEntryBarRect.top && entryRect.bottom >= currentEntryBarRect.bottom)) {
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

  return (
    <div className="absolute top-[60%] h-2/5 w-full overflow-y-scroll" ref={listContainerRef}>
      <div className="inset-shadow-xs sticky top-10 z-10 h-12 w-full bg-white" ref={currentEntryBarRef}>
        {currentEntry && <CurrentEntryBar entry={currentEntry} />}
      </div>
       {/* calc(50vh - X): X = height of the current entry bar */}
      <div className="relative top-10 mx-auto mb-[calc(40vh-3rem)]">
        <ul className="m-0 list-none p-0">
          {entries.map((entry) => (
            <li
              key={entry.id}
              data-id={entry.id}
              className="cursor-pointer truncate py-6 text-center text-gray-600"
            >
              {entry.transcript.substring(0, 30)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Entries;
