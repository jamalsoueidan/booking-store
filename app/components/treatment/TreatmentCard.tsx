import {Avatar, Button, Card} from '@mantine/core';
import {Link} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {type ProductsGetUsersResponse} from '~/lib/api/model';
import classes from './TreatmentCard.module.css';
import {TreatmentContent} from './TreatmentContent';

export function TreatmentCard({
  product,
  productUsers,
  loading,
}: {
  product: ProductItemFragment;
  productUsers?: ProductsGetUsersResponse;
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
            size="md"
          />
        ))}
        {productUsers.totalUsers > productUsers.users.length && (
          <Avatar radius="lg" size="md">
            +{productUsers.totalUsers}
          </Avatar>
        )}
      </Avatar.Group>
    ) : (
      <Avatar.Group spacing="xs">
        <Avatar radius="lg" size="md">
          +0
        </Avatar>
      </Avatar.Group>
    );

  return (
    <Card
      key={product.handle}
      withBorder
      radius="md"
      padding="md"
      className={classes.card}
      component={Link}
      to={`./${product.handle}-${parseGid(product.id).id}`}
    >
      <TreatmentContent
        product={product}
        rightSection={
          <Button variant="default" size="md">
            Se behandling
          </Button>
        }
        loading={loading}
        leftSection={leftSection}
      />
    </Card>
  );
}
