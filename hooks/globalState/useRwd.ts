import { useMediaQuery } from 'react-responsive';

const useRwd = () => {
  const rwd1023 = useMediaQuery({ query: '(max-width: 1023px)' });
  const rwd1439 = useMediaQuery({ query: '(max-width: 1439px)' });

  return {
    rwd1023,
    rwd1439,
  };
};

export { useRwd };
