import {parseWithZod} from '@conform-to/zod';
import {
  Container,
  Flex,
  InputBase,
  Radio,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {redirect, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';

import {
  getCollectionProps,
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {Form, useActionData} from '@remix-run/react';

import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {CustomerPayoutAccountType} from '~/lib/api/model';
import {customerPayoutAccountCreateBody} from '~/lib/zod/bookingShopifyApi';
import {isMobilePay} from './business.payouts';

const schema = customerPayoutAccountCreateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const values = submission.value;
    await getBookingShopifyApi().customerPayoutAccountCreate(
      customerId,
      isMobilePay(values.payoutDetails)
        ? {
            ...values,
            payoutDetails: {
              phoneNumber: parseInt(
                values.payoutDetails.phoneNumber
                  .toString()
                  .replace(/\D/g, '')
                  .slice(2),
                10,
              ),
            },
          }
        : {
            ...values,
            payoutDetails: {
              ...values.payoutDetails,
              accountNum: parseInt(
                values.payoutDetails.accountNum.toString().replace(/-/g, ''),
              ),
            },
          },
    );

    return redirect(`/business/payouts`);
  } catch (error) {
    return submission.reply();
  }
};

export default function AccountPayoutsSettings() {
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue: {
      payoutType: CustomerPayoutAccountType.MOBILE_PAY,
    },
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const payoutType = useInputControl(fields.payoutType);

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="../" heading="Opret overførsel metode" />

      <AccountContent>
        <Form method="POST" {...getFormProps(form)}>
          <Stack align="flex-start">
            <div>
              <Title order={3}>Bank konto</Title>
              <Text c="dimmed">
                Vi skal bruge din regnr og kontonummer for at sende dig din
                udbetalinger.
              </Text>
            </div>

            <Radio.Group
              label="Hvilken type"
              value={payoutType.value}
              onFocus={payoutType.focus}
              onChange={payoutType.change}
              onBlur={payoutType.blur}
            >
              {getCollectionProps(fields.payoutType, {
                type: 'radio',
                options: [
                  CustomerPayoutAccountType.BANK_ACCOUNT,
                  CustomerPayoutAccountType.MOBILE_PAY,
                ],
              }).map((props) => (
                <Radio
                  key={props.key}
                  value={props.value}
                  label={props.value}
                />
              ))}
            </Radio.Group>

            {payoutType.value === CustomerPayoutAccountType.BANK_ACCOUNT ? (
              <>
                <TextInput
                  label="Fuldnavn"
                  {...getInputProps(
                    fields.payoutDetails.getFieldset().bankName,
                    {
                      type: 'text',
                    },
                  )}
                />
                <Flex gap="lg">
                  <InputBase
                    label="Regnr"
                    w="80"
                    {...getInputProps(
                      fields.payoutDetails.getFieldset().regNum,
                      {
                        type: 'text',
                      },
                    )}
                  />
                  <InputBase
                    label="Kontonummer"
                    {...getInputProps(
                      fields.payoutDetails.getFieldset().bankName,
                      {
                        type: 'text',
                      },
                    )}
                  />
                </Flex>
              </>
            ) : (
              <InputBase
                label="Mobilnummer"
                {...getInputProps(
                  fields.payoutDetails.getFieldset().phoneNumber,
                  {
                    type: 'text',
                  },
                )}
              />
            )}

            <SubmitButton>Gem</SubmitButton>
          </Stack>
        </Form>
      </AccountContent>
    </Container>
  );
}
