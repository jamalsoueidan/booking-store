import {Badge, Image, UnstyledButton, rem} from '@mantine/core';
import {Link} from '@remix-run/react';

import {type ProductCollectionFragment} from 'storefrontapi.generated';
import {useUser} from '~/hooks/use-user';
import {parseTE} from '~/lib/clean';

export function BadgeCollection({
  collection,
  linkBack,
}: {
  collection?: ProductCollectionFragment;
  linkBack?: boolean;
}) {
  const user = useUser();
  if (!collection) {
    return null;
  }

  const leftSection = (
    <Image
      src={`/categories/${
        collection.icon?.value || 'reshot-icon-beauty-mirror'
      }.svg`}
      style={{width: rem(18), height: rem(18)}}
      alt={collection.icon?.value || 'reshot-icon-beauty-mirror'}
    />
  );

  const markup = (
    <Badge
      leftSection={leftSection}
      size="lg"
      radius="md"
      variant="light"
      color={user.theme.color}
    >
      {parseTE(collection.title)}
    </Badge>
  );

  if (linkBack) {
    return (
      <UnstyledButton component={Link} to={`/categories/${collection.handle}`}>
        {markup}
      </UnstyledButton>
    );
  }

  return markup;
}
