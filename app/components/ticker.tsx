import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ReactJSXElement } from 'node_modules/@emotion/react/dist/declarations/types/jsx-namespace';
import { HTMLAttributes } from 'react';

interface TickerProps {
  label: string;
  navPath: string;
  direction?: 'left' | 'right';
  animate?: boolean;
  translateXPerc?: number;
  icon?: ReactJSXElement | null;
  labelColor?: string;
}

const Ticker = ({
  label,
  navPath,
  className,
  direction = 'right',
  animate = true,
  translateXPerc = 0,
  icon,
  labelColor,
}: TickerProps & HTMLAttributes<HTMLDivElement>) => {
  const router = useRouter();
  const isLeft = direction === 'left';
  const animation = animate
    ? isLeft
      ? 'animate-ticker-left'
      : 'animate-ticker-right'
    : '';

  const handleRecordNew = () => {
    router.push(navPath);
  };

  return (
    <div
      className={clsx(
        'flex w-full cursor-pointer gap-x-2 text-base',
        className,
        animation,
      )}
      style={{ transform: `translateX(${translateXPerc}%)` }}
      onClick={handleRecordNew}
    >
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="flex gap-x-1 hover:scale-110">
          {/* hide first label if left so that arrow is first */}
          {(!isLeft || index > 0) && (
            <span
              className={clsx(
                'mr-2 whitespace-nowrap italic',
                animate && 'underline',
              )}
              style={{ color: labelColor }}
            >
              {label}
            </span>
          )}
          {icon ? (
            icon
          ) : isLeft ? (
            <WestIcon className="text-black" />
          ) : (
            <EastIcon className="text-red-500" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Ticker;
