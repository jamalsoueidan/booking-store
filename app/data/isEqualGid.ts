import {parseGid} from '@shopify/hydrogen';

export const isEqualGid = (shopifyId: string, stringId: string | number) => {
  return parseGid(shopifyId).id === stringId.toString();
};
