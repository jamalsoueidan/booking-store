import {Stack, Title, rem, type TitleProps} from '@mantine/core';
import {HeroBackground} from './HeroBackground';
import classes from './HeroTitle.module.css';

export function HeroTitle({
  children,
  subtitle,
  overtitle,
  bg,
}: TitleProps & {
  subtitle: string | React.ReactNode;
  overtitle: string | React.ReactNode;
}) {
  return (
    <HeroBackground bg={bg}>
      <Stack pt={rem(30)} pb={rem(50)} gap="xs">
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
    </HeroBackground>
  );
}
