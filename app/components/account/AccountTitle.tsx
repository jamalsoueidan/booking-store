import {
  ActionIcon,
  Box,
  Divider,
  Flex,
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
    <Box>
      <Flex
        direction="column"
        gap={{base: 'sm', md: 'lg'}}
        p={{base: 'xs', md: 'xl'}}
      >
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
          <Title
            className={classes.title}
            {...props}
            data-testid="account-title"
          >
            {heading}
          </Title>
        </Flex>
        {children ? (
          <>
            <Flex gap="md">{children}</Flex>
          </>
        ) : null}
      </Flex>
      <Divider />
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
