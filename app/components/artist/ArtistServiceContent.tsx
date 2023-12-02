import {
  AspectRatio,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Image} from '@shopify/hydrogen';
import {
  type ProductItemFragment,
  type ProductServiceItemFragment,
} from 'storefrontapi.generated';
import classes from './ArtistServiceContent.module.css';

export function ArtistServiceContent({
  product,
  description,
  loading,
  leftSection,
  rightSection,
}: {
  product: ProductItemFragment | ProductServiceItemFragment;
  description?: string;
  leftSection?: JSX.Element;
  rightSection?: JSX.Element;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <>
      {product.featuredImage && (
        <AspectRatio ratio={1080 / 1080}>
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            loading={loading}
            sizes="(min-width: 45em) 20vw, 50vw"
          />
        </AspectRatio>
      )}
      <Title
        order={3}
        className={classes.title}
        mt={product.featuredImage ? 'sm' : undefined}
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
        <Text c="dimmed" size="xs" tt="uppercase" fw={400} lineClamp={2}>
          {description || product.description || 'ingen beskrivelse'}
        </Text>
      </Flex>
      <div className={classes.unset}>
        <Divider my="md" />
      </div>

      <Group justify="space-between">
        {leftSection}
        {rightSection}
      </Group>
    </>
  );
}