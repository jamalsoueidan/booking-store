import {useEffect, useRef, useState} from 'react';

export const useDynamicWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    if (ref.current) {
      const paddingLeft = parseFloat(
        window.getComputedStyle(ref.current).paddingLeft,
      );
      const paddingRight = parseFloat(
        window.getComputedStyle(ref.current).paddingRight,
      );
      setWidth(ref.current.clientWidth - paddingLeft - paddingRight);
    }
  };

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return {ref, width};
};
