import {Container, Overlay, Text, Title} from '@mantine/core';
import image from '../../public/makeup.jpeg';
import classes from './ArtistsHero.module.css';

export function ArtistsHero() {
  return (
    <div className={classes.wrapper} style={{backgroundImage: `url(${image})`}}>
      <Overlay color="#000" opacity={0.4} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Find{' '}
          <Text component="span" inherit className={classes.highlight}>
            den perfekte skønhedsekspert
          </Text>{' '}
          til dine behov!
        </Title>

        <Container>
          <Text size="lg" className={classes.description}>
            Her giver vi dig muligheden for at finde og booke tid hos en
            skønhedsekspert, der passer perfekt til dine behov. Vores platform
            rummer et utal af talentfulde og passionerede skønhedseksperter,
            hver med deres unikke stil og teknikker. Vi tror på at skønhed er
            personlig og unik for hver enkel, så vi har gjort det nemt for dig
            at finde den rette skønhedsekspert.
          </Text>
        </Container>
      </div>
    </div>
  );
}
