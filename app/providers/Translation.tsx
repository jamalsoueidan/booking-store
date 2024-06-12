import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  type PageFragment,
  type TranslationsFragment,
} from 'storefrontapi.generated';

interface TranslationContextType {
  [key: string]: string;
}

const TranslationContext = createContext<TranslationContextType>({});

export const TranslationProvider = ({
  data,
  children,
}: {data?: PageFragment['translations'] | null} & PropsWithChildren) => {
  const [translations] = useState<Record<string, string>>(
    convertJsonStructure(data?.references?.nodes),
  );

  return (
    <TranslationContext.Provider value={translations}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  const data = useContext(TranslationContext);

  const t = useCallback(
    (key: string) => {
      const value = data[key];
      if (!value) {
        console.log(`missing_${key}`, data);
        return `missing_${key}`;
      }
      return value;
    },
    [data],
  );

  return {
    t,
  };
};

const convertJsonStructure = (data?: TranslationsFragment[] | null) => {
  const result: Record<string, string> = {};

  data?.forEach((node) => {
    const key = node.key?.value;
    const value = node.value?.value;
    if (key && value) {
      result[key] = value;
    }
  });

  return result;
};
