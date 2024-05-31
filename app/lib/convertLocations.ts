import type {LocationFragment} from 'storefrontapi.generated';
import type {CustomerLocation} from './api/model';

export const convertLocations = (nodes?: LocationFragment[]) => {
  return (
    nodes?.reduce((items, node) => {
      const name = String(node.name?.value);
      const city = String(node.city?.value);
      const country = String(node.country?.value);
      const distanceForFree = parseInt(node.distanceForFree?.value || '');
      const distanceHourlyRate = parseInt(node.distanceHourlyRate?.value || '');
      const fixedRatePerKm = parseInt(node.fixedRatePerKm?.value || '');
      const minDriveDistance = parseInt(node.minDriveDistance?.value || '');
      const maxDriveDistance = parseInt(node.maxDriveDistance?.value || '');
      const fullAddress = String(node.fullAddress?.value);
      const locationType = String(node.locationType?.value) as any;
      const originType = String(node.originType?.value) as any;

      items.push({
        _id: node.handle,
        customerId: '0',
        geoLocation: {
          coordinates: [0, 0],
          type: 'Point',
        },
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
        originType,
        startFee: 12,
      });
      return items;
    }, [] as Array<CustomerLocation>) || []
  );
};
