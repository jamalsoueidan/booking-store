import {
  type MantineGradient,
  rem,
  Text,
  Title,
  type TitleProps,
} from '@mantine/core';

export const H2 = ({
  children,
  gradients, // Add this prop to accept gradient configurations
  ...props
}: Omit<TitleProps, 'children'> & {
  children: string;
  gradients: MantineGradient | MantineGradient[];
}) => {
  const segments = children.split(/[\[\]]/).filter(Boolean);

  return (
    <Title
      order={2}
      ta="center"
      lts="1px"
      fw="bold"
      fz={{base: rem(35), sm: rem(45)}}
      lh={{base: rem(45), sm: rem(55)}}
      {...props}
    >
      {segments.map((segment, index) => {
        if (children.indexOf(`[${segment}]`) > -1) {
          const gradient = Array.isArray(gradients)
            ? gradients[index]
            : gradients;
          const {from, to, deg = 90} = gradient || {from: 'orange', to: 'red'}; // Fallback gradient

          return (
            <Text
              key={index}
              component="span"
              inherit
              variant="gradient"
              gradient={{from, to, deg}}
            >
              {segment}
            </Text>
          );
        }
        return segment;
      })}
    </Title>
  );
};
