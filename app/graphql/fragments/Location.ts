export const LOCATION_FRAGMENT = `#graphql
  fragment Location on Metaobject {
    id
    handle
    locationType: field(key: "location_type") {
      value
    }
    name: field(key: "name") {
      value
    }
    fullAddress: field(key: "full_address") {
      value
    }
    city: field(key: "city") {
      value
    }
    country: field(key: "country") {
      value
    }
    distanceForFree: field(key: "distance_for_free") {
      value
    }
    distanceHourlyRate: field(key: "distance_hourly_rate") {
      value
    }
    fixedRatePerKm: field(key: "fixed_rate_per_km") {
      value
    }
    minDriveDistance: field(key: "min_drive_distance") {
      value
    }
    maxDriveDistance: field(key: "max_drive_distance") {
      value
    }
    startFee: field(key: "start_fee") {
      value
    }
  }
` as const;
