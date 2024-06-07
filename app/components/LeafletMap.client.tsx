import type {LatLngTuple} from 'leaflet';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';

export function LeafletMap() {
  const position: LatLngTuple = [51.505, -0.09];

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
        center={position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
