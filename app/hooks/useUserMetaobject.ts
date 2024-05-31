import type {
  UserFragment,
  UserLocationsFragment,
  UserSchedulesFragment,
} from 'storefrontapi.generated';

export const useUserMetaobject = (
  user?: (UserFragment & UserSchedulesFragment & UserLocationsFragment) | null,
) => {
  const username = user?.username?.value;

  const fullname = user?.fullname?.value;

  const shortDescription = user?.shortDescription?.value;

  const {professions} = user?.professions?.value
    ? (JSON.parse(user?.professions?.value) as Record<string, []>)
    : {professions: []};

  const {specialties} = user?.specialties?.value
    ? (JSON.parse(user?.specialties?.value) as Record<string, []>)
    : {specialties: []};

  const social = user?.social?.value
    ? (JSON.parse(user?.social?.value) as Record<string, string>)
    : {};

  const theme = user?.theme?.value || 'pink';

  const aboutMe = user?.aboutMe?.value;

  const schedules = user?.schedules?.references?.nodes;
  const locations = user?.locations?.references?.nodes;

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
    professions,
    social,
    specialties,
    active,
    schedules,
    locations,
    shortDescription,
    aboutMe,
  };
};
