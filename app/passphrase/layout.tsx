'use client';

import React, { useContext } from 'react';

import { RandomColorContext } from '@/providers/random-color.provider';


const PassphraseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryColor, secondaryColor } = useContext(RandomColorContext);

  return (
    <div className="text-black h-screen">
      {children}
    </div>
  );
}

export default PassphraseLayout;