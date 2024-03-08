import {Stack, TextInput, rem} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {conform, useFieldset, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
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
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
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
    return json(submission);
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
  const lastSubmission = useActionData<typeof action>();
  const {user} = useLoaderData<typeof loader>();

  const [form, {social}] = useForm({
    lastSubmission,
    defaultValue: user,
  });

  const {instagram, twitter, youtube} = useFieldset(form.ref, social);

  return (
    <>
      <Form method="POST">
        <Stack gap="md">
          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Instagram"
            placeholder="Instagram profil"
            {...conform.input(instagram)}
          />

          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Twitter (X)"
            placeholder="Twitter (X)"
            {...conform.input(twitter)}
          />

          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Youtube"
            placeholder="Youtube profil"
            {...conform.input(youtube)}
          />

          <div>
            <SubmitButton>Opdatere</SubmitButton>
          </div>
        </Stack>
      </Form>
    </>
  );
}
