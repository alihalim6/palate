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
  
  if (!data?.id) {
    router.push('/passphrase');
  };

  return { data, isLoading };
}