import {
  Alert,
  Button,
  Divider,
  FileInput,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {IconFileCv, IconInfoCircle} from '@tabler/icons-react';
import {useEffect, useRef, useState} from 'react';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';

/**
 * Image Upload and Processing Workflow:
 * 1. Request an upload URL from Shopify using the UPLOAD_CREATE query.
 * 2. User selects an image and submits it to the URL provided by Shopify.
 * 3. On submission, the image is uploaded to Shopify, and a resource URL is received.
 * 4. The resource URL is sent to the Remix action for further processing with Shopify.
 * 5. Shopify processes the image, and the application updates the user's image with the new one.
 * 6. Throughout this process, the application maintains the same image display.
 */

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  // Process form data and extract resource URL
  const formData = await request.formData();
  const resourceUrl = formData.get('url') as string;

  // Extract file name from the resource URL
  const url = new URL(resourceUrl);
  const pathSegments = url.pathname.split('/');
  const fileName = pathSegments.pop();

  // Query Shopify to create a file record
  await context.adminApi.query({
    data: {
      query: FILE_CREATE,
      variables: {
        files: {
          alt: fileName,
          contentType: 'IMAGE',
          originalSource: resourceUrl,
        },
      },
    },
  });

  const fileGet = await context.adminApi.query({
    data: {
      query: FILE_GET,
      variables: {
        query: fileName,
      },
    },
  });

  const pipeDreamFormData = new FormData();
  pipeDreamFormData.append('customerId', parseGid(customer.id).id);
  pipeDreamFormData.append('filename', fileName || '');

  /*await fetch('http://eogzehsi2ua26f1.m.pipedream.net', {
    method: 'POST',
    body: pipeDreamFormData,
    headers: {
      Accept: 'application/json',
    },
  });*/

  await getBookingShopifyApi().customerUpsert(parseGid(customer.id).id, {
    images: {
      profile: {
        url: resourceUrl,
      },
    },
  } as any);

  return redirectWithNotification(context, {
    redirectUrl: `${params.locale || ''}/account/upload`,
    title: 'Billed uploaded',
    message: 'tester',
  });
};

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  // Query Shopify to create a staged upload
  const {body} = (await context.adminApi.query({
    data: {
      query: UPLOAD_CREATE,
      variables: {
        input: [
          {
            resource: 'IMAGE',
            filename: `${
              customer.id
            }_customer_profile_${new Date().getTime()}.jpg`,
            mimeType: 'image/jpeg',
            httpMethod: 'POST',
          },
        ],
      },
    },
  })) as UploadMutationResponse;

  // Return the staged upload details
  return json(body.data.stagedUploadsCreate.stagedTargets[0]);
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
      <Title>Skift billed</Title>
      <Divider my="md" />

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

            <Button type="submit" disabled={formState === 'submitting'}>
              {formState === 'submitting' ? 'Uploader...' : 'Skift billed'}
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
}

const UPLOAD_CREATE = `#graphql
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        resourceUrl
        url
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

const FILE_CREATE = `#graphql
  mutation fileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        fileStatus
        alt
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

const FILE_GET = `#graphql
  query FileGet($query: String!) {
    files(first: 10, sortKey: UPDATED_AT, reverse: true, query: $query) {
      nodes {
        preview {
          image {
            url
            width
            height
          }
        }
      }
    }
  }
` as const;

type UploadMutationResponse = {
  body: {
    data: {
      stagedUploadsCreate: {
        stagedTargets: Array<{
          resourceUrl: string;
          url: string;
          parameters: Array<{
            name: string;
            value: string;
          }>;
        }>;
        userErrors: Array<any>;
      };
    };
    extensions: {
      cost: {
        requestedQueryCost: number;
        actualQueryCost: number;
        throttleStatus: {
          maximumAvailable: number;
          currentlyAvailable: number;
          restoreRate: number;
        };
      };
    };
  };
};

/*
mutation {
  customerUpdate(input: {
    id: "gid://shopify/Customer/7106990342471",
    metafields: [{
      id: "gid://shopify/Metafield/39523247849799",
      namespace: "api",
      key: "active",
      value: "false",
      type: "boolean",
    }]
  }) {
    customer {
      id
      metafields(first: 10, namespace: "api") {
        edges {
          node {
            id
            namespace
            key
            value
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
*/
