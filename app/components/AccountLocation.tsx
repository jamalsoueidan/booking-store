import {Stack, UnstyledButton} from '@mantine/core';
import {Form} from '@remix-run/react';
import {type CustomerLocationIsDefault} from '~/lib/api/model';

export type AccountLocationProps = {
  data: CustomerLocationIsDefault;
};

export const AccountLocation = ({data}: AccountLocationProps) => {
  const defaultMarkup = !data.isDefault ? (
    <Form
      method="post"
      action={`${data._id}/set-default`}
      className="!mt-0 inline-block"
    >
      Nej{' '}
      <UnstyledButton
        type="submit"
        variant="subtle"
        style={{textDocoration: 'underline'}}
      >
        (Set standard)
      </UnstyledButton>
    </Form>
  ) : (
    <>Ja</>
  );

  if (data.locationType === 'destination') {
    return (
      <Stack>
        <span>
          <strong>Navn:</strong> {data.name}
        </span>
        <span>
          <strong>Udgifter:</strong> {data.startFee} DKK
        </span>
        <span>
          <strong>Timepris for kørsel:</strong> {data.distanceHourlyRate} DKK
        </span>
        <span>
          <strong>Pris pr. kilometer:</strong> {data.fixedRatePerKm} DKK
        </span>
        <span>
          <strong>Gratis. kilometer:</strong> {data.distanceForFree} km
        </span>
        <span>
          <strong>Min. kilometer:</strong> {data.minDriveDistance} km
        </span>
        <span>
          <strong>Max. kilometer:</strong> {data.maxDriveDistance} km
        </span>
        <span>
          <strong>Standard: </strong> {defaultMarkup}
        </span>
      </Stack>
    );
  }
  return (
    <Stack>
      <span>
        <strong>Navn:</strong> {data.name}
      </span>
      <span>
        <strong>Adresse:</strong> {data.fullAddress}
      </span>
      <span>
        <strong>Vis kort:</strong>{' '}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${data.geoLocation.coordinates
            .reverse()
            .join(',')}`}
          target="_blank"
          className="!m-0"
          rel="noreferrer"
        >
          Åben vindue
        </a>
      </span>
      <span>
        <strong>Type:</strong>{' '}
        {data.originType === 'commercial' ? 'Butik' : 'Hjemmefra'}
      </span>
      <span>
        <strong>Standard: </strong> {defaultMarkup}
      </span>
    </Stack>
  );
};
