import {
  Divider,
  Group,
  Radio,
  Stack,
  TextInput,
  Textarea,
  Title,
  rem,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {conform, useFieldset, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {IconAt} from '@tabler/icons-react';
import {MultiTags} from '~/components/form/MultiTags';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerUpdateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  console.log(submission.value);
  try {
    await getBookingShopifyApi().customerUpdate(
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
    {
      speaks,
      yearsExperience,
      shortDescription,
      aboutMe,
      gender,
      professions,
      specialties,
      social,
    },
  ] = useForm({
    lastSubmission,
    defaultValue: user,
  });

  const {instagram, twitter, youtube} = useFieldset(form.ref, social);

  return (
    <>
      <Title>Redigere din profil</Title>
      <Divider my="md" />

      <Form method="POST" {...form.props}>
        <Stack gap="md">
          <TextInput
            label="Vælge en profilnavn"
            disabled
            defaultValue={user.username}
          />

          <Radio.Group
            label="Hvad er din køn?"
            withAsterisk
            {...conform.input(gender)}
          >
            <Group mt="xs">
              <Radio value="woman" label="Kvinde" />

              <Radio value="man" label="Mand" />
            </Group>
          </Radio.Group>

          <MultiTags
            field={professions}
            data={professionOptions}
            name="professions"
            label="Professioner"
            placeholder="Vælg professioner"
          />

          <TextInput label="Års erfaring" {...conform.input(yearsExperience)} />

          <MultiTags
            field={specialties}
            data={specialityOptions}
            name="specialties"
            label="Hvad er dine specialer?"
            placeholder="Vælge special(er)?"
          />

          <MultiTags
            field={speaks}
            data={[
              {label: 'Dansk', value: 'danish'},
              {label: 'Engelsk', value: 'english'},
            ]}
            name="speaks"
            label="Hvilken sprog taler du"
            placeholder="Vælge sprog"
          />

          <TextInput
            label="Skriv kort beskrivelse"
            {...conform.input(shortDescription)}
          />
          <Textarea
            label="Om mig"
            placeholder="Fortæl om dig selv"
            {...conform.input(aboutMe)}
            error={aboutMe.error && 'Udfyld venligst din biografi'}
            minRows={10}
          />

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

          <SubmitButton>Opdatere</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}
