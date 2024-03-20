import {
  type PageComponentFragment,
  type PageComponentMediaImageFragment,
  type PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';

export function useField(component: PageComponentFragment | null) {
  const getField = (key: string) => {
    return component?.fields.find((f) => f.key === key);
  };

  const getFieldValue = (key: string) => {
    return component?.fields.find((f) => f.key === key)?.value || undefined;
  };

  const getMetaObject = (key: string) => {
    const reference = getField(key)?.reference;
    if (isMetaobject(reference)) {
      return reference;
    }
    return null;
  };

  const getImage = (key?: string) => {
    const reference = getField(key || 'image')?.reference;
    if (isMediaImage(reference)) {
      return reference;
    }
    return null;
  };

  return {getField, getFieldValue, getMetaObject, getImage};
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
): metaobject is PageComponentMetaobjectFragment => {
  if (!metaobject) {
    return false;
  }

  return (metaobject as PageComponentMediaImageFragment).image !== undefined;
};
