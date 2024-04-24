import {Flex, type FlexProps} from '@mantine/core';

export function FlexInnerForm({children, ...props}: FlexProps) {
  return (
    <Flex
      direction="column"
      gap={{base: 'sm', sm: 'lg'}}
      w={{base: '100%', sm: '75%'}}
    >
      {children}
    </Flex>
  );
}
