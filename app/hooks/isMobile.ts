import {useMediaQuery} from '@mantine/hooks';

export const useMobile = () => {
  const isMobile = useMediaQuery('(max-width: 48em)');
  return isMobile;
};
