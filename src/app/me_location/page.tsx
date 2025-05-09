'use client'

import { useEffect, useState } from 'react'
import { TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import dynamic from 'next/dynamic'

const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

const DynamicMap = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

interface GpsData {
  lat: number
  lon: number
}

interface Hospital {
  name: string
  lat: number
  lon: number
  address?: string
  phone?: string
  openingHours?: string
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

export default function MapPage() {
  const [gpsData, setGpsData] = useState<GpsData | null>(null)
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsData({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError('Không thể lấy vị trí: ' + err.message)
        setLoading(false)
      }
    )
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsData({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError('Không thể lấy vị trí: ' + err.message);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!gpsData) return;

      try {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:3000,${gpsData.lat},${gpsData.lon});out;`;
        const res = await fetch(overpassUrl);

        if (!res.ok) {
          throw new Error('Không thể tải dữ liệu bệnh viện');
        }

        const json = await res.json();

        const result: Hospital[] = json.elements.map((el: OverpassHospitalElement) => ({
          name: el.tags.name || 'Bệnh viện không tên',
          lat: el.lat,
          lon: el.lon,
          address: [
            el.tags['addr:housenumber'],
            el.tags['addr:street'],
            el.tags['addr:city'],
          ]
            .filter(Boolean)
            .join(', '),
          phone: el.tags.phone || 'Không có',
          openingHours: el.tags.opening_hours || 'Không rõ',
        }));

        setHospitals(result);
      } catch (err) {
        setError('Lỗi tìm bệnh viện: ' + err.message);
        console.error('Lỗi tìm bệnh viện:', err);
      }
    };

    fetchHospitals();
  }, [gpsData]);

  const getRoute = async (destLat: number, destLon: number) => {
    if (!gpsData) return;

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${gpsData.lon},${gpsData.lat};${destLon},${destLat}?overview=full&geometries=geojson`
      );

      if (!res.ok) {
        throw new Error('Không thể lấy đường đi');
      }

      const json = await res.json();
      const coords = json.routes[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );
      setRouteCoords(coords);
    } catch (err) {
      setError('Lỗi lấy đường đi: ' + err.message);
      console.error('Lỗi lấy đường đi:', err);
    }
  };


  if (loading) return <div className="text-center p-4">Đang tải vị trí...</div>
  if (error) return <div className="text-red-500 text-center p-4">Lỗi: {error}</div>
  if (!gpsData) return <div className="text-center p-4">Không có dữ liệu vị trí</div>

  return (
    <div className="h-[600px] w-full mt-1 relative z-10">
      <DynamicMap center={[gpsData.lat, gpsData.lon]} zoom={13} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[gpsData.lat, gpsData.lon]}>
          <Popup>
            <div>
              <h3 className="font-bold">Vị trí hiện tại</h3>
              <p>Latitude: {gpsData.lat.toFixed(6)}</p>
              <p>Longitude: {gpsData.lon.toFixed(6)}</p>
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
    </div>
  )
}
