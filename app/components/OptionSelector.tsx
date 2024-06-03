import {
  Box,
  Button,
  Card,
  Flex,
  Image,
  Radio,
  Text,
  Title,
} from '@mantine/core';
import {redirect, useSearchParams} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import React, {useMemo} from 'react';
import type {
  LocationFragment,
  PickMoreTreatmentProductFragment,
  TreatmentOptionFragment,
  TreatmentOptionVariantFragment,
  TreatmentProductWithOptionsFragment,
} from 'storefrontapi.generated';
import {convertLocations} from '~/lib/convertLocations';
import {durationToTime} from '~/lib/duration';
import {parseOptionsFromQuery} from '~/lib/parseOptionsQueryParameters';

export type RedirectToOptionsProps = {
  productOptions: TreatmentOptionFragment[];
  productLocations?: LocationFragment[];
  request: Request;
};

export function redirectToOptions({
  productOptions,
  productLocations,
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

    if (productLocations && productLocations.length === 1) {
      searchParams.set(`locationId`, productLocations[0].handle);
    }
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
    <Card withBorder radius="md">
      <Box mb="sm">
        <Title order={4}>{productWithVariants.options[0].name} </Title>
        {selectedVariant ? (
          <div>
            <Flex align="center" gap="xs">
              <Text fz="sm">
                <Money
                  as="span"
                  data={selectedVariant.price}
                  withoutCurrency
                  withoutTrailingZeros
                />{' '}
                kr.
              </Text>
              <Text fz="sm" c="dimmed">
                {durationToTime(selectedVariant?.duration?.value ?? 0)}
              </Text>
            </Flex>
          </div>
        ) : null}
      </Box>

      <Flex direction="column" gap="xs" wrap={{base: 'nowrap', sm: 'wrap'}}>
        {optionsMarkup}
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
    setSearchParams(
      (prev) => {
        prev.set(`options[${parentId}][${productId}]`, parseGid(variant.id).id);
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
  };

  const toggleSearchParams = () => {
    const key = `options[${parentId}][${productId}]`;
    const value = parseGid(variant.id).id;
    setSearchParams(
      (prev) => {
        if (prev.get(key)) {
          prev.delete(key);
        } else {
          prev.set(key, value);
        }
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
  };

  if (!required) {
    return (
      <Button
        onClick={toggleSearchParams}
        variant="outline"
        radius="md"
        size="lg"
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
      fullWidth
      onClick={updateSearchParams}
      variant="outline"
      radius="md"
      size="lg"
      styles={{
        root: {
          border:
            value === parseGid(variant.id).id
              ? '4px solid var(--mantine-color-blue-outline)'
              : '1px solid var(--mantine-color-gray-outline)',
        },
      }}
      color="black"
      fw="normal"
      leftSection={
        variant.image?.url ? (
          <Image src={variant.image.url} height="40px" width="auto" />
        ) : (
          <Radio
            checked={value === parseGid(variant.id).id}
            onChange={() => {}}
          />
        )
      }
    >
      {variant.title}
    </Button>
  );
}

export function useCalculationForExtraProducts({
  product,
  products,
}: {
  product: TreatmentProductWithOptionsFragment;
  products: PickMoreTreatmentProductFragment[];
}) {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('locationId');

  const selectedLocation = useMemo(() => {
    const locations = convertLocations(product.locations?.references?.nodes);
    return locations.find((l) => l._id === locationId);
  }, [locationId, product.locations?.references?.nodes]);

  const selectedProductsIds = searchParams.getAll('productIds');
  const summary = useMemo(() => {
    const pickedVariants: Array<
      Pick<
        TreatmentOptionVariantFragment,
        'title' | 'price' | 'compareAtPrice' | 'duration'
      > & {isVariant: boolean}
    > = [];
    const selectedProducts = products.filter((p) =>
      selectedProductsIds.some((sp) => sp === parseGid(p.id).id),
    );

    const optionsFromQuery: Record<
      string,
      Record<string, string>
    > = parseOptionsFromQuery(searchParams);

    const summary = selectedProducts.reduce(
      (summary, product) => {
        const productId = parseGid(product.id).id;
        const productOptions = optionsFromQuery[productId];

        pickedVariants.push({
          title: product.title,
          duration: product.duration,
          isVariant: false,
          ...product.variants.nodes[0],
        });

        const productPrice = parseInt(product.variants.nodes[0].price.amount);
        const productDuration = parseInt(product.duration?.value || '');

        if (!product.options) {
          return {
            price: summary.price + productPrice,
            duration: summary.duration + productDuration,
          };
        }

        const variantSummary = product.options?.references?.nodes
          .filter((p) => productOptions[parseGid(p.id).id])
          .reduce(
            (summary, product) => {
              const productId = parseGid(product.id).id;
              const variantId = productOptions[productId];
              const variant = product.variants.nodes.find(
                (p) => parseGid(p.id).id === variantId,
              );

              if (variant) {
                pickedVariants.push({
                  title: product.title + ' - ' + variant.title,
                  duration: variant.duration,
                  price: variant.price,
                  compareAtPrice: variant.compareAtPrice,
                  isVariant: true,
                });
                const variantPrice = parseInt(variant?.price.amount || '');
                const variantDuration = parseInt(
                  variant?.duration?.value || '',
                );

                return {
                  price: summary.price + variantPrice,
                  duration: summary.duration + variantDuration,
                };
              }

              return {
                price: summary.price,
                duration: summary.duration,
              };
            },
            {
              price: 0,
              duration: 0,
            },
          ) || {price: 0, duration: 0};

        return {
          price: summary.price + variantSummary.price + productPrice,
          duration:
            summary.duration + variantSummary.duration + productDuration,
        };
      },
      {price: 0, duration: 0},
    );

    return {...summary, pickedVariants};
  }, [products, searchParams, selectedProductsIds]);

  return {selectedLocation, ...summary};
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
    const totalPrice =
      pickedVariants?.reduce(
        (total, variant) => total + parseInt(variant?.price.amount || ''),
        currentPrice || 0,
      ) || currentPrice;

    const totalDuration =
      pickedVariants?.reduce(
        (total, variant) => total + parseInt(variant?.duration?.value || ''),
        currentDuration || 0,
      ) || currentDuration;

    return [totalDuration || 0, totalPrice || 0];
  }, [currentDuration, currentPrice, pickedVariants]);

  return {pickedVariants: pickedVariants ?? [], totalDuration, totalPrice};
}
