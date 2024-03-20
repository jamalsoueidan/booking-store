import {
  type PageComponentFragment,
  type PageComponentMediaImageFragment,
  type PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';

export function useField(component: PageComponentFragment | null | undefined) {
  const getField = (key: string) => {
    return component?.fields.find((f) => f.key === key);
  };

  const getFieldValue = (key: string) => {
    return component?.fields.find((f) => f.key === key)?.value || undefined;
  };

  const getBooleanValue = (key: string) => {
    return component?.fields.find((f) => f.key === key)?.value === 'true';
  };

  const getMetaObject = (key: string) => {
    const reference = getField(key)?.reference;
    if (isMetaobject(reference)) {
      return reference;
    }
    return null;
  };

  const getItems = (key: string) => {
    return getField(key)?.references?.nodes || [];
  };

  const getImage = (key?: string) => {
    const reference = getField(key || 'image')?.reference;
    if (isMediaImage(reference)) {
      return reference.image;
    }
    return null;
  };

  return {
    getField,
    getFieldValue,
    getBooleanValue,
    getMetaObject,
    getImage,
    getItems,
  };
}

export const isMetaobject = (
  metaobject?:
    | PageComponentMetaobjectFragment
    | PageComponentMediaImageFragment
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
    | null,
): metaobject is PageComponentMediaImageFragment => {
  if (!metaobject) {
    return false;
  }

  return (metaobject as PageComponentMediaImageFragment).image !== undefined;
};
