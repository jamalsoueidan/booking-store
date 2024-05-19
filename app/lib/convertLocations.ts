import type {LocationFragment} from 'storefrontapi.generated';
import type {CustomerLocation} from './api/model';

export const convertLocations = (nodes?: LocationFragment[]) => {
  return (
    nodes?.reduce((items, {id, handle, fields}) => {
      const name = String(fields.find((p) => p.key === 'city')?.value);
      const city = String(fields.find((p) => p.key === 'city')?.value);
      const country = String(fields.find((p) => p.key === 'country')?.value);
      const distanceForFree = parseInt(
        fields.find((p) => p.key === 'distance_for_free')?.value || '',
      );
      const distanceHourlyRate = parseInt(
        fields.find((p) => p.key === 'distance_hourly_rate')?.value || '',
      );
      const fixedRatePerKm = parseInt(
        fields.find((p) => p.key === 'fixed_rate_per_km')?.value || '',
      );
      const minDriveDistance = parseInt(
        fields.find((p) => p.key === 'min_drive_distance')?.value || '',
      );
      const maxDriveDistance = parseInt(
        fields.find((p) => p.key === 'max_drive_distance')?.value || '',
      );
      const fullAddress = String(
        fields.find((p) => p.key === 'full_address')?.value,
      );

      const locationType = String(
        fields.find((p) => p.key === 'location_type')?.value,
      ) as any;

      const originType = String(
        fields.find((p) => p.key === 'origin_type')?.value,
      ) as any;

      items.push({
        _id: handle,
        customerId: '0',
        geoLocation: {
          coordinates: [0, 0],
          type: 'Point',
        },
        metafieldId: id,
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
