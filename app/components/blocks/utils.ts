import {type MetaobjectField} from '@shopify/hydrogen/storefront-api-types';
import type {
  PageComponentCollectionFragment,
  PageComponentFragment,
  PageComponentMediaImageFragment,
  PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';

export function useField(
  component:
    | PageComponentFragment
    | PageComponentMetaobjectFragment
    | null
    | undefined,
) {
  const getField = <T>(key: string): T => {
    return component?.fields.find((f) => f.key === key) as T;
  };

  const getFieldValue = (key: string) => {
    return component?.fields.find((f) => f.key === key)?.value || undefined;
  };

  const getBooleanValue = (key: string) => {
    return component?.fields.find((f) => f.key === key)?.value === 'true';
  };

  const getMetaObject = (key: string) => {
    const reference = getField<MetaobjectField>(key)?.reference;
    if (isMetaobject(reference)) {
      return reference;
    }
    return null;
  };

  const getItems = <T>(key: string): T[] => {
    const data = getField<MetaobjectField>(key)?.references?.nodes || [];
    return data as T[];
  };

  const getImage = (key?: string) => {
    const reference = getField<MetaobjectField>(key || 'image')?.reference;
    if (isMediaImage(reference)) {
      return reference.image;
    }
    return null;
  };

  const getJSON = (key: string): any => {
    const json =
      component?.fields.find((f) => f.key === key)?.value || undefined;
    if (json) {
      return JSON.parse(json);
    }
    return {};
  };

  return {
    getField,
    getFieldValue,
    getBooleanValue,
    getMetaObject,
    getImage,
    getItems,
    getJSON,
  };
}

export const isMetaobject = (
  metaobject?:
    | PageComponentMetaobjectFragment
    | PageComponentMediaImageFragment
    | PageComponentCollectionFragment
    | null,
): metaobject is PageComponentMetaobjectFragment => {
  if (!metaobject) {
    return false;
  }

  return (metaobject as PageComponentMetaobjectFragment).fields !== undefined;
};

export const isMediaImage = (
  metaobject?:
    | PageComponentMetaobjectFragment
    | PageComponentMediaImageFragment
    | PageComponentCollectionFragment
    | null,
): metaobject is PageComponentMediaImageFragment => {
  if (!metaobject) {
    return false;
  }

  return (metaobject as PageComponentMediaImageFragment).image !== undefined;
};
