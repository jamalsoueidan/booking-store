import {
  Button,
  Checkbox,
  Container,
  Divider,
  Drawer,
  Flex,
  Group,
  InputLabel,
  Radio,
  ScrollArea,
  Select,
  Stack,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Outlet,
  type ShouldRevalidateFunction,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  IconArrowDown,
  IconArrowsSort,
  IconFilter,
  IconFlag,
  IconGenderFemale,
  IconNetwork,
  IconWorld,
  IconWorldCheck,
  IconX,
} from '@tabler/icons-react';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {ProfessionButton} from '~/components/ProfessionButton';
import {METAFIELD_QUERY} from '~/data/fragments';
import {getTags} from '~/lib/tags';
import {useComponents} from '~/lib/use-components';
import {ProfessionTranslations} from './api.users.professions';

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
  const [opened, {open, close}] = useDisclosure(false);
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

  const genderValue = searchParams.get('gender');
  const onChangeGender = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('gender', value);
        } else {
          prev.delete('gender');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const daysValue = String(searchParams.get('days') || '').split(',');
  const onChangeDays = (value: string[]) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('days', value.filter((v) => v.length > 0).join(','));
        } else {
          prev.delete('days');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const langValue = String(searchParams.get('lang') || '').split(',');
  const onChangeLang = (value: string[]) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('lang', value.filter((v) => v.length > 0).join(','));
        } else {
          prev.delete('lang');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const professionSearchParams = searchParams.get('profession') || '';
  const onChangeProfession = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('profession', value);
        } else {
          prev.delete('profession');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const deleteSearchParams = () => {
    setSearchParams(
      (prev) => {
        prev.delete('city');
        prev.delete('sort');
        prev.delete('gender');
        prev.delete('days');
        prev.delete('lang');
        prev.delete('profession');
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
          <ScrollArea h="auto" type="auto" py={{base: 'md', sm: undefined}}>
            <Flex gap={{base: 'sm', sm: 'lg'}} justify="center">
              <ProfessionButton profession={'all'} reset />
              {tags['profession'].map((profession) => (
                <ProfessionButton key={profession} profession={profession} />
              ))}
            </Flex>
          </ScrollArea>
          <Flex justify="center" gap="md">
            <Button
              variant="outline"
              c="black"
              color="gray.3"
              onClick={open}
              size="xl"
              leftSection={<IconFilter />}
              rightSection={<IconArrowDown />}
            >
              Filtre
            </Button>
            {searchParams.size > 0 ? (
              <Button
                variant="outline"
                c="black"
                color="gray.3"
                onClick={deleteSearchParams}
                size="xl"
                rightSection={<IconX />}
              >
                Nulstil filtre
              </Button>
            ) : null}
          </Flex>
          <Outlet />
        </Stack>
      </Container>

      <Divider />

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        title="Filtre"
        overlayProps={{backgroundOpacity: 0.3, blur: 2}}
      >
        <Stack gap="sm">
          <Select
            size="md"
            value={professionSearchParams}
            label="Skønhedseksperter profession:"
            placeholder="Alle professioner"
            onChange={onChangeProfession}
            leftSection={<IconNetwork />}
            data={tags['profession'].map((p) => ({
              label: `${ProfessionTranslations[
                p
              ][0].toUpperCase()}${ProfessionTranslations[p].substring(1)}`,
              value: p,
            }))}
            clearable
          />

          <Select
            size="md"
            value={cityValue}
            label="Vis skønhedseksperter fra byer:"
            placeholder="Alle byer"
            onChange={onChangeCity}
            leftSection={<IconWorld />}
            data={tags['city'].map((p) => ({
              label: `${p[0].toUpperCase()}${p.substring(1)}`,
              value: p,
            }))}
            clearable
          />
          <Select
            size="md"
            value={sortValue}
            label="Sortere skønhedseksperter efter:"
            leftSection={<IconArrowsSort />}
            placeholder="Vælge sortering"
            onChange={onChangeSort}
            data={[
              {label: 'Navn', value: 'title'},
              {label: 'Nyeste', value: 'published_at'},
              {label: 'Ældest', value: 'reverse'},
            ]}
            clearable
          />

          <Divider />
          <div>
            <Group gap="xs" mb="xs">
              <IconGenderFemale />
              <InputLabel size="md">Skønhedsekspert køn?</InputLabel>
            </Group>
            <Radio.Group value={genderValue} onChange={onChangeGender}>
              <Stack gap="3px">
                <Radio value={null!} label="Begge" />
                <Radio value="woman" label="Kvinde" />
                <Radio value="man" label="Mand" />
              </Stack>
            </Radio.Group>
          </div>

          <Divider />
          <div>
            <Group gap="xs" mb="xs">
              <IconWorldCheck />
              <InputLabel size="md">Skønhedsekspert arbejdsdage?</InputLabel>
            </Group>
            <Checkbox.Group value={daysValue} onChange={onChangeDays}>
              <Stack gap="3px">
                <Checkbox value="monday" label="Mandag" />
                <Checkbox value="tuesday" label="Tirsdag" />
                <Checkbox value="wednesday" label="Onsdag" />
                <Checkbox value="thursday" label="Torsdag" />
                <Checkbox value="friday" label="Fredag" />
                <Checkbox value="saturday" label="Lørdag" />
                <Checkbox value="sunday" label="Søndag" />
              </Stack>
            </Checkbox.Group>
          </div>
          <Divider />
          <div>
            <Group gap="xs" mb="xs">
              <IconFlag />
              <InputLabel size="md">Skønhedseksperten taler</InputLabel>
            </Group>
            <Checkbox.Group value={langValue} onChange={onChangeLang}>
              <Stack gap="3px">
                <Checkbox value="english" label="English" />
                <Checkbox value="danish" label="Dansk" />
              </Stack>
            </Checkbox.Group>
          </div>
        </Stack>
      </Drawer>

      {markup}
    </>
  );
}
