import {Button, Card, Flex, Image, Radio, Text, Title} from '@mantine/core';
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

  const requiredParams = productOptions
    .filter((product) => product.required?.value.toLowerCase() === 'true')
    .map((product) => {
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
  required: boolean;
  variant: TreatmentOptionVariantFragment;
};

export function OptionSelector({
  productWithVariants,
  children,
}: OptionSelectorProps) {
  const [searchParams] = useSearchParams();

  const parentId = parseGid(productWithVariants.parentId?.value).id;
  const productId = parseGid(productWithVariants.id).id;
  const variantId = searchParams.get(`options[${parentId}][${productId}]`);
  const selectedVariant = productWithVariants.variants.nodes.find(
    (p) => parseGid(p.id).id === variantId,
  );

  const optionsMarkup = productWithVariants.variants.nodes.map((variant) => {
    return (
      <Flex key={variant.id}>
        {children({
          parentId,
          productId,
          required:
            productWithVariants.required?.value.toLowerCase() === 'true',
          variant,
        })}
      </Flex>
    );
  });

  return (
    <Card withBorder>
      <Flex direction={{base: 'column', sm: 'row'}} gap="xs">
        <Flex direction="column" gap="xs" style={{flex: 1}}>
          <Title order={3}>
            {productWithVariants.options[0].name} (
            {productWithVariants.required?.value.toLowerCase() === 'true'
              ? 'påkrævet'
              : 'valgfri'}
            )
          </Title>
          <Text>{productWithVariants.description}</Text>
        </Flex>
        <Flex
          direction="column"
          justify="center"
          align="center"
          gap="md"
          style={{flex: 1}}
        >
          <div>
            <Text fw="bold" ta="center">
              {selectedVariant ? (
                <Money as="span" data={selectedVariant.price} />
              ) : null}
            </Text>
            <Text c="dimmed" ta="center">
              {selectedVariant?.title}
            </Text>
          </div>
          <Flex gap="xs" wrap={{base: 'nowrap', sm: 'wrap'}}>
            {optionsMarkup}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export function ProductOption({
  parentId,
  productId,
  required,
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

  const toggleSearchParams = () => {
    const key = `options[${parentId}][${productId}]`;
    const value = parseGid(variant.id).id;
    setSearchParams((prev) => {
      if (prev.get(key)) {
        prev.delete(key);
      } else {
        prev.set(key, value);
      }
      return prev;
    });
  };

  if (!required) {
    return (
      <Button
        onClick={toggleSearchParams}
        variant="outline"
        radius="md"
        size="xl"
        px="xs"
        styles={{
          root: {
            flex: 1,
            border:
              value === parseGid(variant.id).id
                ? '4px solid var(--mantine-color-blue-outline)'
                : '1px solid var(--mantine-color-gray-outline)',
          },
        }}
        c="black"
      >
        {value === parseGid(variant.id).id ? 'Fjern' : 'Tilføj'}
      </Button>
    );
  }
  return (
    <Button
      onClick={updateSearchParams}
      variant="outline"
      radius="md"
      size="xl"
      px="xs"
      styles={{
        root: {
          flex: 1,
          border:
            value === parseGid(variant.id).id
              ? '4px solid var(--mantine-color-blue-outline)'
              : '1px solid var(--mantine-color-gray-outline)',
        },
      }}
      color={value === parseGid(variant.id).id ? 'blue' : 'gray'}
    >
      {variant.image?.url ? (
        <Image src={variant.image.url} height="100%" />
      ) : (
        <Radio
          checked={value === parseGid(variant.id).id}
          onChange={() => {}}
        />
      )}
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
    return productOptions?.reduce((selectedVariants, product) => {
      const value = searchParams.get(
        `options[${parseGid(parentId).id}][${parseGid(product.id).id}]`,
      );
      const pickedVariant = product.variants.nodes.find(
        (variant) => parseGid(variant.id).id === value,
      );
      if (pickedVariant) {
        selectedVariants.push(pickedVariant);
      }
      return selectedVariants;
    }, [] as TreatmentOptionVariantFragment[]);
  }, [productOptions, parentId, searchParams]);

  const [totalDuration, totalPrice] = useMemo(() => {
    const totalPrice = pickedVariants?.reduce(
      (total, variant) => total + parseInt(variant?.price.amount || ''),
      currentPrice || 0,
    );

    const totalDuration = pickedVariants?.reduce(
      (total, variant) => total + parseInt(variant?.duration?.value || ''),
      currentDuration || 0,
    );

    return [totalDuration, totalPrice];
  }, [currentDuration, currentPrice, pickedVariants]);

  return {pickedVariants, totalDuration, totalPrice};
}
