'use client';

import useUser from '@/lib/useUser';

export default function Home() {
  const { data, isLoading } = useUser();

  if (!data?.id || isLoading) return <>LOADING...</>

  return (
    <>RECORD NEW ENTRY</>
  );
}
