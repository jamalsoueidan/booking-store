import {
  FormProvider,
  getFormProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Divider, Flex, Stack, Switch, Text, Title} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {NumericInput} from '~/components/form/NumericInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';
import {customerProductUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductUpdateBody;

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const {productId} = params;
  if (!productId) {
    throw new Response('Missing productId param', {status: 404});
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerProductUpdate(
      customerId,
      productId,
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/products`,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/product/${productId}`,
    );

    return redirectWithSuccess('.', {
      message: 'Ydelsen er nu opdateret!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {productId} = params;
  if (!productId) {
    throw new Error('Missing productId param');
  }

  const locations = await getBookingShopifyApi().customerLocationList(
    customerId,
    context,
  );

  const {payload: defaultValue} =
    await getBookingShopifyApi().customerProductGet(
      customerId,
      productId,
      context,
    );

  return json({
    defaultValue: {
      ...defaultValue,
      hideFromCombine: defaultValue.hideFromCombine.toString(),
      hideFromProfile: defaultValue.hideFromProfile.toString(),
    },
    locations: locations.payload,
  });
}

export default function EditAddress() {
  const {locations, defaultValue} = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  const hideFromProfile = useInputControl(fields.hideFromProfile);
  const hideFromCombine = useInputControl(fields.hideFromCombine);

  return (
    <FormProvider context={form.context}>
      <Form method="post" {...getFormProps(form)}>
        <FlexInnerForm>
          <Title order={3}>Synlighed</Title>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Skjul:</Text>
              <Text>Skjul fra evt. profil siden eller kombinere siden?</Text>
            </Stack>
            <Stack style={{flex: 1}}>
              <Switch
                label="Skjul fra 'profil' siden"
                defaultChecked={fields.hideFromProfile.initialValue === 'true'}
                onChange={(event) => {
                  hideFromProfile.change(
                    event.currentTarget.checked.toString(),
                  );
                }}
              />
              <Switch
                label="Skjul fra 'køb flere' siden"
                defaultChecked={fields.hideFromCombine.initialValue === 'true'}
                onChange={(event) => {
                  hideFromCombine.change(
                    event.currentTarget.checked.toString(),
                  );
                }}
              />
            </Stack>
          </Flex>

          <Divider />

          <Title order={3}>Pris</Title>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Pris:</Text>
              <Text>Den pris, kunden skal betale.</Text>
            </Stack>
            <div style={{flex: 1}}>
              <NumericInput
                field={fields.price}
                required
                hideControls={true}
                data-testid="price-input"
                rightSection="DKK"
                rightSectionWidth={50}
                style={{width: '100px'}}
              />
            </div>
          </Flex>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Før-pris:</Text>
              <Text>Hvad har prisen været tidligere?</Text>
            </Stack>
            <div style={{flex: 1}}>
              <NumericInput
                field={fields.compareAtPrice}
                hideControls={true}
                rightSection="DKK"
                rightSectionWidth={50}
                data-testid="compare-at-price-input"
                style={{width: '100px'}}
              />
            </div>
          </Flex>

          <Divider />
          <Title order={3}>Lokation</Title>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Lokation for denne ydelse:</Text>
              <Text>Tilknyt en eller flere lokationer</Text>
            </Stack>
            <SwitchGroupLocations
              style={{flex: 1}}
              description="Mindst (1) skal være valgt."
              field={fields.locations}
              data={locations}
            />
          </Flex>
          <Divider />

          <SubmitButton>Gem ændringer</SubmitButton>
        </FlexInnerForm>
      </Form>
    </FormProvider>
  );
}
