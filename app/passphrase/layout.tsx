'use client';

import React, { useCallback, useContext, useState } from 'react';

import { RandomColorContext } from '../providers/random-color.provider';
import { layout as styles } from './styles';


const PassphraseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryColor, secondaryColor } = useContext(RandomColorContext);

  return (
    <div style={{ backgroundColor: primaryColor, color: secondaryColor }} className="h-screen">
      {children}
    </div>
  );
}

export default PassphraseLayout;