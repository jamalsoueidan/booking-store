import {Box, Divider, Flex, ScrollArea, Stack, Title} from '@mantine/core';
import {Outlet, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {ProfessionButton} from '~/components/ProfessionButton';
import {SpecialityButton} from '~/components/SpecialityButton';
import {METAFIELD_QUERY} from '~/data/fragments';
import {useComponents} from '~/lib/use-components';
import {loader as loaderProfessions} from './($locale).api.users.professions';
import {loader as loaderSpecialties} from './($locale).api.users.specialties';

const LIMIT = '20';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context} = args;

  let response = await loaderSpecialties(args);
  const specialties = await response.json();

  response = await loaderProfessions(args);
  const professions = await response.json();

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'components',
      },
    },
  );

  return json({components, professions, specialties});
};

export default function Artists() {
  const {professions, specialties, components} = useLoaderData<typeof loader>();

  const markup = useComponents(
    components?.fields.find(({key}) => key === 'components'),
  );

  return (
    <>
      <Box
        bg={'yellow.1'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
        }}
      ></Box>

      <Box mx={{base: 'md', sm: '42'}} my="xl">
        <Stack gap="xl">
          <Title order={2} fw="normal">
            <span style={{fontWeight: 500}}>Vælg en ekspert.</span>{' '}
            <span style={{color: '#666', fontWeight: 400}}>
              Book en session. Nyd og slap af med professionel service.
            </span>
          </Title>
          <ScrollArea h={200}>
            <Flex gap="lg">
              <ProfessionButton
                profession={{
                  count: 0,
                  key: 'all',
                  translation: 'Alle eksperter',
                }}
                reset
              />
              {professions.map((profession) => (
                <ProfessionButton
                  key={profession.key}
                  profession={profession}
                />
              ))}
            </Flex>
            {specialties.length > 0 ? (
              <Flex gap="sm" mt="lg">
                {specialties.map((speciality) => (
                  <SpecialityButton
                    key={speciality.key}
                    speciality={speciality}
                  />
                ))}
              </Flex>
            ) : null}
          </ScrollArea>
        </Stack>
        <Outlet />
      </Box>
      <Divider />
      {markup}
    </>
  );
}
