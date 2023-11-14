import {Button, Container, Text, Title} from '@mantine/core';
import image from '../../public/background.webp';
import classes from './Hero.module.css';
export function HeroImageRight() {
  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: `linear-gradient(250deg,rgba(130, 201, 30, 0) 0%,#fff 90%),url('${image}')`,
      }}
    >
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Find{' '}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{from: 'pink', to: 'yellow'}}
              >
                din skønhedsekspert
              </Text>{' '}
              til din næste behandling
            </Title>

            <Text className={classes.description} mt={30}>
              På vores platform kan du nemt finde og booke en tid hos en
              skønhedsexpert, der passer til dine behov. Vi har mange
              talentfulde og passionerede skønhedsexpertise, hver med unikke
              stile og teknikker.
            </Text>

            <Button
              variant="gradient"
              gradient={{from: 'pink', to: 'yellow'}}
              size="xl"
              className={classes.control}
              mt={40}
            >
              Start din søgning
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
