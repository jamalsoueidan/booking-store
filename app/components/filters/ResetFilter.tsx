import {Button} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {IconX} from '@tabler/icons-react';
import {useTranslations} from '~/providers/Translation';

export function ResetFilter() {
  const {t} = useTranslations();
  const [searchParams, setSearchParams] = useSearchParams();
  const keysToKeep = ['direction', 'cursor', 'map'];

  const deleteSearchParams = () => {
    setSearchParams(
      (prev) => {
        prev.forEach((_, key) => {
          if (!keysToKeep.includes(key)) {
            prev.delete(key);
          }
        });
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const remainingParamsCount = Array.from(searchParams.keys()).filter(
    (key) => !keysToKeep.includes(key),
  ).length;

  if (remainingParamsCount === 0) {
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
      {t('filter_reset')}
    </Button>
  );
}
