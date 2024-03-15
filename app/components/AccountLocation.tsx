import {
  Button,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link} from '@remix-run/react';
import {IconGps, IconHome} from '@tabler/icons-react';
import {type CustomerLocationIsDefault} from '~/lib/api/model';

export type AccountLocationProps = {
  data: CustomerLocationIsDefault;
};

export const AccountLocation = ({data}: AccountLocationProps) => {
  const buttons = (
    <Flex gap="sm">
      <Button component={Link} to={`${data._id}/edit`}>
        Rediger
      </Button>

      <Form
        method="post"
        action={`${data._id}/destroy`}
        style={{display: 'inline-block'}}
      >
        <Button variant="light" color="blue" fullWidth size="xs" type="submit">
          Slet
        </Button>
      </Form>
    </Flex>
  );

  if (data.locationType === 'destination') {
    return (
      <Group align="flex-start">
        <IconGps />
        <Stack>
          <div>
            <Title order={3}>{data.name}</Title>
            <Text c="dimmed">{data.fullAddress}</Text>
          </div>
          <SimpleGrid cols={2}>
            <div>
              <Text size="sm">Udgifter</Text>
              <Text fw={600} size="sm">
                {data.startFee} DKK
              </Text>
            </div>
            <div>
              <Text size="sm">Timepris for kørsel</Text>
              <Text fw={600} size="sm">
                {data.distanceHourlyRate} DKK
              </Text>
            </div>
            <div>
              <Text size="sm">Pris pr. kilometer:</Text>
              <Text fw={600} size="sm">
                {data.fixedRatePerKm} DKK
              </Text>
            </div>
            <div>
              <Text size="sm">Gratis. kilometer:</Text>
              <Text fw={600} size="sm">
                {data.distanceForFree} km
              </Text>
            </div>
            <div>
              <Text size="sm">Min. kilometer:</Text>
              <Text fw={600} size="sm">
                {data.minDriveDistance} km
              </Text>
            </div>
            <div>
              <Text size="sm">Max. kilometer:</Text>
              <Text fw={600} size="sm">
                {data.maxDriveDistance} km
              </Text>
            </div>
          </SimpleGrid>

          {buttons}
        </Stack>
      </Group>
    );
  }
  return (
    <Group align="flex-start">
      <IconHome />
      <Stack gap="xs" style={{flex: 1}}>
        <div>
          <Title order={3}>{data.name}</Title>
          <Text c="dimmed">{data.fullAddress}</Text>
        </div>
        <SimpleGrid cols={2}>
          <div>
            <Text size="sm">Vis kort</Text>
            <Text fw={600} size="sm">
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
            </Text>
          </div>
        </SimpleGrid>

        {buttons}
      </Stack>
    </Group>
  );
};
