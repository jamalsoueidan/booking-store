import {
  Button,
  Flex,
  Stack,
  ThemeIcon,
  type DefaultMantineColor,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getFormProps, useForm, useInputControl} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {IconCheck} from '@tabler/icons-react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerUpdateBody.pick({
  theme: true,
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
      redirectUrl: `/account/public/theme`,
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

export default function AccountPublicTheme() {
  const lastResult = useActionData<typeof action>();
  const {user} = useLoaderData<typeof loader>();

  const [form, {theme}] = useForm({
    lastResult,
    defaultValue: user,
  });

  const {color} = theme.getFieldset();
  const control = useInputControl(color);

  const options: DefaultMantineColor[] = [
    'gray',
    'red',
    'pink',
    'grape',
    'violet',
    'indigo',
    'blue',
    'cyan',
    'green',
    'lime',
    'yellow',
    'orange',
    'teal',
  ];

  return (
    <>
      <Form method="POST" {...getFormProps(form)}>
        <Stack gap="md">
          <Flex wrap="wrap" gap="sm">
            {options.map((value) => (
              <Button
                key={value}
                variant="filled"
                color={`${value}.6`}
                onClick={() => control.change(value)}
                radius="xl"
                rightSection={
                  color.value === value ? (
                    <ThemeIcon color={`${value}.1`} radius="100%">
                      <IconCheck style={{width: '70%', height: '70%'}} />
                    </ThemeIcon>
                  ) : null
                }
              >
                {value}
              </Button>
            ))}
          </Flex>

          <div>
            <SubmitButton>Opdatere</SubmitButton>
          </div>
        </Stack>
      </Form>
    </>
  );
}