import {Text, Title, type TitleProps, rem} from '@mantine/core';

export function TransformText({
  input,
  ...props
}: {
  input: string;
} & TitleProps) {
  const segments = input.split(/[\[\]]/).filter(Boolean);

  return (
    <Title
      order={1}
      ta="center"
      textWrap="balance"
      lts="1px"
      fw="bold"
      fz={{base: rem(38), sm: rem(65)}}
      lh={{base: rem(45), sm: rem(70)}}
      {...props}
    >
      {segments.map((segment: string, index: number) => {
        if (input.indexOf(`[${segment}]`) > -1) {
          return (
            <Text
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              component="span"
              inherit
              variant="gradient"
              gradient={{from: 'orange', to: 'orange.3', deg: 180}}
            >
              {segment}
            </Text>
          );
        }
        return segment;
      })}
    </Title>
  );
}
