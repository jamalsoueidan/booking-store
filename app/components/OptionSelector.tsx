import {Button, Flex, Title} from '@mantine/core';
import {redirect, useSearchParams} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import React, {useMemo} from 'react';
import type {
  ArtistTreatmentIndexProductFragment,
  ArtistTreatmentIndexVariantFragment,
} from 'storefrontapi.generated';

export type RedirectToOptionsProps = {
  parentId: string;
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
  productOptionWithVariants: ArtistTreatmentIndexProductFragment;
  children: (props: OptionSelectorChildrenProp) => React.ReactElement;
};

export type OptionSelectorChildrenProp = {
  parentId: string;
  productId: string;
  variant: ArtistTreatmentIndexVariantFragment;
};

export function OptionSelector({
  parentId,
  productOptionWithVariants,
  children,
}: OptionSelectorProps) {
  const optionsMarkup = productOptionWithVariants.variants.nodes.map(
    (variant) => {
      return (
        <Flex key={variant.id}>
          {children({
            parentId,
            productId: parseGid(productOptionWithVariants.id).id,
            variant,
          })}
        </Flex>
      );
    },
  );

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
  productId,
  variant,
}: OptionSelectorChildrenProp) {
  const [searchParams, setSearchParams] = useSearchParams();
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
      &nbsp; DKK - {variant.duration?.value} min
    </Button>
  );
}

export function useCalculateDurationAndPrice({
  parentId,
  allProductOptionsWithVariants,
  currentPrice,
  currentDuration,
}: {
  parentId: string;
  allProductOptionsWithVariants: ArtistTreatmentIndexProductFragment[];
  currentPrice?: number;
  currentDuration?: number;
}) {
  const [searchParams] = useSearchParams();

  const pickedVariants = useMemo(() => {
    return allProductOptionsWithVariants.map((product) => {
      const value = searchParams.get(
        `options[${parseGid(parentId).id}][${parseGid(product.id).id}]`,
      );
      const pickedVariant = product.variants.nodes.find(
        (variant) => parseGid(variant.id).id === value,
      );
      if (!pickedVariant) {
        throw new Response('PickedVarients - Variant not found', {status: 404});
      }
      return pickedVariant;
    });
  }, [allProductOptionsWithVariants, parentId, searchParams]);

  const [totalDuration, totalPrice] = useMemo(() => {
    const totalPrice = pickedVariants.reduce(
      (total, variant) => total + parseInt(variant.price.amount || ''),
      currentPrice || 0,
    );

    const totalDuration = pickedVariants.reduce(
      (total, variant) => total + parseInt(variant.duration?.value || ''),
      currentDuration || 0,
    );

    return [totalDuration, totalPrice];
  }, [currentDuration, currentPrice, pickedVariants]);

  return {pickedVariants, totalDuration, totalPrice};
}