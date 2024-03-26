import {
  AspectRatio,
  Card,
  Divider,
  Flex,
  Group,
  Image,
  rem,
  Text,
} from '@mantine/core';

import {type ProductItemFragment} from 'storefrontapi.generated';
import classes from './TreatmentCardContent.module.css';

export function TreatmentCardContent({
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
  return (
    <>
      {product.featuredImage && (
        <AspectRatio ratio={1 / 0.7}>
          <Image
            src={product.featuredImage.url}
            loading={loading}
            fit="cover"
          />
        </AspectRatio>
      )}
      <Text
        className={classes.title}
        size={rem(20)}
        fw={500}
        m="sm"
        mb="4px"
        lineClamp={1}
      >
        {product.title}
      </Text>
      <Flex
        gap="sm"
        direction="column"
        justify="flex-start"
        style={{flexGrow: 1, position: 'relative'}}
        mih="38px"
      >
        <Text c="dimmed" size="xs" fw={400} lineClamp={2} mx="sm">
          {description || product.description || 'ingen beskrivelse'}
        </Text>
      </Flex>
      <Card.Section>
        <Divider mt="sm" />
      </Card.Section>

      <Group justify="space-between" m="sm">
        {leftSection}
        {rightSection}
      </Group>
    </>
  );
}
