import {Stack, TextInput, rem} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {IconAt} from '@tabler/icons-react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerUpdateBody.pick({
  social: true,
});

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerUpdate(
      parseGid(customer.id).id,
      submission.value,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/public/social`,
      title: 'Din profil',
      message: 'Profil opdateret',
      color: 'green',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const {payload: user} = await getBookingShopifyApi().customerGet(
    parseGid(customer.id).id,
  );

  return json({user});
}

export default function AccountBusiness() {
  const lastResult = useActionData<typeof action>();
  const {user} = useLoaderData<typeof loader>();

  const [form, {social}] = useForm({
    lastResult,
    defaultValue: user,
  });

  const {instagram, youtube, facebook, x} = social.getFieldset();

  return (
    <>
      <Form method="POST" {...getFormProps(form)}>
        <Stack gap="md">
          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Instagram"
            placeholder="Instagram profil"
            {...getInputProps(instagram, {type: 'text'})}
          />

          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Twitter (X)"
            placeholder="Twitter (X)"
            {...getInputProps(x, {type: 'text'})}
          />

          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Youtube"
            placeholder="Youtube profil"
            {...getInputProps(youtube, {type: 'text'})}
          />

          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Facebook"
            placeholder="Facebook profil"
            {...getInputProps(facebook, {type: 'text'})}
          />
          <div>
            <SubmitButton>Opdatere</SubmitButton>
          </div>
        </Stack>
      </Form>
    </>
  );
}
