import {
  Box,
  Button,
  Container,
  Flex,
  getGradient,
  rem,
  ScrollArea,
  SimpleGrid,
  Stack,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import Autoplay from 'embla-carousel-autoplay';

import {IconArrowRight, IconMoodWink, IconSearch} from '@tabler/icons-react';
import {METAFIELD_QUERY} from '~/data/fragments';

import {Carousel} from '@mantine/carousel';
import {useMediaQuery} from '@mantine/hooks';
import {useRef} from 'react';
import type {
  PageComponentMetaobjectFragment,
  PageFragment,
  TreatmentCollectionFragment,
  UserFragment,
} from 'storefrontapi.generated';
import {ArtistCard} from '~/components/ArtistCard';
import {useField} from '~/components/blocks/utils';
import {ProfessionButton} from '~/components/ProfessionButton';
import {Slider} from '~/components/Slider';
import {H1} from '~/components/titles/H1';
import {H2} from '~/components/titles/H2';
import {TreatmentCard} from '~/components/treatment/TreatmentCard';
import {FrontendTreatments} from '~/graphql/storefront/FrontendTreatments';
import {FrontendUsers} from '~/graphql/storefront/FrontendUsers';
import {useComponents} from '~/lib/use-components';
import {
  loader as loaderProfessions,
  type Profession,
} from './api.users.professions';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction = () => {
  return [
    {
      title:
        'BySisters | Find skønhedseksperter og book deres [behandlinger] direkte på vores platform. Vores platform forbinder dig med talentfulde skønhedseksperter inden for alle aspekter af skønhed.',
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const {context} = args;
  const {storefront} = context;

  const {products: recommendedTreatments} = await storefront.query(
    FrontendTreatments,
    {
      variables: {
        query: 'tag:treatments AND tag:system',
      },
    },
  );

  const professions = await loaderProfessions(args).then((r) => r.json());

  const {metaobjects} = await storefront.query(FrontendUsers);

  const users = metaobjects.nodes.filter(
    (f) => f.fields.find((f) => f.key === 'active')?.value === 'true',
  );

  const components = await context.storefront.query(METAFIELD_QUERY, {
    variables: {
      handle: 'index',
      type: 'components',
    },
  });

  return json(
    {
      recommendedTreatments,
      users,
      components,
      professions,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    },
  );
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Box pt={rem(100)} pb={rem(50)}>
        <Container size="xl">
          <Stack gap="xl">
            <H1 gradients={{from: 'orange', to: 'orange.3'}}>
              Find [skønhedseksperter] og book deres [behandlinger] direkte på
              vores platform
            </H1>
            <Title order={2} c="dimmed" fw="normal" ta="center">
              Vores platform forbinder dig med talentfulde skønhedseksperter
              inden for alle aspekter af skønhed.
            </Title>

            <Flex
              direction={{base: 'column', sm: 'row'}}
              justify="center"
              gap={{base: 'sm', sm: 'xl'}}
            >
              <Button
                variant="outline"
                color="orange"
                component={Link}
                to="/artists"
                size="lg"
                radius="md"
                rightSection={<IconSearch />}
              >
                Find en skønhedsekspert
              </Button>

              <Button
                variant="outline"
                color="#8a60f6"
                component={Link}
                to="/pages/start-din-skoenhedskarriere"
                size="lg"
                radius="md"
                rightSection={<IconMoodWink />}
              >
                Start din skønhedskarriere
              </Button>
            </Flex>
          </Stack>
        </Container>
      </Box>

      <FeaturedArtists users={data.users} professions={data.professions} />
      <RecommendedTreatments products={data.recommendedTreatments.nodes} />
      <DynamicComponents components={data.components.metaobject} />
    </>
  );
}

function DynamicComponents({
  components,
}: {
  components?: PageComponentMetaobjectFragment | null;
}) {
  const field = useField(components);
  const com = field.getField<PageFragment['components']>('components');
  const markup = useComponents(com);
  return <>{markup}</>;
}

function FeaturedArtists({
  users,
  professions,
}: {
  users: UserFragment[];
  professions?: Array<Profession>;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 62em)');
  if (!users) return null;

  return (
    <Box
      bg={getGradient({deg: 180, from: 'white', to: 'yellow.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Container size="xl">
        <Stack gap="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            Mød vores [talentfulde eksperter]
          </H2>

          <ScrollArea
            h="auto"
            w="100%"
            type={isMobile ? 'always' : 'never'}
            py={isMobile ? 'md' : undefined}
          >
            <Flex justify="center" gap={isMobile ? 'sm' : 'lg'}>
              {professions?.map((profession) => (
                <ProfessionButton
                  key={profession.translation}
                  profession={profession}
                />
              ))}
            </Flex>
          </ScrollArea>

          <SimpleGrid cols={{base: 2, sm: 3, md: 5}} spacing="xl">
            {users.map((user) => (
              <ArtistCard key={user.id} artist={user} />
            ))}
          </SimpleGrid>
          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/artists"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              Vis skønhedseksperter
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

function RecommendedTreatments({
  products,
}: {
  products: TreatmentCollectionFragment[];
}) {
  const theme = useMantineTheme();
  const AUTOPLAY_DELAY = useRef(Autoplay({delay: 2000}));

  return (
    <Box
      bg={getGradient({deg: 180, from: 'yellow.1', to: 'pink.1'}, theme)}
      py={{base: rem(40), sm: rem(60)}}
    >
      <Stack gap="xl">
        <Container size="xl">
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>
            Book unikke [oplevelser og skønhedsoplevelse]
          </H2>
        </Container>
        <Box px="xl" style={{overflow: 'hidden'}}>
          <Slider
            plugins={[AUTOPLAY_DELAY.current]}
            slideSize={{base: '100%', md: '20%'}}
          >
            {products.map((product) => {
              return (
                <Carousel.Slide key={product.id}>
                  <TreatmentCard product={product} />
                </Carousel.Slide>
              );
            })}
          </Slider>
        </Box>
        <Container size="xl">
          <Flex justify="center">
            <Button
              variant="outline"
              color="black"
              size="lg"
              aria-label="Settings"
              component={Link}
              to="/categories"
              radius="lg"
              rightSection={
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              }
            >
              Vis Kategorier
            </Button>
          </Flex>
        </Container>
      </Stack>
    </Box>
  );
}
