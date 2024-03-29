import {
  Container,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core';
import {
  Icon12Hours,
  IconCookie,
  IconGauge,
  IconLock,
  IconMessage2,
  IconUser,
} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import classes from './Features.module.css';

export function WrapperFeatures({
  component,
}: {
  component: PageComponentFragment;
}) {
  const title = component.fields.find((k) => k.key === 'title')?.value || '';
  const subtitle =
    component.fields.find((k) => k.key === 'subtitle')?.value || '';

  const references = component.fields.find((c) => c.key === 'items')?.references
    ?.nodes;

  const items: Array<FeatureProps> =
    references?.map((item) => {
      const assertedItem = item as unknown as PageComponentMetaobjectFragment;
      const title =
        assertedItem.fields.find((k) => k.key === 'title')?.value || '';
      const description =
        assertedItem.fields.find((k) => k.key === 'description')?.value || '';

      return {
        icon: Icon12Hours,
        title,
        description,
      };
    }) || [];

  return <Features title={title} subtitle={subtitle} items={items} />;
}

export const MOCKDATA = [
  {
    icon: IconGauge,
    title: 'Extreme performance',
    description:
      'This dust is actually a powerful poison that will even make a pro wrestler sick, Regice cloaks itself with frigid air of -328 degrees Fahrenheit',
  },
  {
    icon: IconUser,
    title: 'Privacy focused',
    description:
      'People say it can run at the same speed as lightning striking, Its icy body is so cold, it will not melt even if it is immersed in magma',
  },
  {
    icon: IconCookie,
    title: 'No third parties',
    description:
      'They’re popular, but they’re rare. Trainers who show them off recklessly may be targeted by thieves',
  },
  {
    icon: IconLock,
    title: 'Secure by default',
    description:
      'Although it still can’t fly, its jumping power is outstanding, in Alola the mushrooms on Paras don’t grow up quite right',
  },
  {
    icon: IconMessage2,
    title: '24/7 Support',
    description:
      'Rapidash usually can be seen casually cantering in the fields and plains, Skitty is known to chase around after its own tail',
  },
];

export function Features({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: Array<FeatureProps>;
}) {
  const features = items.map((feature) => (
    <Feature {...feature} key={feature.title + feature.description} />
  ));

  return (
    <Wrapper>
      <Title className={classes.title}>{title}</Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          {subtitle}
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={{base: 1, sm: 2, md: 3}}
        spacing={{base: 'xl', md: 50}}
        verticalSpacing={{base: 'xl', md: 50}}
      >
        {features}
      </SimpleGrid>
    </Wrapper>
  );
}

export interface FeatureProps {
  icon: React.FC<any>;
  title: string;
  description: string;
}

function Feature({icon: Icon, title, description}: FeatureProps) {
  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        <Icon style={{width: rem(18), height: rem(18)}} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}
