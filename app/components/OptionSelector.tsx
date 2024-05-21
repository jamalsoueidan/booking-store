import {Button, Flex, Radio, rem, Text, Title} from '@mantine/core';
import {redirect, useSearchParams} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import React, {useMemo} from 'react';
import type {
  TreatmentOptionFragment,
  TreatmentOptionVariantFragment,
} from 'storefrontapi.generated';

export type RedirectToOptionsProps = {
  productOptions: TreatmentOptionFragment[];
  request: Request;
};

export function redirectToOptions({
  productOptions,
  request,
}: RedirectToOptionsProps) {
  const parentId = parseGid(productOptions[0].parentId?.value).id;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const requiredParams = productOptions.map((product) => {
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
  productWithVariants: TreatmentOptionFragment;
  children: (props: OptionSelectorChildrenProp) => React.ReactElement;
};

export type OptionSelectorChildrenProp = {
  parentId: string;
  productId: string;
  variant: TreatmentOptionVariantFragment;
};

export function OptionSelector({
  productWithVariants,
  children,
}: OptionSelectorProps) {
  const parentId = parseGid(productWithVariants.parentId?.value).id;
  const optionsMarkup = productWithVariants.variants.nodes.map((variant) => {
    return (
      <Flex key={variant.id}>
        {children({
          parentId,
          productId: parseGid(productWithVariants.id).id,
          variant,
        })}
      </Flex>
    );
  });

  return (
    <Flex direction="column" gap="xs" py="sm">
      <Title order={3}>{productWithVariants.options[0].name}</Title>
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
      variant="outline"
      radius="md"
      mih={rem(65)}
      styles={{
        root: {
          border:
            value === parseGid(variant.id).id
              ? '2px solid var(--mantine-color-blue-outline)'
              : '1px solid var(--mantine-color-gray-outline)',
        },
      }}
      color={value === parseGid(variant.id).id ? 'blue' : 'gray'}
    >
      <Flex direction="row" justify="center" align="center" gap="md">
        <Radio checked={value === parseGid(variant.id).id} />
        <Flex direction="column" justify="flex-start">
          <Text c="black" fw="600" ta="left">
            {variant.title}
          </Text>
          <Text c="gray" fz="sm" ta="left">
            <Money as="span" data={variant.price} />, {variant.duration?.value}{' '}
            min
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
}

export function useCalculateDurationAndPrice({
  parentId,
  productOptions,
  currentPrice,
  currentDuration,
}: {
  parentId: string;
  productOptions?: TreatmentOptionFragment[];
  currentPrice?: number;
  currentDuration?: number;
}) {
  const [searchParams] = useSearchParams();

  const pickedVariants = useMemo(() => {
    return productOptions?.map((product) => {
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
  }, [productOptions, parentId, searchParams]);

  const [totalDuration, totalPrice] = useMemo(() => {
    const totalPrice = pickedVariants?.reduce(
      (total, variant) => total + parseInt(variant.price.amount || ''),
      currentPrice || 0,
    );

    const totalDuration = pickedVariants?.reduce(
      (total, variant) => total + parseInt(variant.duration?.value || ''),
      currentDuration || 0,
    );

    return [totalDuration, totalPrice];
  }, [currentDuration, currentPrice, pickedVariants]);

  return {pickedVariants, totalDuration, totalPrice};
}
