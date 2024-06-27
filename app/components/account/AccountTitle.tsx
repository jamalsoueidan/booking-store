import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Group,
  ScrollArea,
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
        p={{base: 'xs', md: 'sm'}}
      >
        <Group gap="0">
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
        </Group>
        {children ? (
          <ScrollArea type="auto" h="52px">
            <Flex gap="md" direction="row">
              {children}
            </Flex>
          </ScrollArea>
        ) : null}
      </Flex>
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
