'use client';

import { useEffect, useState } from 'react';

import Entries from '@/components/entries';
import { Entry, GetEntriesResponse } from '@/types';

const EntriesPage = () => {
  const [currentEntries, setCurrentEntries] = useState<Entry[] | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const getEntries = async () => {
      if (total === currentEntries?.length) return;

      try {
        const entriesResponse = await fetch(`/api/entries?offset=${offset}`, {
          next: { tags: ['entries'] },
        });
        const { fetchedEntries, totalEntries } =
          (await entriesResponse.json()) as GetEntriesResponse;
        setCurrentEntries(fetchedEntries);
        setOffset(fetchedEntries.length);
        setTotal(totalEntries);
      } catch (error) {
        console.error(error);
        //TODO
      }
    };

    getEntries();
    return () => setCurrentEntries(null);
  }, []);

  return (
    <>
      {/* 
        // something simple, loading shouldn't take long enough to be worth effort of more
      */}
      {!currentEntries && <div>LOADING...</div>}

      {currentEntries && <Entries entries={currentEntries} />}
    </>
  );
};

export default EntriesPage;
