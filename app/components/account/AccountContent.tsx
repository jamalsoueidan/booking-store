import {Card} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

export function AccountContent({children}: {children: React.ReactNode}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  return (
    <Card radius="xl" py={isMobile ? 'lg' : 'xl'} px={isMobile ? 'md' : 'xl'}>
      {children}
    </Card>
  );
}
