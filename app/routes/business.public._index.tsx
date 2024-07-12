import {Stack, Text, TextInput, rem} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';

import {useTranslation} from 'react-i18next';
import {MultiTags} from '~/components/form/MultiTags';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {useProfessionAndSkills} from '~/components/ProfessionButton';
import {TextEditor} from '~/components/richtext/TextEditor';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {convertHTML} from '~/lib/convertHTML';
import {getCustomer} from '~/lib/get-customer';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerUpdateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerUpdate(customerId, {
      ...submission.value,
      aboutMeHtml: convertHTML(submission.value.aboutMe),
    });

    return redirect('/business/public');
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {payload: user} = await getBookingShopifyApi().customerGet(customerId);

  return json({user});
}

export default function AccountBusiness() {
  const {t} = useTranslation(['global']);
  const lastResult = useActionData<typeof action>();
  const {professionOptions, skillsOptions} = useProfessionAndSkills();
  const {user} = useLoaderData<typeof loader>();

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
    },
  ] = useForm({
    lastResult,
    defaultValue: user,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onSubmit',
  });

  const control = useInputControl(aboutMe);

  return (
    <FormProvider context={form.context}>
      <Form method="POST" {...getFormProps(form)}>
        <Stack gap="md">
          <TextInput
            label="Vælge en profilnavn"
            disabled
            defaultValue={user.username}
          />

          <RadioGroup
            label="Hvad er dit køn?"
            field={gender}
            data={[
              {value: 'woman', label: 'Kvinde'},
              {value: 'man', label: 'Mand'},
            ]}
          />

          <MultiTags
            field={speaks}
            data={[
              {label: t('global:danish'), value: 'danish'},
              {label: t('global:english'), value: 'english'},
              {label: t('global:arabic'), value: 'arabic'},
            ]}
            label="Hvilken sprog taler du"
            placeholder="Vælge sprog"
          />

          <TextInput
            label="Skriv kort beskrivelse"
            {...getInputProps(shortDescription, {type: 'text'})}
          />

          <div>
            <Text size="sm" mb={rem(2)} fw={500}>
              Fortæl om dig selv og din erfaring:
            </Text>
            <TextEditor
              content={
                user.aboutMeHtml ? (JSON.parse(user.aboutMe) as any) : ''
              }
              onUpdate={({editor}) => {
                control.change(JSON.stringify(editor.getJSON()) as any);
              }}
            />
          </div>

          <MultiTags
            field={professions}
            data={professionOptions}
            label="Hvad er dine professioner"
            placeholder="Vælg professioner"
          />

          <MultiTags
            field={specialties}
            data={skillsOptions}
            label="Hvad er dine specialer?"
            placeholder="Vælge special(er)?"
          />

          <TextInput
            label="Års erfaring"
            {...getInputProps(yearsExperience, {type: 'number'})}
          />

          <div>
            <SubmitButton>Gem ændringer</SubmitButton>
          </div>
        </Stack>
      </Form>
    </FormProvider>
  );
}
