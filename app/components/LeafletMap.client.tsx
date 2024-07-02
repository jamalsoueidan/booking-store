import {Avatar, Box, MantineProvider} from '@mantine/core';
import L, {divIcon, point} from 'leaflet';
import {useEffect} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';

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
      map.fitBounds(bounds, {padding: [1000, 1000]});
      map.zoomOut(12);
    }
  }, [markers, map]);

  return null;
};

export type LeafletMapMarker = {
  id: string;
  lng: number;
  lat: number;
  image: string;
  radius: number | null;
};

export function LeafletMap({markers}: {markers: Array<LeafletMapMarker>}) {
  return (
    <Box h="250px">
      <MapContainer
        style={{
          height: '100%',
        }}
        zoom={6}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((geo) =>
          geo.radius ? (
            <Circle
              key={geo.lat}
              color="red"
              fillColor="#f04"
              fillOpacity={0.5}
              radius={geo.radius}
              center={[geo.lat, geo.lng]}
            >
              <Popup>Kører ud til de her områder.</Popup>
            </Circle>
          ) : (
            <Marker
              key={geo.lng}
              position={[geo.lat, geo.lng]}
              icon={createClusterCustomIcon(geo.image)}
            >
              <Popup>Salon/Hjem position.</Popup>
            </Marker>
          ),
        )}
        <AutoCenterMap markers={markers} />
      </MapContainer>
    </Box>
  );
}
