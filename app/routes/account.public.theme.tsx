import {
  Button,
  Flex,
  Stack,
  ThemeIcon,
  type DefaultMantineColor,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getFormProps, useForm, useInputControl} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {IconCheck} from '@tabler/icons-react';
import {redirectWithSuccess} from 'remix-toast';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerUpdateBody.pick({
  theme: true,
});

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerUpdate(customerId, submission.value);

    return redirectWithSuccess('/account/public/theme', {
      message: 'Tema er opdateret!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {payload: user} = await getBookingShopifyApi().customerGet(customerId);

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
        <Stack gap="xl">
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
            <SubmitButton disabled={!color.dirty}>Gem</SubmitButton>
          </div>
        </Stack>
      </Form>
    </>
  );
}
