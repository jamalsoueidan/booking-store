import {Button} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {IconX} from '@tabler/icons-react';

export function ResetFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const deleteSearchParams = () => {
    setSearchParams(
      (prev) => {
        prev.forEach((_, key) => {
          prev.delete(key);
        });
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  if (searchParams.size === 0) {
    return null;
  }

  return (
    <Button
      variant="outline"
      c="black"
      color="gray.3"
      bg="white"
      onClick={deleteSearchParams}
      size="xl"
      rightSection={<IconX />}
    >
      Nulstil filtering
    </Button>
  );
}
