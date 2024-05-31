import React from 'react';
import type {
  UserFragment,
  UserLocationsFragment,
  UserSchedulesFragment,
} from 'storefrontapi.generated';
import {useUserMetaobject} from './useUserMetaobject';

const UserContext = React.createContext<
  | (UserFragment & UserSchedulesFragment & UserLocationsFragment)
  | null
  | undefined
>(null);

export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: (UserFragment & UserSchedulesFragment) | null;
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
