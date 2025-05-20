'use client';

import { useEffect, useState } from 'react';
import { TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import dynamic from 'next/dynamic';

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const DynamicMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

interface Hospital {
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  openingHours?: string;
}

interface OverpassHospitalElement {
  lat: number;
  lon: number;
  tags: {
    name?: string;
    'addr:housenumber'?: string;
    'addr:street'?: string;
    'addr:city'?: string;
    phone?: string;
    opening_hours?: string;
  };
}

interface PatientLocation {
  lat: number;
  lon: number;
  lastUpdated: string;
}

interface MapComponentProps {
  patientLocation: PatientLocation;
}

export default function MapComponent({ patientLocation }: MapComponentProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:3000,${patientLocation.lat},${patientLocation.lon});out;`;
        const res = await fetch(overpassUrl);
        const json = await res.json();

        const result: Hospital[] = json.elements.map((el: OverpassHospitalElement) => ({
          name: el.tags.name || 'Bệnh viện không tên',
          lat: el.lat,
          lon: el.lon,
          address: [
            el.tags['addr:housenumber'],
            el.tags['addr:street'],
            el.tags['addr:city'],
          ].filter(Boolean).join(', '),
          phone: el.tags.phone || 'Không có',
          openingHours: el.tags.opening_hours || 'Không rõ',
        }));
        
        setHospitals(result);
      } catch (err) {
        console.error('Lỗi tìm bệnh viện:', err);
      }
    };

    fetchHospitals();
  }, [patientLocation]);

  const getRoute = async (destLat: number, destLon: number) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${patientLocation.lon},${patientLocation.lat};${destLon},${destLat}?overview=full&geometries=geojson`
      );
      const json = await res.json();
      const coords = json.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );
      setRouteCoords(coords);
    } catch (err) {
      console.error('Lỗi lấy đường đi:', err);
    }
  };

  return (
    <DynamicMap center={[patientLocation.lat, patientLocation.lon]} zoom={13} className="h-full w-full z-0">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[patientLocation.lat, patientLocation.lon]}>
        <Popup>
          <div>
            <h3 className="font-bold">Vị trí bệnh nhân</h3>
            <p>Latitude: {patientLocation.lat.toFixed(6)}</p>
            <p>Longitude: {patientLocation.lon.toFixed(6)}</p>
            <p>Time: {new Date(patientLocation.lastUpdated).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}</p>
          </div>
        </Popup>
      </Marker>

      {hospitals.map((h, index) => (
        <Marker key={index} position={[h.lat, h.lon]}>
          <Popup>
            <div>
              <p className="font-bold">{h.name}</p>
              <p>📍 Địa chỉ: {h.address}</p>
              <p>☎️ SĐT: {h.phone}</p>
              <p>🕐 Giờ mở cửa: {h.openingHours}</p>
              <button
                className="mt-2 text-blue-600 underline"
                onClick={() => getRoute(h.lat, h.lon)}
              >
                Chỉ đường tới đây
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </DynamicMap>
  );
} 