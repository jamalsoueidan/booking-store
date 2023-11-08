import {Divider, Stack, TextInput, Textarea, Title} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {MultiTags} from '~/components/form/MultiTags';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerUpsertBody} from '~/lib/zod/bookingShopifyApi';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {schema: customerUpsertBody});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    await getBookingShopifyApi().customerUpsert(
      parseGid(customer.id).id,
      submission.value,
    );

    return redirect('/account/public');
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const {payload: user} = await getBookingShopifyApi().customerGet(
    parseGid(customer.id).id,
  );

  const {payload: professionOptions} =
    await getBookingShopifyApi().metaProfessions();

  const {payload: specialityOptions} =
    await getBookingShopifyApi().metaspecialties();

  return json({customer, user, professionOptions, specialityOptions});
}

export default function AccountBusiness() {
  const lastSubmission = useActionData<typeof action>();
  const {user, professionOptions, specialityOptions} =
    useLoaderData<typeof loader>();

  const [
    form,
    {username, shortDescription, aboutMe, professions, specialties},
  ] = useForm({
    lastSubmission,
    defaultValue: user,
  });

  return (
    <>
      <Title>Redigere din profil</Title>
      <Divider my="md" />

      <Form method="POST" {...form.props}>
        <Stack>
          <MultiTags
            form={form}
            field={professions}
            data={professionOptions}
            name="professions"
            label="Professioner"
            placeholder="Vælg professioner"
            defaultValue={user.professions}
          />

          <MultiTags
            form={form}
            field={specialties}
            data={specialityOptions}
            name="specialties"
            label="Hvad er dine specialer?"
            placeholder="Vælge special(er)?"
            defaultValue={user.specialties || []}
          />

          <TextInput label="Vælge en profilnavn" {...conform.input(username)} />
          <TextInput
            label="Skriv kort beskrivelse"
            {...conform.input(shortDescription)}
          />
          <Textarea
            label="Om mig"
            placeholder="Fortæl om dig selv"
            {...conform.input(aboutMe)}
            error={aboutMe.error && 'Udfyld venligst din biografi'}
          />

          <SubmitButton>Submit</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}
