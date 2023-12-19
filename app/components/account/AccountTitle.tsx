import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Stack,
  Title,
  type TitleProps,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {IconArrowLeft} from '@tabler/icons-react';
import classes from './AccountTitle.module.css';

export function AccountTitle({
  heading,
  linkBack,
  children,
  ...props
}: TitleProps & {heading: string | React.ReactNode; linkBack?: string}) {
  return (
    <Box bg="var(--mantine-color-gray-1)" mb="-32px" pb="34px">
      <Stack gap={'2'}>
        <Flex direction="row" align="center" p="xs">
          {linkBack ? (
            <ActionIcon
              variant="transparent"
              size="xl"
              aria-label="Back"
              color="black"
              component={Link}
              to={linkBack}
            >
              <IconArrowLeft
                style={{width: '70%', height: '70%'}}
                stroke={1.5}
              />
            </ActionIcon>
          ) : null}
          <Title className={classes.title} {...props}>
            {heading}
          </Title>
        </Flex>
        {children ? (
          <>
            <Divider mx="sm" my="0" />
            <Box p="xs">{children}</Box>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}

export function AccountTitleBack({
  heading,
  children,
  ...props
}: TitleProps & {heading: string}) {
  return (
    <>
      <Title className={classes.title} {...props}>
        {heading}
      </Title>
      {children}
      <Divider my={{base: 'xs', md: 'md'}} />
    </>
  );
}
