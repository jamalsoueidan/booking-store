import {useSearchParams} from '@remix-run/react';

export function useChangeFilter(name: string) {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(name);
  const onChange = (value: string | string[] | null) => {
    setSearchParams(
      (prev) => {
        if (value === null || value.length === 0) {
          prev.delete(name);
        } else if (typeof value === 'string') {
          prev.set(name, value);
        } else if (Array.isArray(value)) {
          prev.set(name, value.filter((v: string) => v.length > 0).join(','));
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return {
    value,
    label: value ? value[0].toUpperCase() + value.slice(1) : null,
    onChange,
  };
}
