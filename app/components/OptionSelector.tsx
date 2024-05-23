import {
  Button,
  Checkbox,
  Flex,
  Image,
  Radio,
  rem,
  Text,
  Title,
} from '@mantine/core';
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
  const parentId = parseGid(productWithVariants.parentId?.value).id;
  const optionsMarkup = productWithVariants.variants.nodes.map((variant) => {
    return (
      <Flex key={variant.id}>
        {children({
          parentId,
          productId: parseGid(productWithVariants.id).id,
          required:
            productWithVariants.required?.value.toLowerCase() === 'true',
          variant,
        })}
      </Flex>
    );
  });

  return (
    <Flex direction="column" gap="xs" py="sm">
      <Title order={3}>
        {productWithVariants.options[0].name} (
        {productWithVariants.required?.value.toLowerCase() === 'true'
          ? 'påkrævet'
          : 'valgfri'}
        )
      </Title>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        gap="xs"
        wrap={{base: 'nowrap', sm: 'wrap'}}
      >
        {optionsMarkup}
      </Flex>
    </Flex>
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
        h="auto"
        px="sm"
        py={rem(6)}
        styles={{
          root: {
            flex: 1,
            border:
              value === parseGid(variant.id).id
                ? '2px solid var(--mantine-color-blue-outline)'
                : '1px solid var(--mantine-color-gray-outline)',
          },
        }}
        color={value === parseGid(variant.id).id ? 'blue' : 'gray'}
      >
        <Flex direction="row" justify="center" align="center" gap="md">
          {variant.image?.url ? (
            <Image src={variant.image.url} mah={rem(50)} />
          ) : (
            <Checkbox
              checked={value === parseGid(variant.id).id}
              onChange={() => {}}
            />
          )}
          <Flex direction="column" justify="flex-start">
            <Text c="black" fw="600" ta="left">
              {variant.title}
            </Text>
            <Text c="gray" fz="sm" ta="left">
              +{variant.duration?.value} min,{' '}
              <Money as="span" data={variant.price} />
            </Text>
          </Flex>
        </Flex>
      </Button>
    );
  }
  return (
    <Button
      onClick={updateSearchParams}
      variant="outline"
      radius="md"
      h="auto"
      px="sm"
      py={rem(6)}
      styles={{
        root: {
          flex: 1,
          border:
            value === parseGid(variant.id).id
              ? '2px solid var(--mantine-color-blue-outline)'
              : '1px solid var(--mantine-color-gray-outline)',
        },
      }}
      color={value === parseGid(variant.id).id ? 'blue' : 'gray'}
    >
      <Flex direction="row" justify="center" align="center" gap="md">
        {variant.image?.url ? (
          <Image src={variant.image.url} mah={rem(50)} />
        ) : (
          <Radio
            checked={value === parseGid(variant.id).id}
            onChange={() => {}}
          />
        )}
        <Flex direction="column" justify="flex-start">
          <Text c="black" fw="600" ta="left">
            {variant.title}
          </Text>
          <Text c="gray" fz="sm" ta="left">
            +{variant.duration?.value} min,{' '}
            <Money as="span" data={variant.price} />
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
