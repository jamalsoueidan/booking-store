import {Avatar, Button, Card} from '@mantine/core';
import {Link} from '@remix-run/react';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {type ProductsGetUsersImage} from '~/lib/api/model';
import {ArtistServiceContent} from '../artist/ArtistServiceContent';
import classes from './TreatmentCard.module.css';

export function TreatmentCard({
  product,
  productUsers,
  loading,
}: {
  product: ProductItemFragment;
  productUsers?: ProductsGetUsersImage;
  loading?: 'eager' | 'lazy';
}) {
  const leftSection =
    productUsers && productUsers?.totalUsers > 0 ? (
      <Avatar.Group spacing="xs">
        {productUsers.users.map((user) => (
          <Avatar
            key={user.customerId}
            src={user.images.profile?.url || ''}
            radius="lg"
            size="sm"
          />
        ))}
        {productUsers.totalUsers > productUsers.users.length && (
          <Avatar radius="lg" size="sm">
            +{productUsers.totalUsers}
          </Avatar>
        )}
      </Avatar.Group>
    ) : (
      <Avatar.Group spacing="xs">
        <Avatar radius="lg" size="sm">
          +0
        </Avatar>
      </Avatar.Group>
    );

  return (
    <Card
      key={product.handle}
      withBorder
      radius={0}
      padding="md"
      className={classes.card}
      component={Link}
      to={`/treatments/${product.handle}`}
    >
      <ArtistServiceContent
        product={product}
        rightSection={
          <Button variant="default" size="xs">
            Se behandling
          </Button>
        }
        loading={loading}
        leftSection={leftSection}
      />
    </Card>
  );
}
