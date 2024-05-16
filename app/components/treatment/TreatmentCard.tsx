import {
  AspectRatio,
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Image,
  rem,
  Text,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {
  TreatmentCollectionFragment,
  UserFragment,
} from 'storefrontapi.generated';
import {useUserMetaobject} from '~/hooks/useUserMetaobject';

export function TreatmentCard({
  product,
}: {
  product: TreatmentCollectionFragment;
}) {
  return (
    <Card
      key={product.handle}
      withBorder
      radius="xl"
      component={Link}
      bg="transparent"
      p="0"
      to={`/treatments/${product.handle}`}
    >
      {product.featuredImage && (
        <AspectRatio ratio={1 / 0.7}>
          <Image src={product.featuredImage.url} loading="lazy" fit="cover" />
        </AspectRatio>
      )}
      <Text size={rem(20)} fw={500} m="sm" mb="4px" lineClamp={1}>
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
          {product.description || 'ingen beskrivelse'}
        </Text>
      </Flex>
      <Card.Section>
        <Divider mt="sm" />
      </Card.Section>

      <Group justify="space-between" m="sm">
        <Users collection={product.collection} />
        <Button variant="default" size="xs" radius="lg">
          Se behandling
        </Button>
      </Group>
    </Card>
  );
}

function Users({
  collection,
}: {
  collection: TreatmentCollectionFragment['collection'];
}) {
  if (!collection) {
    return (
      <Avatar.Group spacing="xs">
        <Avatar radius="lg" size="sm">
          +0
        </Avatar>
      </Avatar.Group>
    );
  }

  const availability = collection.reference?.products.filters.find(
    (p) => p.id === 'filter.v.availability',
  );
  const highestCount = availability?.values.reduce(
    (max, obj) => Math.max(max, obj.count),
    0,
  );
  const users = collection.reference?.products.nodes.map((p) => p.user);

  return (
    <Avatar.Group spacing="xs">
      {users?.map((user) => (
        <AvatarUser key={user?.reference?.id} user={user?.reference} />
      ))}
      <Avatar radius="lg" size="sm">
        +{highestCount}
      </Avatar>
    </Avatar.Group>
  );
}

const AvatarUser = ({user}: {user?: UserFragment | null}) => {
  const {image} = useUserMetaobject(user);
  return <Avatar src={image.image?.url} radius="lg" size="sm" />;
};
