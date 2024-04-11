import {Alert, Button, FileInput, Stack, rem} from '@mantine/core';
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {IconFileCv, IconInfoCircle} from '@tabler/icons-react';
import {useEffect, useRef, useState} from 'react';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';

/**
 * Image Upload and Processing Workflow:
 * 1. Request an upload URL from Shopify using the UPLOAD_CREATE query.
 * 2. User selects an image and submits it to the URL provided by Shopify.
 * 3. On submission, the image is uploaded to Shopify, and a resource URL is received.
 * 4. The resource URL is sent to the booking-api.
 * 5. We processes the image, and the application updates the user's image with the new one.
 * 6. Throughout this process, the application maintains the same image display.
 */

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const resourceUrl = formData.get('url') as string;

  await getBookingShopifyApi().upload({
    customerId,
    resourceUrl,
  });

  return redirectWithNotification(context, {
    redirectUrl: `${params.locale || ''}/account/upload`,
    title: 'Billed uploaded',
    message: 'Der kan gå få sekunder inden dit billed bliver opdateret!',
  });
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {payload} = await getBookingShopifyApi().customerUploadResourceURL(
    customerId,
  );

  return json(payload);
}

export default function AccountUpload() {
  const loaderData = useLoaderData<typeof loader>();
  const [formState, setFormState] = useState<string>('idle');
  const submit = useSubmit();
  const navigation = useNavigation();
  const [file, setFile] = useState<File>();
  const formRef = useRef<HTMLFormElement>(null);

  const [searchParams] = useSearchParams();
  const imageUploaded = searchParams.has('success');

  useEffect(() => {
    if (navigation.state === 'idle' && formRef.current) {
      setFormState('idle');
      formRef.current.reset();
    }
  }, [navigation.state]);

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setFormState('submitting');
    event.preventDefault();
    const formData = new FormData();
    loaderData.parameters.forEach(({name, value}) => {
      formData.append(name, value);
    });

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await fetch(loaderData.url, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const body = await response.text();
      const locationRegex = /<Location>(.*?)<\/Location>/s;
      const match = body.match(locationRegex);
      if (match && match[1]) {
        submit({url: match[1]}, {method: 'POST', replace: true});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AccountTitle heading="Skift billed" />

      <AccountContent>
        {imageUploaded ? (
          <Alert
            variant="light"
            color="lime"
            title="Din profil billed er nu uploaded!"
            icon={<IconInfoCircle />}
          >
            Vi har modtaget dit billed, der går lidt tid før du ser dit billed
            opdateret.
          </Alert>
        ) : (
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <Stack gap="md">
              <FileInput
                accept="image/png,image/jpeg"
                leftSection={
                  <IconFileCv
                    style={{width: rem(18), height: rem(18)}}
                    stroke={1.5}
                  />
                }
                name="file"
                onChange={handleFileChange}
                label="Vælge billed"
                placeholder="Dit billed"
                leftSectionPointerEvents="none"
              />

              <Button
                type="submit"
                loading={formState === 'submitting'}
                disabled={!file?.name}
              >
                {formState === 'submitting' ? 'Uploader...' : 'Skift billed'}
              </Button>
            </Stack>
          </form>
        )}
      </AccountContent>
    </>
  );
}
