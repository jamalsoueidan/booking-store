import {
  Container,
  Divider,
  Flex,
  Grid,
  ScrollArea,
  Select,
  Stack,
} from '@mantine/core';
import {
  Outlet,
  type ShouldRevalidateFunction,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {ProfessionButton} from '~/components/ProfessionButton';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getTags} from '~/lib/tags';
import {useComponents} from '~/lib/use-components';

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

  const tags = await getTags(
    context.env.PUBLIC_STORE_DOMAIN,
    context.env.PRIVATE_API_ACCESS_TOKEN,
  );

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
    tags,
  });
};

export default function Artists() {
  const {tags, components, visualTeaser} = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const markup = useComponents(
    components?.fields.find(({key}) => key === 'components'),
  );

  const cityValue = searchParams.get('city');
  const onChangeCity = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('city', value);
        } else {
          prev.delete('city');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const sortValue = searchParams.get('sort');
  const onChangeSort = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('sort', value);
        } else {
          prev.delete('sort');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return (
    <>
      <VisualTeaser component={visualTeaser} />

      <Container size="xl">
        <Stack gap="xl">
          <Grid gutter={{base: 'xl', sm: '0'}} align="center">
            <Grid.Col span={{base: 6, sm: 'auto'}}>
              <Select
                size="md"
                value={cityValue}
                placeholder="By?"
                onChange={onChangeCity}
                data={tags['city']}
                clearable
              />
            </Grid.Col>
            <Grid.Col span={{base: 12, sm: 9}} order={{base: 3, sm: 2}}>
              <ScrollArea
                h="auto"
                type="auto"
                py={{basee: 'md', sm: undefined}}
              >
                <Flex gap={{base: 'sm', sm: 'lg'}} justify="center">
                  <ProfessionButton profession={'all'} reset />
                  {tags['profession'].map((profession) => (
                    <ProfessionButton
                      key={profession}
                      profession={profession}
                    />
                  ))}
                </Flex>
              </ScrollArea>
            </Grid.Col>
            <Grid.Col span={{base: 6, sm: 'auto'}} order={{base: 2, sm: 3}}>
              <Select
                size="md"
                value={sortValue}
                placeholder="Sortere efter"
                onChange={onChangeSort}
                data={[
                  {label: 'navn', value: 'title'},
                  {label: 'nyeste', value: 'published_at'},
                  {label: 'ældest', value: 'reverse'},
                ]}
                clearable
              />
            </Grid.Col>
          </Grid>
          <Outlet />
        </Stack>
      </Container>

      <Divider />
      {markup}
    </>
  );
}
