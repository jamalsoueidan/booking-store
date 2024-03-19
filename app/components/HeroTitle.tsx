import {Stack, Title, rem, type TitleProps} from '@mantine/core';
import {type Image} from '@shopify/hydrogen/storefront-api-types';
import {HeroBackground} from './HeroBackground';
import classes from './HeroTitle.module.css';

export function HeroTitle({
  children,
  subtitle,
  overtitle,
  fontColor,
  justify,
  ...props
}: TitleProps & {
  subtitle?: string | React.ReactNode;
  overtitle?: string | React.ReactNode;
  fontColor?: string | null;
  justify?: string | null;
  image?: Pick<Image, 'url'> | null;
}) {
  return (
    <HeroBackground {...props}>
      <Stack pt={rem(30)} pb={rem(50)} justify={justify || 'center'} h="100%">
        <div>
          <Title
            order={5}
            tt="uppercase"
            fw={300}
            ta="center"
            c={fontColor || 'black'}
            className={classes.overtitle}
          >
            {overtitle}
          </Title>
          <Title
            order={1}
            fw={500}
            ta="center"
            textWrap="balance"
            className={classes.root}
            c={fontColor || 'black'}
          >
            {children}
          </Title>
        </div>
        <Title
          order={3}
          ta="center"
          fw={300}
          className={classes.subtitle}
          c={fontColor || 'black'}
        >
          {subtitle}
        </Title>
      </Stack>
    </HeroBackground>
  );
}
