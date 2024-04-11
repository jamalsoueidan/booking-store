import React from 'react';
import {type User} from '~/lib/api/model';

const UserContext = React.createContext<User>({
  aboutMe: '',
  customerId: 123,
  email: '',
  fullname: '',
  gender: '',
  images: {},
  phone: '12',
  professions: [],
  specialties: [],
  speaks: [],
  shortDescription: '',
  username: '',
  social: {},
  yearsExperience: '3',
  theme: {color: 'pink'},
  active: true,
  isBusiness: false,
});

export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  return (
    <UserContext.Provider
      value={{...user, theme: {color: user.theme?.color || 'pink'}}}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
