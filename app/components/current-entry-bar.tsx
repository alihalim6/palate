import { format } from 'date-fns';

import { Entry } from '@/types';

interface CurrentEntryBarParams {
  entry: Entry;
}

const CurrentEntryBar = ({ entry }: CurrentEntryBarParams) => {
  

  return (
    <div className="flex h-full items-center justify-center gap-x-6">
      <div className="flex flex-col items-center font-extrabold leading-[0.9rem] text-white" style={{ backgroundColor: entry.backgroundColor }}>
        <span>{format(entry.createdAt, 'MMM').toUpperCase()}</span>
        <span>{format(entry.createdAt, 'dd')}</span>
      </div>
      <div className="flex w-24 justify-center rounded-3xl text-2xl tracking-widest text-white" style={{ backgroundColor: entry.backgroundColor }}>4:40</div>
    </div>
  );
};

export default CurrentEntryBar;
