import {
  Button,
  Container,
  Divider,
  Flex,
  Modal,
  rem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {
  Form,
  Outlet,
  type ShouldRevalidateFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  IconAdjustmentsHorizontal,
  IconCar,
  IconCheck,
  IconHome,
  IconSearch,
} from '@tabler/icons-react';
import {type FormEvent, useState} from 'react';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {ProfessionButton} from '~/components/ProfessionButton';
import {METAFIELD_QUERY} from '~/data/fragments';
import {useComponents} from '~/lib/use-components';
import {loader as loaderFilter} from './api.users.filters';
import {loader as loaderProfessions} from './api.users.professions';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  const {handle: previousHandle} = currentParams;
  const {handle: nextHandle} = nextParams;
  return nextHandle !== previousHandle;
};

export const loader = async (args: LoaderFunctionArgs) => {
  const {context} = args;

  const filterResponse = await loaderFilter(args);
  const filters = await filterResponse.json();

  const professionsResponse = await loaderProfessions(args);
  const professions = await professionsResponse.json();

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'visual_teaser',
      },
    },
  );

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'components',
      },
    },
  );

  return json(
    {
      components,
      visualTeaser,
      professions,
      filters,
    },
    {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    },
  );
};

export default function Artists() {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const {professions, components, visualTeaser} =
    useLoaderData<typeof loader>();

  const markup = useComponents(
    components?.fields.find(({key}) => key === 'components'),
  );

  return (
    <>
      <VisualTeaser component={visualTeaser} />

      <Container size="xl">
        <Stack gap="xl">
          <ScrollArea
            h="auto"
            type={isMobile ? 'always' : 'never'}
            py={isMobile ? 'md' : undefined}
          >
            <Flex gap={isMobile ? 'sm' : 'lg'} justify="center">
              <ProfessionButton
                profession={{
                  count: 0,
                  profession: 'all',
                  translation: 'Vis alle',
                }}
                reset
              />
              {professions.map((profession) => (
                <ProfessionButton
                  key={profession.profession}
                  profession={profession}
                />
              ))}
            </Flex>
          </ScrollArea>

          <SearchInput />
        </Stack>
      </Container>
      <Outlet />

      <Divider />
      {markup}
    </>
  );
}

export const SearchInput = () => {
  const {filters} = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 62em)');

  //modal
  const [opened, {open, close}] = useDisclosure(false);

  //query
  const [searchParams] = useSearchParams();

  //form
  const [search, setSearch] = useState('');
  const [selectedDays, setSelectedDays] = useState<Array<string>>([]);
  const [selectedLocations, setSelectedLocations] = useState<{
    location?: string | null;
    locationType?: string | null;
  }>({
    location: undefined,
    locationType: undefined,
  });

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('keyword');
    if (search.length > 2) {
      newSearchParams.set('keyword', search);
    }

    newSearchParams.delete('location');
    newSearchParams.delete('locationType');
    if (selectedLocations.location && selectedLocations.locationType) {
      newSearchParams.set('location', selectedLocations.location);
      newSearchParams.set('locationType', selectedLocations.locationType);
    }

    newSearchParams.delete('days');
    if (selectedDays.length > 0) {
      selectedDays.forEach((d) => newSearchParams.append('days', d));
    }

    close();
    navigate(`/artists/search?${newSearchParams.toString()}`);
  };

  const reset = () => {
    setSearch(searchParams.get('search') || '');
    setSelectedDays([]);
    setSelectedLocations({
      location: null,
      locationType: null,
    });
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('keyword');
    newSearchParams.delete('days');
    newSearchParams.delete('location');
    newSearchParams.delete('locationType');
    close();
    navigate(`/artists/search?${newSearchParams.toString()}`);
  };

  const openModal = () => {
    setSearch('');
    setSelectedDays(searchParams.getAll('days') || []);
    setSelectedLocations({
      location: searchParams.get('location'),
      locationType: searchParams.get('locationType'),
    });
    open();
  };

  return (
    <>
      <Flex justify="center">
        <Button
          radius="xl"
          size="lg"
          color="orange"
          variant="outline"
          onClick={openModal}
          rightSection={
            <IconAdjustmentsHorizontal
              style={{width: rem(24), height: rem(24)}}
              stroke={1.5}
            />
          }
        >
          Filtre resultat
        </Button>
      </Flex>

      <Modal.Root
        opened={opened}
        onClose={close}
        fullScreen={isMobile}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit} style={{maxWidth: 'unset'}}>
              <Stack gap="xl">
                <Stack gap="xs">
                  <Text fw="bold">Filtre på navn/fuldnavn?</Text>
                  <TextInput
                    data-autofocus
                    radius="xl"
                    size="md"
                    w="100%"
                    rightSectionWidth={42}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    leftSection={
                      <IconSearch
                        style={{width: rem(18), height: rem(18)}}
                        stroke={1.5}
                      />
                    }
                  />
                </Stack>

                <Stack gap="xs">
                  <Text fw="bold">Filtre på by?</Text>
                  <Flex direction="row" gap="xs" wrap="wrap">
                    {filters.locations.map(({city, locationType}) => {
                      const checked =
                        selectedLocations.location === city &&
                        selectedLocations.locationType === locationType;

                      return (
                        <Button
                          variant={checked ? 'outline' : 'default'}
                          radius="xl"
                          color={checked ? 'green' : undefined}
                          key={city + locationType}
                          onClick={() => {
                            setSelectedLocations({
                              location: city,
                              locationType,
                            });
                          }}
                          rightSection={
                            locationType === 'DESTINATION' ? (
                              <IconCar />
                            ) : (
                              <IconHome />
                            )
                          }
                          leftSection={checked ? <IconCheck /> : null}
                        >
                          {city}
                        </Button>
                      );
                    })}
                  </Flex>
                </Stack>
                <Stack gap="xs">
                  <Text fw="bold">Filtre arbejdsdage?</Text>
                  <Flex direction="row" gap="xs" wrap="wrap">
                    {filters.availableDays.map(({day, translation}) => {
                      const checked = selectedDays.includes(day);

                      return (
                        <Button
                          variant={checked ? 'outline' : 'default'}
                          radius="xl"
                          color={checked ? 'green' : undefined}
                          key={day}
                          onClick={() => {
                            if (selectedDays.includes(day)) {
                              setSelectedDays(
                                selectedDays.filter((d) => d !== day),
                              );
                            } else {
                              setSelectedDays(selectedDays.concat(day));
                            }
                          }}
                          leftSection={
                            checked ? <IconCheck color="green" /> : null
                          }
                        >
                          {translation}
                        </Button>
                      );
                    })}
                  </Flex>
                </Stack>
                <Flex justify="center" gap="lg">
                  <Button type="submit">Søg på filter</Button>
                  <Button onClick={reset} variant="default">
                    Nulstille
                  </Button>
                </Flex>
              </Stack>
            </Form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
