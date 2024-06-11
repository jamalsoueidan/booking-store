import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';

interface TranslationContextType {
  [key: string]: string;
}

const TranslationContext = createContext<TranslationContextType>({});

export const TranslationProvider = ({
  data,
  children,
}: {data: Record<string, string>} & PropsWithChildren) => {
  const [translations] = useState<Record<string, string>>(data);

  return (
    <TranslationContext.Provider value={translations}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  const data = useContext(TranslationContext);

  return {
    t: data,
  };
};
