import {
  Button,
  Divider,
  MultiSelect,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {conform, list, useFieldList, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerUpsertBody} from '~/lib/zod/bookingShopifyApi';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const customer = await getCustomer({context, customerAccessToken});

  const formData = await request.formData();
  const submission = parse(formData, {schema: customerUpsertBody});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  return json({...submission, customerId: parseGid(customer.id).id});

  /*await getBookingShopifyApi().customerUpsert(
    parseGid(customer.id).id,
    submission.value,
  );

  return redirect('./account/public');*/
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const customer = await getCustomer({context, customerAccessToken});

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

  const [form, {username, shortDescription, aboutMe, professions}] = useForm({
    lastSubmission,
    defaultValue: user,
    onValidate({formData}) {
      return parse(formData, {schema: customerUpsertBody});
    },
  });

  const itemsList = useFieldList(form.ref, professions);

  return (
    <>
      <Title>Redigere din profil</Title>
      <Divider my="sm" />

      <Form method="POST" {...form.props}>
        <Stack>
          <MultiSelect
            data={professionOptions}
            label="Professions"
            placeholder="Select professions"
            value={user.professions}
            onChange={(value: string[]) => {
              itemsList.every((item) => {
                list.remove(item.name, {index: 0});
              });
            }}
          />

          <MultiSelect
            data={specialityOptions}
            name="specialties"
            label="Hvad er dine specialer?"
            placeholder="Vælge special(er)?"
            defaultValue={user.specialties}
          />

          <TextInput label="Vælge en profilnavn" {...conform.input(username)} />
          <TextInput
            label="Skriv kort beskrivelse"
            {...conform.input(shortDescription)}
          />
          <Textarea
            label="About Me"
            placeholder="Tell us about yourself"
            {...conform.input(aboutMe)}
            error={aboutMe.error && 'Please fill in your bio'}
          />

          <Button type="submit">Submit</Button>
        </Stack>
      </Form>
    </>
  );
}

function convertToValidUrlPath(firstName: string, lastName: string): string {
  const allowedCharactersRegex = /[^a-zA-Z0-9\-_]/g;
  firstName = firstName.replace(allowedCharactersRegex, '');
  lastName = lastName.replace(allowedCharactersRegex, '');
  const urlPath = `${firstName}-${lastName}`;
  return urlPath;
}
