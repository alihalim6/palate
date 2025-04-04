import { format } from 'date-fns';

import { Entry } from '@/types';

interface CurrentEntryBarParams {
  entry: Entry;
}

const CurrentEntryBar = ({ entry }: CurrentEntryBarParams) => {
  
  const isEntryYearNotCurrentYear = () => {
    return format(entry.createdAt, 'yyyy') !== format(new Date(), 'yyyy');
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-full items-center justify-center gap-x-4">
        {isEntryYearNotCurrentYear() && <div className="flex flex-col items-center px-2 py-0.5 text-[0.875rem] font-extrabold leading-[0.7rem] text-white" style={{backgroundColor: entry.backgroundColor}}>
          <span>{format(entry.createdAt, 'yyyy').substring(0, 2)}</span>
          <span>{format(entry.createdAt, 'yyyy').substring(2)}</span>
        </div>}
        <div className="flex items-center gap-x-1">
          {['MMM', 'dd'].map((formatString) => (
            <div key={formatString} className="px-1 text-3xl font-semibold">
              <span>{format(entry.createdAt, formatString).toUpperCase()}</span>
            </div>
          ))}
        </div>
        <div className="flex w-32 justify-center rounded-3xl bg-black text-3xl tracking-widest text-white">4:40</div>
      </div>
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-1 w-4 bg-black"></div>
        ))}
      </div>
    </div>
  );
};

export default CurrentEntryBar;
