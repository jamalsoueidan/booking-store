import {Divider, Flex, Group, Text, Title, rem} from '@mantine/core';
import {Image} from '@shopify/hydrogen';
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
    <div>
      <Group wrap="nowrap">
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            loading={loading}
            sizes="(min-width: 45em) 20vw, 50vw"
            style={{flex: 0}}
          />
        )}
        <div style={{flex: 1}}>
          <Title order={4} className={classes.title} mb={rem(4)} fw={500}>
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
            <Divider my="xs" />
          </div>

          <Group justify="space-between">
            {leftSection}
            {rightSection}
          </Group>
        </div>
      </Group>
    </div>
  );
}
