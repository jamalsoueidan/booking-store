import {useMemo} from 'react';
import {type UserCollectionFilterFragment} from 'storefrontapi.generated';

export const useFilterCounts = (
  filters: UserCollectionFilterFragment[],
  patternKey: string,
): Record<string, number> => {
  return useMemo(() => {
    const pattern = new RegExp(`^${patternKey}-(.+)$`);
    const counts: Record<string, number> = {};

    filters.forEach((filter) => {
      filter.values.forEach((value) => {
        const match = value.label.match(pattern);
        if (match) {
          const key = match[1];
          counts[key] = value.count || 0; // default to 0 if not found
        }
      });
    });

    return counts;
  }, [filters, patternKey]);
};
