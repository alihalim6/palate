'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';

import { User } from '@/app/users/api/route';

import { fetcher } from './fetcher';

export default function useUser() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR<User>('/users/api', fetcher);
  
  useEffect(() => {
    if (!data?.id) {
      router.push('/passphrase');
    };
  }, [router, data, isLoading])

  return { data, isLoading };
}