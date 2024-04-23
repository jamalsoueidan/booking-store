import {Badge, UnstyledButton} from '@mantine/core';
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

  const markup = (
    <Badge size="lg" radius="md" variant="light" color={user.theme.color}>
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
