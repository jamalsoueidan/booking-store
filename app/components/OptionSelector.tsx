import {Button, Flex, Title} from '@mantine/core';
import {redirect, useSearchParams} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import React from 'react';
import type {
  ArtistTreatmentIndexProductFragment,
  ArtistTreatmentIndexVariantFragment,
} from 'storefrontapi.generated';
import type {
  CustomerProductBaseOptionsItem,
  CustomerProductBaseOptionsItemVariantsItem,
} from '~/lib/api/model';
import {matchesGid} from '~/lib/matches-gid';

export type RedirectToOptionsProps = {
  parentId: number;
  allProductOptionsWithVariants: ArtistTreatmentIndexProductFragment[];
  request: Request;
};

export function redirectToOptions({
  parentId,
  allProductOptionsWithVariants,
  request,
}: RedirectToOptionsProps) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const requiredParams = allProductOptionsWithVariants.map((product) => {
    const productId = parseGid(product.id).id;
    const firstVariant = product.variants.nodes[0];
    return {value: parseGid(firstVariant.id).id, name: productId};
  });

  const missingParams = requiredParams.filter(
    (param) => !searchParams.has(`options[${parentId}][${param.name}]`),
  );

  if (missingParams.length > 0) {
    missingParams.forEach((param) => {
      searchParams.set(`options[${parentId}][${param.name}]`, param.value);
    });

    url.search = searchParams.toString();
    throw redirect(url.toString(), {
      status: 302,
    });
  }
}

export type OptionSelectorProps = {
  parentId: string;
  userProductOptions: CustomerProductBaseOptionsItem;
  productOptionWithVariants: ArtistTreatmentIndexProductFragment;
  children: (props: OptionSelectorChildrenProp) => React.ReactElement;
};

export type OptionSelectorChildrenProp = {
  parentId: string;
  productOptionWithVariants: ArtistTreatmentIndexProductFragment;
  variant: ArtistTreatmentIndexVariantFragment;
  userVariant: CustomerProductBaseOptionsItemVariantsItem;
};

export function OptionSelector({
  parentId,
  productOptionWithVariants,
  userProductOptions,
  children,
}: OptionSelectorProps) {
  const optionsMarkup =
    productOptionWithVariants &&
    productOptionWithVariants.variants.nodes.map((variant) => {
      const userVariant = userProductOptions.variants.find((v) =>
        matchesGid(variant.id, v.variantId),
      );

      if (!userVariant) {
        return <>Error: variant not found</>;
      }

      return (
        <Flex key={variant.id}>
          {children({
            parentId,
            productOptionWithVariants,
            variant,
            userVariant,
          })}
        </Flex>
      );
    });

  return (
    <Flex direction="column" gap="xs" py="sm">
      <Title order={2}>{productOptionWithVariants.title}</Title>
      <Flex direction="column" gap="xs">
        {optionsMarkup}
      </Flex>
    </Flex>
  );
}

export function ProductOption({
  parentId,
  productOptionWithVariants,
  variant,
  userVariant,
}: OptionSelectorChildrenProp) {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = parseGid(productOptionWithVariants.id).id;
  const value = searchParams.get(`options[${parentId}][${productId}]`);

  const updateSearchParams = () => {
    setSearchParams((prev) => {
      prev.set(`options[${parentId}][${productId}]`, parseGid(variant.id).id);
      return prev;
    });
  };

  return (
    <Button
      onClick={updateSearchParams}
      variant={value !== parseGid(variant.id).id ? 'outline' : 'transparent'}
    >
      {variant.title} +<Money as="span" data={variant.price} withoutCurrency />
      &nbsp; DKK - {userVariant.duration.value} min
    </Button>
  );
}

export function usePickedVariantsToCalculateTotalPrice({
  parentId,
  allProductOptionsWithVariants,
}: {
  parentId: number;
  allProductOptionsWithVariants: ArtistTreatmentIndexProductFragment[];
}) {
  const [searchParams] = useSearchParams();

  const variants = allProductOptionsWithVariants.map((product) => {
    const value = searchParams.get(
      `options[${parentId}][${parseGid(product.id).id}]`,
    );
    const pickedVariant = product.variants.nodes.find(
      (variant) => parseGid(variant.id).id === value,
    );
    if (!pickedVariant) {
      throw new Response('PickedVarients - Variant not found', {status: 404});
    }
    return pickedVariant;
  });

  return variants;
}

export function usePickedOptionsToCalculateDuration({
  parentId,
  userProductsOptions,
}: {
  parentId: number;
  userProductsOptions: CustomerProductBaseOptionsItem[];
}) {
  const [searchParams] = useSearchParams();

  const variants = userProductsOptions.map((product) => {
    const value = searchParams.get(
      `options[${parentId}][${product.productId}]`,
    );
    const pickedVariant = product.variants.find(
      ({variantId}) => variantId.toString() === value,
    );
    if (!pickedVariant) {
      throw new Response('PickedOptions - Variant not found', {status: 404});
    }
    return pickedVariant;
  });

  return variants;
}
