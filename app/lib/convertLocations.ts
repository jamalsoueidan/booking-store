import type {LocationFragment} from 'storefrontapi.generated';
import type {
  CustomerLocation,
  CustomerLocationAllOfGeoLocation,
  CustomerLocationBaseLocationType,
} from './api/model';

export const convertToLocation = (node: LocationFragment) => {
  const name = String(node.name?.value);
  const city = String(node.city?.value);
  const country = String(node.country?.value);
  const distanceForFree = parseInt(node.distanceForFree?.value || '');
  const distanceHourlyRate = parseInt(node.distanceHourlyRate?.value || '');
  const fixedRatePerKm = parseInt(node.fixedRatePerKm?.value || '');
  const minDriveDistance = parseInt(node.minDriveDistance?.value || '');
  const maxDriveDistance = parseInt(node.maxDriveDistance?.value || '');
  const startFee = parseInt(node.startFee?.value || '');
  const fullAddress = String(node.fullAddress?.value);
  const locationType = String(
    node.locationType?.value,
  ) as CustomerLocationBaseLocationType;
  const geoLocation = JSON.stringify(
    node.geoLocation?.value || '',
  ) as unknown as CustomerLocationAllOfGeoLocation;

  return {
    _id: node.handle,
    customerId: '0',
    geoLocation,
    metafieldId: node.id,
    distanceForFree,
    distanceHourlyRate,
    fixedRatePerKm,
    fullAddress,
    city,
    country,
    locationType,
    maxDriveDistance,
    minDriveDistance,
    name,
    startFee,
  };
};
export const convertLocations = (nodes?: LocationFragment[]) => {
  return (
    nodes?.reduce((items, node) => {
      items.push(convertToLocation(node));
      return items;
    }, [] as Array<CustomerLocation>) || []
  );
};
