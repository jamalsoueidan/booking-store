import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Stack,
  Title,
  type TitleProps,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import {IconArrowLeft} from '@tabler/icons-react';
import classes from './AccountTitle.module.css';

export function AccountTitle({
  heading,
  linkBack,
  children,
  ...props
}: TitleProps & {heading: string | React.ReactNode; linkBack?: string}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  return (
    <Box bg="var(--mantine-color-gray-1)" mb="-32px" pb="34px">
      <Stack gap={'2'}>
        <Flex direction="row" align="center" p={isMobile ? 'xs' : 'md'}>
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
          <Title className={classes.title} {...props} data-cy="welcome-title">
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
