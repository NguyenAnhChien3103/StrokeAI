"use client"; // Đảm bảo chạy trên client-side

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix lỗi icon Leaflet không hiển thị
const icon = L.icon({
  iconUrl: "/marker-icon.png", // Đặt ảnh trong thư mục `public`
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = () => {
  const [position, setPosition] = useState<[number, number]>([16.0471, 108.2062]); // Mặc định Đà Nẵng

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (error) => console.error("Lỗi lấy vị trí:", error)
      );
    }
  }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={icon}>
        <Popup>Vị trí hiện tại của bạn</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
