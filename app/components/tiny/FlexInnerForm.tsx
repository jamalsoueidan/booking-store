import {Flex, type FlexProps} from '@mantine/core';

export function FlexInnerForm({children, ...props}: FlexProps) {
  return (
    <Flex direction="column" gap={{base: 'sm', sm: 'lg'}}>
      {children}
    </Flex>
  );
}
