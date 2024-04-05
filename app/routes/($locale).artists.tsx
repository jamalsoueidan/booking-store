import {
  ActionIcon,
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
  IconArrowRight,
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
import {loader as loaderFilter} from './($locale).api.users.filters';
import {loader as loaderProfessions} from './($locale).api.users.professions';

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

  return json({
    components,
    visualTeaser,
    professions,
    filters,
  });
};

export default function Artists() {
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
          <ScrollArea h="auto" type="never">
            <Flex gap="lg" justify="center">
              <ProfessionButton
                profession={{
                  count: 0,
                  profession: 'all',
                  translation: 'Alle eksperter',
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
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const isMobile = useMediaQuery('(max-width: 62em)');

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('keyword', searchQuery);
    navigate(`/artists/search?${newSearchParams.toString()}`);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} style={{maxWidth: 'unset'}}>
        <Flex justify="center" gap="lg" align="center">
          <TextInput
            radius="xl"
            size="md"
            placeholder="Søg på eksperter"
            rightSectionWidth={42}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={
              <IconSearch
                style={{width: rem(18), height: rem(18)}}
                stroke={1.5}
              />
            }
            rightSection={
              <ActionIcon
                size={32}
                radius="xl"
                color="orange"
                variant="outline"
                type="submit"
              >
                <IconArrowRight
                  style={{width: rem(18), height: rem(18)}}
                  stroke={1.5}
                />
              </ActionIcon>
            }
          />
          <Flex gap="5px">
            <Button
              radius="xl"
              color="orange"
              variant="outline"
              onClick={open}
              rightSection={
                <IconAdjustmentsHorizontal
                  style={{width: rem(18), height: rem(18)}}
                  stroke={1.5}
                />
              }
            >
              Filtre resultat
            </Button>
          </Flex>
        </Flex>
      </Form>

      <Modal.Root opened={opened} onClose={close} fullScreen={isMobile}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Body>
            <Stack gap="xl">
              <Stack gap="xs">
                <Text fw="bold">Filtre på by?</Text>
                <Flex direction="row" gap="xs" wrap="wrap">
                  {filters.locations.map(({city, count, locationType}) => {
                    const checked =
                      searchParams.get('location') === city &&
                      searchParams.get('locationType') === locationType;

                    return (
                      <Button
                        variant={checked ? 'outline' : 'default'}
                        radius="xl"
                        color={checked ? 'green' : undefined}
                        key={city + locationType}
                        onClick={() => {
                          const newSearchParams = new URLSearchParams(
                            searchParams.toString(),
                          );
                          newSearchParams.set('location', city);
                          newSearchParams.set('locationType', locationType);
                          setSearchParams(newSearchParams);
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
                  {filters.availableDays.map((day) => {
                    const checked = searchParams
                      .getAll('days')
                      .includes(day.day);

                    return (
                      <Button
                        variant={checked ? 'outline' : 'default'}
                        radius="xl"
                        color={checked ? 'green' : undefined}
                        key={day.day}
                        onClick={() => {
                          const currentDays = searchParams.getAll('days');
                          const newSearchParams = new URLSearchParams(
                            searchParams.toString(),
                          );

                          if (currentDays.includes(day.day)) {
                            const filteredDays = currentDays.filter(
                              (d) => d !== day.day,
                            );
                            newSearchParams.delete('days');
                            filteredDays.forEach((d) =>
                              newSearchParams.append('days', d),
                            );
                          } else {
                            newSearchParams.append('days', day.day);
                          }
                          setSearchParams(newSearchParams);
                        }}
                        /*rightSection={
                          <Badge variant="filled" color="gray.4">
                            {day.count}
                          </Badge>
                        }*/
                        leftSection={
                          checked ? <IconCheck color="green" /> : null
                        }
                      >
                        {day.translation}
                      </Button>
                    );
                  })}
                </Flex>
              </Stack>
              <Flex justify="center">
                <Button onClick={close}>Luk vindue</Button>
              </Flex>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};
