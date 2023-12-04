import {Button, Group, Modal, Stack, Text, TextInput} from '@mantine/core';
import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {type CustomerLocation, type Shipping} from '~/lib/api/model';

type LocationModalProps = {
  location?: CustomerLocation;
  onCancel: () => void;
  onAccept: (shippingId: string) => void;
  opened: boolean;
};

export function LocationModal({
  location,
  onCancel,
  onAccept,
  opened,
}: LocationModalProps) {
  const [view, setView] = useState('init');

  const calculateShippingFetcher = useFetcher<Shipping>();
  const createShippingFetcher = useFetcher<Shipping>();

  const back = () => {
    setView('init');
  };

  useEffect(() => {
    if (calculateShippingFetcher.data && opened) {
      setView('accept');
    }
  }, [calculateShippingFetcher.data, opened]);

  useEffect(() => {
    // don't remove opened, or else it will keep throwing onAccept!
    if (createShippingFetcher.data && opened) {
      onAccept(createShippingFetcher.data._id);
    }
  }, [createShippingFetcher, onAccept, opened]);

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
      title="Lokation"
    >
      {view === 'init' ? (
        <calculateShippingFetcher.Form
          method="post"
          action="/api/shipping-calculate"
        >
          <Stack gap="lg">
            <Text size="sm">
              Vi skal bruge mere information om, hvor Skønhedseksperten skal
              køre hen, for at kunne estimere udgifterne ved at komme til dig.
            </Text>

            <input
              type="hidden"
              name="customerId"
              value={location?.customerId}
            />
            <input type="hidden" name="locationId" value={location?._id} />

            <TextInput label="Navn (hotel):" name="destination.name" />

            <AddressAutocompleteInput
              label="Hvor skal der køresr til?"
              placeholder="Sigridsvej 45, 8220 Brabrand"
              name="destination.fullAddress"
            />

            <Group justify="flex-end">
              <Button
                type="submit"
                loading={calculateShippingFetcher.state === 'loading'}
              >
                Næste
              </Button>
            </Group>
          </Stack>
        </calculateShippingFetcher.Form>
      ) : (
        <createShippingFetcher.Form method="post" action="/api/shipping-create">
          <input type="hidden" name="customerId" value={location?.customerId} />
          <input type="hidden" name="locationId" value={location?._id} />
          <input
            type="hidden"
            name="destination.name"
            value={calculateShippingFetcher?.data?.destination.name}
          />
          <input
            type="hidden"
            name="destination.fullAddress"
            value={calculateShippingFetcher?.data?.destination.fullAddress}
          />
          <Stack gap="lg">
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Omkostninger
              </Text>
              <Text fz="lg" fw={500}>
                {calculateShippingFetcher?.data?.cost.value}{' '}
                {calculateShippingFetcher?.data?.cost.currency}
              </Text>
            </div>
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Afstand
              </Text>
              <Text fz="lg" fw={500}>
                {calculateShippingFetcher?.data?.distance.text}
              </Text>
            </div>
            <div>
              <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                Tid
              </Text>
              <Text fz="lg" fw={500}>
                {calculateShippingFetcher?.data?.duration.text}
              </Text>
            </div>
            <Group justify="space-between">
              <Button onClick={onCancel}>Luk</Button>
              <Group justify="flex-end">
                <Button onClick={back}>Tilbage</Button>
                <Button type="submit">Acceptere</Button>
              </Group>
            </Group>
          </Stack>
        </createShippingFetcher.Form>
      )}
    </Modal>
  );
}
