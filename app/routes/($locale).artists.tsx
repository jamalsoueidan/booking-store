import {Divider, Flex, ScrollArea} from '@mantine/core';
import {Outlet, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {ProfessionButton} from '~/components/ProfessionButton';
import {SpecialityButton} from '~/components/SpecialityButton';
import {METAFIELD_QUERY} from '~/data/fragments';
import {useComponents} from '~/lib/use-components';
import {loader as loaderProfessions} from './($locale).api.users.professions';
import {loader as loaderSpecialties} from './($locale).api.users.specialties';

export const loader = async (args: LoaderFunctionArgs) => {
  const {context} = args;

  let response = await loaderSpecialties(args);
  const specialties = await response.json();

  response = await loaderProfessions(args);
  const professions = await response.json();

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

  const markup = useComponents(
    components?.fields.find(({key}) => key === 'components'),
  );

  return (
    <>
      <VisualTeaser component={visualTeaser} />

      <ScrollArea h="auto" type="never" mb="lg" px="lg">
        <Flex gap="lg" justify="center">
          <ProfessionButton
            profession={{
              count: 0,
              key: 'all',
              translation: 'Alle eksperter',
            }}
            reset
          />
          {professions.map((profession) => (
            <ProfessionButton key={profession.key} profession={profession} />
          ))}
        </Flex>
        {specialties.length > 0 ? (
          <Flex gap="sm" justify="center" mt="lg">
            {specialties.map((speciality) => (
              <SpecialityButton key={speciality.key} speciality={speciality} />
            ))}
          </Flex>
        ) : null}
      </ScrollArea>

      <Outlet />

      <Divider />
      {markup}
    </>
  );
}
