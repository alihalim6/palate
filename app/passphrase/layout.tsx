'use client';

import React from 'react';

const PassphraseLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <div className="h-screen text-black">{children}</div>;
};

export default PassphraseLayout;
