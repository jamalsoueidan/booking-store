import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {
  Container,
  Progress,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {Form, useActionData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';

import {parseWithZod} from '@conform-to/zod';
import {useTranslation} from 'react-i18next';
import {MultiTags} from '~/components/form/MultiTags';
import {useProfessionAndSkills} from '~/components/ProfessionButton';
import {TextEditor} from '~/components/richtext/TextEditor';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {convertHTML} from '~/lib/convertHTML';
import {getCustomer} from '~/lib/get-customer';
import {updateCustomerTag} from '~/lib/updateTag';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';
import {BottomSection, WrapSection} from './account.business';

const schema = customerUpdateBody.pick({
  shortDescription: true,
  aboutMe: true,
  professions: true,
  specialties: true,
});

export async function action({request, context}: ActionFunctionArgs) {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const {data, errors} = await context.customerAccount.query(
      CUSTOMER_DETAILS_QUERY,
    );

    if (errors?.length || !data?.customer) {
      throw new Error('Customer not found');
    }

    await getBookingShopifyApi().customerUpdate(customerId, {
      ...submission.value,
      aboutMeHtml: convertHTML(submission.value.aboutMe),
    });

    await updateCustomerTag({
      env: context.env,
      customerId: parseGid(data.customer.id).id,
      tags: 'business-step1, business-step2, business-step3, business-step4, business-step5, business',
    });

    return redirect('/account/business/done');
  } catch (error) {
    return submission.reply();
  }
}

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (data.customer.tags.includes('business-step5')) {
    return redirect('/account/business/done');
  }

  return json(null);
}

export default function AccountBusiness() {
  const lastResult = useActionData<typeof action>();
  const {t} = useTranslation(['account', 'global']);
  const {professionOptions, skillsOptions} = useProfessionAndSkills();

  const [form, {shortDescription, aboutMe, professions, specialties}] = useForm(
    {
      lastResult,
      defaultValue: {
        aboutMe: '',
        professions: [],
        specialties: [],
        shortDescription: '',
      },
      onValidate({formData}) {
        return parseWithZod(formData, {
          schema,
        });
      },
      shouldValidate: 'onSubmit',
      shouldRevalidate: 'onSubmit',
    },
  );

  const control = useInputControl(aboutMe);

  return (
    <WrapSection>
      <Progress value={90} size="sm" />
      <FormProvider context={form.context}>
        <Form method="post" {...getFormProps(form)}>
          <Container size="md" py={{base: 'sm', md: rem(60)}}>
            <Stack mb="lg">
              <div>
                <Text c="dimmed" tt="uppercase" fz="sm">
                  {t('account:business.step', {step: 5})}
                </Text>
                <Title fw="600" fz={{base: 'h2', sm: undefined}}>
                  {t('account:business.profile.title')}
                </Title>
              </div>
              <Text>{t('account:business.profile.description')}</Text>
            </Stack>
            <Stack gap="lg">
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
                label="Skriv kort beskrivelse"
                {...getInputProps(shortDescription, {type: 'text'})}
              />

              <div>
                <Text size="sm" mb={rem(2)} fw={500}>
                  Fortæl om dig selv og din erfaring:
                </Text>
                <TextEditor
                  /*content={
                    aboutMe.value ? (JSON.parse(aboutMe.value) as any) : ''
                  }*/
                  onUpdate={({editor}) => {
                    control.change(JSON.stringify(editor.getJSON()) as any);
                  }}
                />
              </div>
            </Stack>
          </Container>
          <BottomSection>
            <SubmitButton size="md" disabled={!form.valid}>
              {t('account:business.create_business')}
            </SubmitButton>
          </BottomSection>
        </Form>
      </FormProvider>
    </WrapSection>
  );
}
