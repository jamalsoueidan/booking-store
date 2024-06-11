import {type TranslationsFragment} from 'storefrontapi.generated';

export const convertJsonStructure = (data?: TranslationsFragment | null) => {
  const nodes = data?.keys?.references?.nodes || [];
  const result: Record<string, string> = {};

  nodes.forEach((node) => {
    const key = node.key?.value;
    const value = node.value?.value;
    if (key && value) {
      result[key] = value;
    }
  });

  return result;
};
