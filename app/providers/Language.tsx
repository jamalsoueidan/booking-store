import {type LanguageCode} from '@shopify/hydrogen/storefront-api-types';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';

const LanguageContext = createContext<LanguageCode>('DA');

export const LanguageProvider = ({
  data,
  children,
}: {data: LanguageCode} & PropsWithChildren) => {
  const [translations] = useState<LanguageCode>(data);

  return (
    <LanguageContext.Provider value={translations}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const data = useContext(LanguageContext);
  return data;
};
