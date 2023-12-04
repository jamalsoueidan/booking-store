import {Badge, Text} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {type CustomerProductBase} from '~/lib/api/model';

import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {TreatmentServiceContent} from '~/components/treatment/TreatmentServiceContent';
import {durationToTime} from '~/lib/duration';

type ArtistServiceProductProps = {
  product: ProductItemFragment;
  services: CustomerProductBase[];
  defaultChecked?: boolean;
};

export function ArtistServiceProduct({
  product,
  services,
  defaultChecked,
}: ArtistServiceProductProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange = (checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const existingItems = newSearchParams.getAll('productIds');
    const itemIndex = existingItems.indexOf(parseGid(product.id).id);

    if (checked && itemIndex === -1) {
      newSearchParams.append('productIds', parseGid(product.id).id);
    }

    if (!checked) {
      const updatedItems = existingItems.filter(
        (item) => item !== parseGid(product.id).id,
      );
      newSearchParams.delete('productIds');
      updatedItems.forEach((item) =>
        newSearchParams.append('productIds', item),
      );
    }

    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
    });
  };

  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const leftSection = (
    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
      {durationToTime(artistService?.duration ?? 0)}
    </Text>
  );

  const rightSection = artistService?.price && (
    <Badge variant="light" color="gray" size="md">
      <Money data={artistService?.price as any} />
    </Badge>
  );

  return (
    <ArtistServiceCheckboxCard
      value={artistService!.productId.toString()}
      defaultChecked={defaultChecked}
      onChange={onChange}
      name="productIds"
    >
      <TreatmentServiceContent
        product={product}
        description={artistService?.description}
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </ArtistServiceCheckboxCard>
  );
}
