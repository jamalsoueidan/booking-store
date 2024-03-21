import {Button, Flex, Title} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import classes from './Hero.module.css';

export function Hero() {
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <div className={classes.root}>
      <Flex justify="center" direction="column" className={classes.flex}>
        <Title
          ta="center"
          lts="1px"
          className={classes.title}
          textWrap="balance"
        >
          BySisters er en skønhedsplatform hvor du kan finde professional
          artister i nærheden af dig!
        </Title>

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
