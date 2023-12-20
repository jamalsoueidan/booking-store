import {Button, Flex, Text, Title, rem} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import image from '../../public/beauty-image.png';
import classes from './Hero.module.css';

export function Hero() {
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <div
      className={classes.root}
      style={{
        backgroundImage: isMobile ? '' : `url('${image}')`,
      }}
    >
      <Flex
        w={isMobile ? '100%' : '50%'}
        h={isMobile ? '80%' : '90%'}
        justify="center"
        direction="column"
        gap={isMobile ? 'lg' : 'xl'}
      >
        <Title
          order={1}
          size={rem(isMobile ? 26 : 60)}
          ta="center"
          lts="1px"
          style={{lineHeight: isMobile ? '40px' : '50px'}}
        >
          Din Skønhed {isMobile ? ' - ' : <br />}
          Vores Passion
        </Title>
        <Text c="dimmed" size={rem(isMobile ? 20 : 30)} ta="center" lts="1px">
          Book skønhedstjenester fra hundredvis af skønhedsprofessionelle i
          nærheden af dig.
        </Text>

        <Flex justify="center">
          <Button
            variant="filled"
            color="orange"
            size="lg"
            component={Link}
            to="/artists"
          >
            Find en skønhedsekspert
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
