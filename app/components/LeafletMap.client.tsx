import {Avatar, MantineProvider} from '@mantine/core';
import L, {divIcon, point, type LatLngTuple} from 'leaflet';
import {useEffect} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet';
import {type TreatmentsForCollectionFragment} from 'storefrontapi.generated';
import {type CustomerLocationAllOfGeoLocation} from '~/lib/api/model';

export type Coordinates = {
  lat: number;
  lng: number;
  image: string;
};

export const createClusterCustomIcon = (source: string) => {
  return divIcon({
    html: renderToStaticMarkup(
      <MantineProvider>
        <Avatar src={source} size="md" style={{border: '1px solid #fff'}} />
      </MantineProvider>,
    ),
    iconSize: point(40, 40, true),
  });
};

const AutoCenterMap = ({markers}: {markers: Coordinates[]}) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds, {padding: [100, 100]});
    }
  }, [markers, map]);

  return null;
};

export function LeafletMap({
  products,
}: {
  products: TreatmentsForCollectionFragment[];
}) {
  const position: LatLngTuple = [51.505, -0.09];

  const geoLocations = products.reduce((geos, product) => {
    const newGeos = product.locations?.references?.nodes.reduce((geos, l) => {
      if (l.geoLocation?.value) {
        const value = JSON.parse(
          l.geoLocation.value,
        ) as CustomerLocationAllOfGeoLocation;
        geos.push({
          lat: value.coordinates[1],
          lng: value.coordinates[0],
          image: product.user?.reference?.image?.reference?.image?.url || '',
        });
      }
      return geos;
    }, [] as Coordinates[]);
    if (newGeos) {
      geos.push(...newGeos);
    }
    return geos;
  }, [] as Coordinates[]);

  return (
    <div
      style={{
        height: '100vh',
        border: '1px solid #dee2e6',
        borderRadius: '10px',
      }}
    >
      <MapContainer
        style={{
          height: '100%',
          borderRadius: '10px',
        }}
        zoom={6}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoLocations.map((geo) => {
          return (
            <Marker
              key={geo.lat + geo.lng}
              position={geo}
              icon={createClusterCustomIcon(geo.image)}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          );
        })}
        <AutoCenterMap markers={geoLocations} />
      </MapContainer>
    </div>
  );
}
