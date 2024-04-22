import {Card} from '@mantine/core';

export function AccountContent({children}: {children: React.ReactNode}) {
  return (
    <Card radius="xl" p={{base: 'xs', md: 'xl'}}>
      {children}
    </Card>
  );
}
