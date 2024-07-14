import {type ProductFilter} from '@shopify/hydrogen/storefront-api-types';

export function generateQuerySearch(filters: ProductFilter[]): string {
  const groupedFilters: Record<string, string[]> = {};

  filters.forEach((filter) => {
    if (filter.tag) {
      const [type, value] = filter.tag.split('-');
      if (!groupedFilters[type]) {
        groupedFilters[type] = [];
      }
      groupedFilters[type].push(`${type}-${value}`);
    }
  });

  const queryParts: string[] = [];
  Object.keys(groupedFilters).forEach((key) => {
    if (groupedFilters[key].length > 1) {
      queryParts.push(`(${groupedFilters[key].join(' AND ')})`);
    } else {
      queryParts.push(groupedFilters[key][0]);
    }
  });

  return queryParts.join(' AND ');
}
