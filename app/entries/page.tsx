'use client';

import Entries from '@/components/entries';
import { Entry, GetEntriesResponse } from '@/types';
import { useEffect, useState } from 'react';

const EntriesPage = () => {
  const [currentEntries, setCurrentEntries] = useState<Entry[] | null>(null);
  const [offset, setOffset] = useState<number>(0);

  const getEntries = async () => {
    try {
      const entriesResponse = await fetch(`/api/entries?offset=${offset}`, { next: { tags: ['entries'] } });
      const { entries, total } = await entriesResponse.json() as GetEntriesResponse;
      setCurrentEntries(entries);
      setOffset(total);
    } catch(error) {
      console.error(error);
      //TODO
    }
  };

  useEffect(() => {
    getEntries();
    return () => setCurrentEntries(null);
  }, []);

  //TODO: use swiper reachEnd() for pagination

  return (
    <>
      {/* 
        // something simple, loading shouldn't take long enough to be worth effort of more
      */}
      {!currentEntries && <div>LOADING...</div>}
      
      {currentEntries && (
        <Entries entries={currentEntries} />
      )}
    </>
  );
};

export default EntriesPage;