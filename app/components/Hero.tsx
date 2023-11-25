import {Container, Flex, Text, Title, rem} from '@mantine/core';
import image from '../../public/background.webp';
import classes from './Hero.module.css';

export function FrontpageHero() {
  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: `url('${image}')`,
      }}
    >
      <Container size="lg" p={rem(48)}>
        <Flex direction="column" align="center" justify="center">
          <Title className={classes.title} ta="center">
            Find din skønhedsekspert
          </Title>
          <Title className={classes.title} ta="center">
            til din næste behandling
          </Title>

          <Text className={classes.description} mt={30} ta="center">
            På vores platform kan du nemt finde og booke en tid hos en
            skønhedsexpert, der passer til dine behov. Vi har mange talentfulde
            og passionerede skønhedsexpertise, hver med unikke stile og
            teknikker.
          </Text>
        </Flex>
      </Container>
    </div>
  );
}
