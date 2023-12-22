import {Button, Flex, Text, Title} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import classes from './Hero.module.css';

export function Hero() {
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <div className={classes.root}>
      <Flex justify="center" direction="column" className={classes.flex}>
        <Title order={1} ta="center" lts="1px" className={classes.title}>
          Din Skønhed{isMobile ? ', ' : <br />}
          Vores Passion
        </Title>
        <Text c="dimmed" className={classes.subtitle} ta="center" lts="1px">
          Book skønhedstjenester fra hundredvis af skønhedsprofessionelle i
          nærheden af dig.
        </Text>

        <Flex justify="center">
          <Button
            variant="filled"
            color="orange"
            component={Link}
            to="/artists"
            className={classes.button}
          >
            Find en skønhedsekspert
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
