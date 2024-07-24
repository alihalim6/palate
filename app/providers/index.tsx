import RandomColorProvider from './random-color.provider';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <RandomColorProvider>{children}</RandomColorProvider>;
};

export default Providers;
