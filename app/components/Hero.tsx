import {
  Box,
  Button,
  Container,
  createPolymorphicComponent,
  Flex,
  Image,
  rem,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
  type UnstyledButtonProps,
} from '@mantine/core';
import {Await, Link} from '@remix-run/react';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import {IconArrowRightBar} from '@tabler/icons-react';
import {motion} from 'framer-motion';
import {Suspense, useState} from 'react';
import type {User, UsersListResponse} from '~/lib/api/model';
import {type Profession} from '~/routes/($locale).api.users.professions';

export function Hero({
  artists,
  professions,
}: {
  artists: Promise<UsersListResponse>;
  professions?: Promise<Array<Profession>>;
}) {
  return (
    <Container size="lg" pt={{base: 30, sm: 50}} pb="40" h="100%">
      <SimpleGrid cols={{base: 1, sm: 2}} spacing="xl">
        <Stack justify="center">
          <Title order={1} lts=".5px" fw="600" size={rem(42)}>
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
        <Suspense fallback={<Skeleton height={50} />}>
          <Await resolve={artists}>
            {({payload}) => <CardStack artists={payload.results} />}
          </Await>
        </Suspense>
      </SimpleGrid>
    </Container>
  );
}

const MotionUnstyledButton = createPolymorphicComponent<
  'a',
  UnstyledButtonProps
>(UnstyledButton);

const CARD_OFFSET = 30;
const SCALE_FACTOR = 0.06;

const CardStack = ({artists: starter}: {artists: User[]}) => {
  const [artists, setArtists] = useState(starter);

  const moveToEnd = () => {
    setArtists((currentCards) => {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
        }}
      >
        {artists.map((artist, index) => {
          const canDrag = index === 0;

          return (
            <motion.div
              key={artist.customerId}
              style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                transformOrigin: 'center left',
                cursor: canDrag ? 'grab' : 'auto',
              }}
              animate={{
                right: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex: artists.length - index,
              }}
              drag={canDrag ? 'x' : false}
              dragConstraints={{
                left: 0,
                right: 0,
              }}
              onDragEnd={() => moveToEnd()}
            >
              <Image
                draggable={false}
                component={ShopifyImage}
                h="300px"
                w="300px"
                radius="xl"
                src={artist.images?.profile?.url}
                fallbackSrc="https://placehold.co/400x600?text=Ekspert"
              />
              <Box
                bg="white"
                p="md"
                style={{
                  borderBottomLeftRadius: '32px',
                  borderBottomRightRadius: '32px',
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  left: 0,
                  opacity: 0.8,
                }}
              >
                <strong>{artist.fullname}</strong> {artist.shortDescription}
              </Box>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
