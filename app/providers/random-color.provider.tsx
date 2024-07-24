'use client';

import { createContext, useEffect, useState } from 'react';
import uniqolor from 'uniqolor';

export interface RandomColorContext {
  primaryColor: string;
  secondaryColor: string;
}

export const RandomColorContext = createContext<RandomColorContext>({
  primaryColor: '',
  secondaryColor: '',
});

const RandomColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [secondaryColor, setSecondaryColor] = useState<string>('');

  useEffect(() => {
    setPrimaryColor(uniqolor.random({ lightness: [75, 90] }).color);
    setSecondaryColor(uniqolor.random({ lightness: [10, 25] }).color);
  }, []);

  return (
    <RandomColorContext.Provider value={{ primaryColor, secondaryColor }}>
      {children}
    </RandomColorContext.Provider>
  );
};

export default RandomColorProvider;
