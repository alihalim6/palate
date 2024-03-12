'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

import { fetcher } from './fetcher';

export type User = {
  id: string;
};

export default function useUser() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<User>('/api/user', fetcher);
  
  useEffect(() => {
    if (!data?.id) {
      router.push('/passphrase');
    };
  }, [router, data, isLoading])

  return { data, isLoading };
}