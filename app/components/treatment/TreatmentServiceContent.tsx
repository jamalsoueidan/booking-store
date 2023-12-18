import {
  Box,
  Divider,
  Flex,
  Group,
  Image,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import classes from './TreatmentServiceContent.module.css';

export function TreatmentServiceContent({
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
    <Flex>
      {product.featuredImage && (
        <div style={{flex: '0 0 18%'}}>
          <Image
            component={ShopifyImage}
            data={product.featuredImage}
            h="auto"
            loading={loading}
          />
        </div>
      )}
      <div style={{flex: '1'}}>
        <Box p="xs">
          <Title order={4} className={classes.title} mb={rem(4)} fw={500}>
            {product.title}
          </Title>
          <Flex
            gap="sm"
            direction="column"
            justify="flex-start"
            style={{flexGrow: 1, position: 'relative'}}
          >
            <Text c="dimmed" size="sm" fw={400} lineClamp={2}>
              {description || product.description || 'ingen beskrivelse'}
            </Text>
          </Flex>
        </Box>

        <Divider />

        <Box p="xs">
          <Group justify="space-between">
            {leftSection}
            {rightSection}
          </Group>
        </Box>
      </div>
    </Flex>
  );
}
