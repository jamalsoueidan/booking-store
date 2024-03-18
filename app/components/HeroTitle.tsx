import {Stack, Title, rem, type TitleProps} from '@mantine/core';
import {HeroBackground} from './HeroBackground';
import classes from './HeroTitle.module.css';

export function HeroTitle({
  children,
  subtitle,
  overtitle,
  ...props
}: TitleProps & {
  subtitle?: string | React.ReactNode;
  overtitle?: string | React.ReactNode;
}) {
  return (
    <HeroBackground {...props}>
      <Stack pt={rem(30)} pb={rem(50)} gap="xs" justify="center" h="100%">
        <Title
          order={5}
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
        <Title order={3} ta="center" fw={300} className={classes.subtitle}>
          {subtitle}
        </Title>
      </Stack>
    </HeroBackground>
  );
}
