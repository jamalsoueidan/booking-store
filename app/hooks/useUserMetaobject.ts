import {type UserFragment} from 'storefrontapi.generated';

export const useUserMetaobject = (reference?: UserFragment | null) => {
  const username =
    reference?.fields.find((p) => p.key === 'username')?.value || '';

  const fullname =
    reference?.fields.find((p) => p.key === 'fullname')?.value || '';

  const shortDescription =
    reference?.fields.find((p) => p.key === 'short_description')?.value || '';

  const theme =
    reference?.fields.find((p) => p.key === 'theme')?.value || 'pink';

  const aboutMe =
    reference?.fields.find((p) => p.key === 'about_me')?.value || '';

  const active =
    reference?.fields.find((p) => p.key === 'active')?.value || false;

  const image = reference?.fields.find((p) => p.key === 'image')?.reference || {
    image: {
      width: 150,
      height: 150,
      url: `https://placehold.co/300x300?text=${username}`,
    },
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
