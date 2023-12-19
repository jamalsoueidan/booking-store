import {
  ActionIcon,
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
    <>
      <Stack gap="xs">
        <Flex direction="row" align="center">
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
        {children ? <div>{children}</div> : null}
      </Stack>
      <Divider my={{base: 'xs', md: 'md'}} />
    </>
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
