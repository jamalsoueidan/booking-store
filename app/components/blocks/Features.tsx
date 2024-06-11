import {Container, SimpleGrid, Text, ThemeIcon, Title} from '@mantine/core';
import type {
  FeatureItemFragment,
  FeaturesFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import classes from './Features.module.css';

export interface FeatureProps {
  icon: React.FC<any>;
  title: string;
  description: string;
}

export function Features({data}: {data: FeaturesFragment}) {
  const title = data.title?.value;
  const subtitle = data.subtitle?.value;
  const items = data.items?.references?.nodes;

  const features = items?.map((feature) => (
    <Feature key={feature.id} data={feature} />
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

function Feature({data}: {data: FeatureItemFragment}) {
  const title = data.title?.value;
  const description = data.description?.value;
  const icon = data.icon?.value;

  return (
    <div>
      <ThemeIcon variant="light" size={40} radius={40}>
        -
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
