import {Title} from '@mantine/core';
import {useActionData, useLoaderData} from '@remix-run/react';
import {withZod} from '@remix-validated-form/with-zod';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {ValidatedForm, validationError} from 'remix-validated-form';
import {MultiTags} from '~/components/form/MultiTags';

import {SubmitButton} from '~/components/form/SubmitButton';
import {TextField} from '~/components/form/TextField';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerUpsertBody} from '~/lib/zod/bookingShopifyApi';

export interface ActionData {
  success?: boolean;
  formError?: string;
}

const badRequest = (data: ActionData) => json(data, {status: 400});

export const validator = withZod(customerUpsertBody);

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerAccessToken = await context.session.get('customerAccessToken');

  const customer = await getCustomer({context, customerAccessToken});

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  await getBookingShopifyApi().customerUpsert(
    parseGid(customer.id).id,
    result.data as any,
  );

  try {
    return json({error: null});
  } catch (error: any) {
    return badRequest({formError: error.message});
  }
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
  const actionData = useActionData<ActionData>();
  const {user, professionOptions, specialityOptions} =
    useLoaderData<typeof loader>();

  return (
    <>
      <Title>Redigere din profil</Title>

      <ValidatedForm
        validator={validator}
        method="post"
        defaultValues={user as any}
      >
        {actionData?.formError && (
          <div className="flex items-center justify-center mb-6 bg-red-100 rounded">
            <p className="m-4 text-sm text-red-900">{actionData.formError}</p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="max-w-md">
            <MultiTags
              name="professions"
              label="Hvad er din stilling(er)?"
              placeholder="Vælge stilling(er)?"
              options={professionOptions}
            />
          </div>

          <div className="max-w-md">
            <MultiTags
              options={specialityOptions}
              name="specialties"
              label="Hvad er dine specialer?"
              placeholder="Vælge special(er)?"
            />
          </div>

          <TextField name="username" label="Vælge en profilnavn" />
          <TextField name="shortDescription" label="Skriv kort beskrivelse" />
          <label htmlFor="aboutMe">
            Skriv lidt om dig selv
            <br />
            <textarea
              name="aboutMe"
              id="aboutMe"
              cols={50}
              rows={5}
              className="bg-transparent px-0 py-2 focus:ring-0 transition border-1 border-primary/10 focus:border-primary/90"
              placeholder="Skriv lidt om dig selv"
              defaultValue={user.aboutMe}
            ></textarea>
          </label>
        </div>
        <div className="mt-6">
          <SubmitButton />
        </div>
      </ValidatedForm>
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
