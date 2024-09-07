import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { HTMLAttributes } from 'react';

interface TickerProps {
  label: string;
  navPath: string;
  direction?: 'left' | 'right';
}

const Ticker = ({ label, navPath, className, direction = 'right'}: TickerProps & HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const isLeft = direction === 'left';
  const animation = isLeft ? 'animate-ticker-left' : 'animate-ticker-right';

  const handleRecordNew = () => {
    router.push(navPath);
  };

  return (
    <div className={clsx('flex w-full gap-x-2 text-base cursor-pointer hover:scale-110', className, animation)} onClick={handleRecordNew} >
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="flex gap-x-1">
          {/* hide first label if left so that arrow is first */}
          {(!isLeft || index > 0) && <span className="whitespace-nowrap italic">{label}</span>}
          {isLeft ? <WestIcon className="text-black" /> : <EastIcon className="text-red-500" />}
        </div>
      ))}
    </div>
  );
}

export default Ticker;