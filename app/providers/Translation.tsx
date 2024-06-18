import React, {
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

  const interpolateText = useCallback(
    (value: string, options: Record<string, any>) => {
      return value.replace(/{(.*?)}/g, (match, key) => options[key] ?? match);
    },
    [],
  );

  const interpolateComponents = useCallback(
    (value: string, components: Record<string, React.ReactNode>) => {
      return value.split(/(<.*?>)/g).map((part, index) => {
        const match = part.match(/<(.*?)>/);
        if (match) {
          const nestedText = match[1];
          console.log(nestedText);
          const component = components[index];
          if (React.isValidElement(component)) {
            return React.cloneElement(
              component,
              {key: nestedText + index},
              nestedText,
            );
          }
          return (
            <React.Fragment key={nestedText + index}>
              {component}
            </React.Fragment>
          );
        }
        return <React.Fragment key={part + index}>{part}</React.Fragment>;
      });
    },
    [],
  );

  const tc = useCallback(
    (key: string, options: Record<string, any> = {}) => {
      const value = data[key];
      if (!value) {
        console.log(`missing_${key}`, data);
        return `missing_${key}`;
      }
      if (options['replace']) {
        return interpolateComponents(options['replace'], options);
      }
      const text = interpolateText(value, options);
      const regex = /<.*?>/;
      if (regex.test(text)) {
        return interpolateComponents(text, options);
      } else {
        return text;
      }
    },
    [data, interpolateComponents, interpolateText],
  );

  const t = useCallback(
    (key: string, options: Record<string, any> = {}) => {
      const value = data[key];
      if (!value) {
        console.log(`missing_${key}`, data);
        return `missing_${key}`;
      }
      return interpolateText(value, options);
    },
    [data, interpolateText],
  );

  return {
    t,
    tc,
  };
};

const convertJsonStructure = (data?: TranslationsFragment[] | null) => {
  const result: Record<string, string> = {};

  data?.forEach((node) => {
    const key = node.handle.replace(/-/g, '_');
    const value = node.value?.value;
    if (key && value) {
      result[key] = value;
    }
  });

  return result;
};
