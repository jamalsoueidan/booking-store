import {
  AspectRatio,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Image} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import classes from './ArtistServiceContent.module.css';

export function ArtistServiceContent({
  product,
  description,
  loading,
  leftSection,
  rightSection,
}: {
  product: ProductItemFragment;
  description?: string;
  leftSection?: JSX.Element;
  rightSection?: JSX.Element;
  loading?: 'eager' | 'lazy';
}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  return (
    <>
      {product.featuredImage && (
        <AspectRatio ratio={1080 / 740}>
          <Image data={product.featuredImage} loading={loading} sizes="10vw" />
        </AspectRatio>
      )}
      <Title
        order={2}
        className={classes.title}
        mt={product.featuredImage ? 'sm' : undefined}
        size={rem(isMobile ? 18 : 24)}
        mb={rem(4)}
        fw={500}
      >
        {product.title}
      </Title>

      <Flex
        gap="sm"
        direction="column"
        justify="flex-start"
        style={{flexGrow: 1, position: 'relative'}}
      >
        <Text c="dimmed" size={isMobile ? 'xs' : 'md'} fw={400} lineClamp={2}>
          {description || product.description || 'ingen beskrivelse'}
        </Text>
      </Flex>
      <div className={classes.unset}>
        <Divider my={{base: 'xs', md: 'md'}} />
      </div>

      <Group justify="space-between">
        {leftSection}
        {rightSection}
      </Group>
    </>
  );
}
