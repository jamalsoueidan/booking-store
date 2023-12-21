import {Stack, Title, rem, type TitleProps} from '@mantine/core';
import classes from './IndexTitle.module.css';

export function IndexTitle({
  children,
  subtitle,
  overtitle,
  ...props
}: TitleProps & {subtitle: string; overtitle: string}) {
  return (
    <Stack pt={rem(30)} pb={rem(60)} gap="xs">
      <Title
        order={5}
        c="dimmed"
        tt="uppercase"
        fw={300}
        ta="center"
        className={classes.overtitle}
      >
        {overtitle}
      </Title>
      <Title order={1} fw={400} ta="center" className={classes.root}>
        {children}
      </Title>
      <Title
        order={3}
        c="dimmed"
        ta="center"
        fw={300}
        className={classes.subtitle}
      >
        {subtitle}
      </Title>
    </Stack>
  );
}
