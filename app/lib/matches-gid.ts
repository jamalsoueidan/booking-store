import {parseGid} from '@shopify/hydrogen';

export function matchesGid(gid: string, id: number | string) {
  const parsedId = parseGid(gid).id;
  return parsedId === id.toString();
}
