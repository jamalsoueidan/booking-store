import {type UserFragment} from 'storefrontapi.generated';

export const useUserMetaobject = (user?: UserFragment | null) => {
  const username = user?.username?.value;

  const fullname = user?.fullname?.value;

  const shortDescription = user?.shortDescription?.value;

  const theme = user?.theme?.value || 'pink';

  const aboutMe = user?.aboutMe?.value;

  const active = user?.active?.value?.toLowerCase() === 'true';

  const image = user?.image?.reference?.image || {
    width: 150,
    height: 150,
    url: `https://placehold.co/300x300?text=${username}`,
  };

  return {
    username,
    fullname,
    image,
    theme,
    active,
    shortDescription,
    aboutMe,
  };
};
