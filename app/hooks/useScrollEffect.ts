import {useMantineTheme} from '@mantine/core';
import {useWindowScroll} from '@mantine/hooks';
import {useEffect, useState} from 'react';

export const useScrollEffect = () => {
  const theme = useMantineTheme();
  const [scroll] = useWindowScroll();
  const [opacity, setOpacity] = useState(0);
  const [shadow, setShadow] = useState('none');

  useEffect(() => {
    if (scroll.y > 0) {
      setOpacity(1);
      setShadow(`0 2px 10px ${theme.colors.gray[4]}`);
    } else {
      setOpacity(0);
      setShadow('none');
    }
  }, [scroll.y, theme.colors.gray]);

  return {opacity, shadow};
};
