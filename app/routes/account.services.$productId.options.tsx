import {
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';
import {type loader as rootLoader} from './account.services.$productId';

import {
  Accordion,
  Anchor,
  Badge,
  Button,
  Flex,
  Modal,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {useEffect, useState} from 'react';

import {useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {IconMoodSad, IconPlus} from '@tabler/icons-react';
import {ServicesOptionsTagOptions} from '~/graphql/account/ServicesOptions';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductOptionsListItem} from '~/lib/api/model';
import {customerProductOptionsUpdateBody} from '~/lib/zod/bookingShopifyApi';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {storefront} = context;
  const {productId} = params;

  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const {products: systemOptions} = await storefront.query(
    ServicesOptionsTagOptions,
    {
      variables: {
        first: 5,
        query: "(tag:'system') AND (tag:'options')",
      },
      cache: storefront.CacheLong(),
    },
  );

  const {payload: userOptions} =
    await getBookingShopifyApi().customerProductOptionsList(
      customerId,
      productId,
    );

  return json({systemOptions, userOptions});
}

export default function Component() {
  const {systemOptions, userOptions} = useLoaderData<typeof loader>();
  const {selectedProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();
  const location = useLocation();
  const navigate = useNavigate();

  const close = () => {
    navigate('./');
  };

  return (
    <>
      {userOptions.length === 0 ? (
        <Flex gap="lg" direction="column" justify="center" align="center">
          <ThemeIcon variant="white" size={rem(100)}>
            <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
          </ThemeIcon>
          <Title ta="center" order={2} data-testid="empty-title">
            Du har ingen varianter
          </Title>
          <Button
            component={Link}
            to="#create"
            data-testid="empty-create-button"
            leftSection={<IconPlus size={14} />}
          >
            Tilføj variant
          </Button>
        </Flex>
      ) : (
        <>
          <Flex justify="space-between">
            <Title order={3}>Varianter</Title>
            <Anchor component={Link} to="#create">
              + Tilføj variant(er)
            </Anchor>
          </Flex>
          <Accordion variant="contained" mt="lg">
            {userOptions.map((option) => (
              <Accordion.Item value={option.title} key={option.productId}>
                <Accordion.Control>
                  {option.title}{' '}
                  {option.variants.map((v) => (
                    <Badge key={v.variantId} color="gray.5" mx="4">
                      {v.title}
                    </Badge>
                  ))}
                </Accordion.Control>
                <Accordion.Panel>
                  <OptionForm option={option} />
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}

      <Modal opened={location.hash === '#create'} onClose={close}>
        <OptionAddModal
          systemOptions={systemOptions}
          selectedProduct={selectedProduct}
          close={close}
        />
      </Modal>
    </>
  );
}

function OptionForm({option}: {option: CustomerProductOptionsListItem}) {
  const fetcher = useFetcher({key: 'update-product'});
  const [, fields] = useForm({
    defaultValue: {
      variants: option.variants.map((v) => ({
        title: v.title,
        id: v.variantId.toString(),
        price: v.price,
        duration: v.duration.value.toString(),
      })),
    },
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema: customerProductOptionsUpdateBody,
      });
    },
  });

  const variants = fields.variants.getFieldList();

  return (
    <fetcher.Form method="post" action={`${option.productId}/update`}>
      <Stack gap="md">
        {variants.map((v) => {
          const variant = v.getFieldset();
          return (
            <Flex key={v.key} gap="md" align="flex-end">
              <input
                type="hidden"
                name={variant.id.name}
                value={variant.id.initialValue}
              />
              <Text fw="bold" miw={100} mb="xs">
                {(variant as any).title.initialValue}
              </Text>
              <TextInput
                label="Pris"
                name={variant.price.name}
                defaultValue={variant.price.initialValue}
                rightSection="DKK"
                rightSectionWidth={48}
                w="120px"
              />
              <TextInput
                label="Behandlingstid"
                name={variant.duration.name}
                defaultValue={variant.duration.initialValue}
                rightSection="min"
                rightSectionWidth={42}
                w="120px"
              />
            </Flex>
          );
        })}

        <Flex gap="sm">
          <Text miw={100}></Text>
          <Button
            type="submit"
            variant="filled"
            loading={fetcher.state !== 'idle'}
          >
            Opdatere
          </Button>
          <DestroyButton optionProductId={option.productId} />
        </Flex>
      </Stack>
    </fetcher.Form>
  );
}

type OptionAddModalProps = {
  selectedProduct: SerializeFrom<typeof rootLoader>['selectedProduct'];
  systemOptions: SerializeFrom<typeof loader>['systemOptions'];
  close: () => void;
};

function OptionAddModal({
  selectedProduct,
  systemOptions,
  close,
}: OptionAddModalProps) {
  const [optionProductId, setOptionProductId] = useState<string | null>(null);
  const fetcher = useFetcher({key: 'duplicate-product'});
  const selectedOptionProduct = optionProductId
    ? systemOptions.nodes.find((p) => p.id === optionProductId)
    : null;

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'loading') {
      close();
    }
  }, [close, fetcher.data, fetcher.state]);

  return (
    <fetcher.Form method="POST" action="add">
      <Stack>
        <Flex direction="column" gap="md">
          <Stack gap="0" style={{flex: 1}}>
            <Text fw="bold">Valg muligheder:</Text>
            <Text>
              Hvilken valg mulighed vil du tilføje til den her ydelse??
            </Text>
          </Stack>
          <Flex gap="lg" style={{flex: 1}}>
            <Select
              data={systemOptions.nodes.map((p) => ({
                value: p.id,
                label: p.title,
              }))}
              placeholder="-"
              name="optionProductId"
              onChange={setOptionProductId}
              allowDeselect={false}
              data-testid="options-select"
            />
            {selectedOptionProduct ? (
              <>
                <input
                  type="hidden"
                  name="title"
                  value={selectedOptionProduct.title}
                />
                <input
                  type="hidden"
                  name="productTitle"
                  value={selectedProduct.title}
                />
              </>
            ) : null}
            <Button type="submit" loading={fetcher.state !== 'idle'}>
              Tilføj
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </fetcher.Form>
  );
}

function DestroyButton({optionProductId}: {optionProductId: number}) {
  const fetcher = useFetcher({key: 'destroy-product'});

  const destroy = () => {
    fetcher.submit({optionProductId}, {method: 'post', action: 'destroy'});
  };

  return (
    <Button
      variant="filled"
      color="red"
      onClick={destroy}
      loading={fetcher.state !== 'idle'}
    >
      Slet
    </Button>
  );
}
