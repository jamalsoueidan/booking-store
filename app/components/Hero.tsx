import {
  Button,
  Container,
  Flex,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {IconArrowRightBar} from '@tabler/icons-react';
import {motion} from 'framer-motion';
import {useState} from 'react';

export function Hero() {
  return (
    <Container size="lg" pt="70" pb="50" h="100%">
      <SimpleGrid cols={2} spacing="xl">
        <Stack align="flex-start">
          <Title order={1} lts=".5px" size={rem(36)}>
            Start din rejse med BySisters
          </Title>
          <Text c="dimmed" size="xl" fw="500">
            Opdag og book skønhedseksperter nemt med vores beauty platform.
          </Text>

          <Flex justify="center">
            <Button
              variant="filled"
              color="orange"
              component={Link}
              to="/artists"
              size="lg"
              radius="xl"
            >
              Find en skønhedsekspert
            </Button>

            <Button
              variant="subtle"
              color="orange"
              component={Link}
              to="/pages/start-din-skoenhedskarriere"
              size="lg"
              radius="xl"
              rightSection={<IconArrowRightBar />}
            >
              Start din skønhedskarriere
            </Button>
          </Flex>
        </Stack>
        <div>
          <CardStack />
        </div>
      </SimpleGrid>
    </Container>
  );
}

const CARD_COLORS = ['#266678', '#cb7c7a', ' #36a18b', '#cda35f', '#747474'];
const CARD_OFFSET = 30;
const SCALE_FACTOR = 0.06;

const CardStack = () => {
  const [cards, setCards] = useState(CARD_COLORS);

  const moveToEnd = () => {
    setCards((currentCards) => {
      if (currentCards.length > 1) {
        const [firstCard, ...restCards] = currentCards;
        return [...restCards, firstCard];
      }
      return currentCards;
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ul
        style={{
          position: 'relative',
          width: '350px',
          height: '220px',
        }}
      >
        {cards.map((color, index) => {
          const canDrag = index === 0;

          return (
            <motion.li
              key={color}
              style={{
                position: 'absolute',
                width: '350px',
                height: '220px',
                borderRadius: '8px',
                listStyle: 'none',
                transformOrigin: 'center left',
                backgroundColor: color,
                cursor: canDrag ? 'grab' : 'auto',
              }}
              animate={{
                right: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex: CARD_COLORS.length - index,
              }}
              drag={canDrag ? 'x' : false}
              dragConstraints={{
                left: 0,
                right: 0,
              }}
              onDragEnd={() => moveToEnd()}
            />
          );
        })}
      </ul>
    </div>
  );
};
