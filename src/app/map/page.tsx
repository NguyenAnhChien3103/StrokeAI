"use client";
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  useEffect(() => {
    const map = L.map('map').setView([51.505, -0.09], 13); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude]).addTo(map)
          .bindPopup("You are here")
          .openPopup();

        const userId = sessionStorage.getItem('userId');
        
        if (userId) {
          saveGpsData(userId, latitude, longitude);
        }
      });
    }
  }, []);

  const saveGpsData = async (userId, lat, lng) => {
    const response = await fetch('http://localhost:5062/api/user_gps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId: userId,
        Lat: lat,
        Long: lng,
      }),
    });

    if (response.ok) {
      console.log('GPS data saved successfully.');
    } else {
      console.error('Failed to save GPS data.');
    }
  };

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default MapComponent;
