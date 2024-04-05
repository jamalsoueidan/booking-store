import {
  ActionIcon,
  Container,
  Divider,
  Flex,
  rem,
  ScrollArea,
  Stack,
  TextInput,
} from '@mantine/core';
import {
  Form,
  Outlet,
  type ShouldRevalidateFunction,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconArrowRight, IconFilter, IconSearch} from '@tabler/icons-react';
import {FormEvent, useState} from 'react';
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
  const {specialties} = await filterResponse.json();

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

  return json({components, visualTeaser, professions, specialties});
};

export default function Artists() {
  const {professions, specialties, components, visualTeaser} =
    useLoaderData<typeof loader>();

  const params = useParams();
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('keyword', searchQuery);
    navigate(`/artists/search?${newSearchParams.toString()}`);
  };

  return (
    <Form onSubmit={handleSubmit} style={{maxWidth: 'unset'}}>
      <Flex justify="center" gap="lg" align="center">
        <TextInput
          radius="xl"
          size="md"
          placeholder="Søg på eksperter"
          rightSectionWidth={78}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftSection={
            <IconSearch
              style={{width: rem(18), height: rem(18)}}
              stroke={1.5}
            />
          }
          rightSection={
            <Flex gap="5px">
              <ActionIcon
                size={32}
                radius="xl"
                color="orange"
                variant="filled"
                type="submit"
              >
                <IconArrowRight
                  style={{width: rem(18), height: rem(18)}}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon size={32} radius="xl" color="orange" variant="filled">
                <IconFilter
                  style={{width: rem(18), height: rem(18)}}
                  stroke={1.5}
                />
              </ActionIcon>
            </Flex>
          }
        />
      </Flex>
    </Form>
  );
};
