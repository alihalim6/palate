'use client';

import React, { useCallback, useContext, useState } from 'react';

import { RandomColorContext } from '../providers/random-color.provider';
import { layout as styles } from './styles';

enum TitleSpelling {
  ATE = 1,
  ETTE = 2,
};

const PassphraseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryColor, secondaryColor } = useContext(RandomColorContext);
  const [ titleSpelling, setTitleSpelling ] = useState<TitleSpelling>(TitleSpelling.ATE);

  const isAte = useCallback(() => {
    return titleSpelling === TitleSpelling.ATE;
  }, [titleSpelling]);

  const isEtte = useCallback(() => {
    return titleSpelling === TitleSpelling.ETTE;
  }, [titleSpelling]);

  return (
    <div className="h-screen flex flex-col justify-start" style={{ color: primaryColor }}>
      <div className="flex items-start justify-between p-8">
        <span className="text-black sm:text-9xl text-6xl">PAL-</span>

        <div className="sm:text-2xl text-lg pt-2 sm:pt-[14px]">
          <span 
            className={`cursor-pointer text-transparent bg-clip-text sm:mr-7 mr-3 ${isAte() ? styles.selectedTitleSpelling : ''}`} 
            style={{ color: isAte() ? 'transparent' : primaryColor, background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}) text` }} 
            onClick={() => setTitleSpelling(TitleSpelling.ATE)}
          >
            ATE
          </span>
          <span 
            className={`cursor-pointer text-transparent bg-clip-text ${isEtte() ? styles.selectedTitleSpelling : ''}`} 
            style={{ color: isEtte() ? 'transparent' : secondaryColor, background: `linear-gradient(to right, ${secondaryColor}, ${primaryColor}) text` }} 
            onClick={() => setTitleSpelling(TitleSpelling.ETTE)}
          >
            ETTE
          </span>
        </div>
      </div>

      {isAte() && <p style={ styles.definition } className="animate-show">1. the roof of the mouth, separating the cavities of the nose and the mouth in vertebrates; the palate is important for both eating and making speech sounds. 2. a person&apos;s appreciation of taste and flavor, especially when sophisticated and discriminating.</p>}
      {isEtte() && <p style={ styles.definition } className="animate-show">1. a thin board or slab on which an artist lays and mixes colors. 2. the range of colors used by a particular artist or in a particular picture. 3. (in computer graphics) the range of colors or shapes available to the user.</p>}
      
      {children}
    </div>
  );
}

export default PassphraseLayout;