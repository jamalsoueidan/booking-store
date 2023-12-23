// https://community.shopify.com/c/technical-q-a/graphql-and-product-metafields-how-to-access-array-of-products/m-p/1611955
export const convertToEmbedArray = (sampleArr: string): string[] => {
  return sampleArr?.replace(/\[|\]/g, '').replace(/"/g, '').split(',') ?? [];
};
