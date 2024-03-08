import {Group, Radio, Stack, Text, TextInput, rem} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {conform, useForm, useInputEvent} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {useRef} from 'react';
import {MultiTags} from '~/components/form/MultiTags';
import {SubmitButton} from '~/components/form/SubmitButton';
import {TextEditor} from '~/components/richtext/TextEditor';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerUpdateBody;

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
      redirectUrl: `/account/public`,
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

  const {payload: professionOptions} =
    await getBookingShopifyApi().metaProfessions();

  const {payload: specialityOptions} =
    await getBookingShopifyApi().metaspecialties();

  return json({user, professionOptions, specialityOptions});
}

export default function AccountBusiness() {
  const lastSubmission = useActionData<typeof action>();
  const {user, professionOptions, specialityOptions} =
    useLoaderData<typeof loader>();

  const [
    ,
    {
      speaks,
      yearsExperience,
      shortDescription,
      aboutMe,
      gender,
      professions,
      specialties,
    },
  ] = useForm({
    lastSubmission,
    defaultValue: user,
  });

  const shadowInputRef = useRef<HTMLInputElement>(null);

  const control = useInputEvent({
    ref: shadowInputRef,
  });

  return (
    <>
      <Form method="POST">
        <Stack gap="md">
          <TextInput
            label="Vælge en profilnavn"
            disabled
            defaultValue={user.username}
          />

          <Radio.Group
            label="Hvad er dit køn?"
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
            label="Hvad er dine professioner"
            placeholder="Vælg professioner"
          />

          <MultiTags
            field={specialties}
            data={specialityOptions}
            name="specialties"
            label="Hvad er dine specialer?"
            placeholder="Vælge special(er)?"
          />

          <TextInput label="Års erfaring" {...conform.input(yearsExperience)} />

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

          <input
            ref={shadowInputRef}
            {...conform.input(aboutMe, {hidden: true})}
          />

          <div>
            <Text size="sm" mb={rem(2)} fw={500}>
              Fortæl om dig selv og din erfaring:
            </Text>
            <TextEditor
              content={aboutMe.defaultValue}
              onUpdate={({editor}) => {
                control.change(JSON.stringify(editor.getJSON()) as any);
              }}
            />
          </div>

          <div>
            <SubmitButton>Opdatere</SubmitButton>
          </div>
        </Stack>
      </Form>
    </>
  );
}
