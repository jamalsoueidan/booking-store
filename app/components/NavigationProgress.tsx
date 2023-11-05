import {NavigationProgress, nprogress} from '@mantine/nprogress';
import {useNavigation} from '@remix-run/react';
import {useEffect} from 'react';

export const GlobalLoadingIndicator = () => {
  const {state} = useNavigation();
  useEffect(() => {
    if (state === 'idle') {
      nprogress.reset();
    } else {
      nprogress.start();
    }
  }, [state]);

  return <NavigationProgress stepInterval={30} />;
};
