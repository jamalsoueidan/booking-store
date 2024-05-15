import React from 'react';
import {type ArtistUserFragment} from 'storefrontapi.generated';
import {useUserMetaobject} from './useUserMetaobject';

const UserContext = React.createContext<ArtistUserFragment | null | undefined>(
  null,
);

export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: ArtistUserFragment | null;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }

  return useUserMetaobject(context);
};
