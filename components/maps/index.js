import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from "react-icons/fa";

function MapComponent({ center, onClick }) {
  useMapEvents({
    click: (event) => {
      onClick(event.latlng); // Pass the clicked coordinates to the parent component
    },
  });

  return (
    <Marker position={center}>
      <Popup>Alamat Kamu</Popup>
    </Marker>
  );
}

export default function GeocodingMap({ kelurahan, city, onCoordinateSelect, ifCoordinateSelect }) {
  const [center, setCenter] = useState(null);
  const [shouldUpdateMap, setShouldUpdateMap] = useState(false);
  const [isCoordinateSelected, setIsCoordinateSelected] = useState(false); // Tambahkan state untuk melacak apakah koordinat telah dipilih

  useEffect(() => {
    let timeoutId;

    const fetchCoordinates = async () => {
      const address = `${kelurahan}, ${city.name}`; // Gabungkan kelurahan dan kota menjadi alamat
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}`;
      
      try {
        const response = await axios.get(url);
        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          console.error('Alamat default tidak ditemukan');
          setCenter(null); // Reset center jika alamat tidak ditemukan
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mencari alamat default:', error);
        setCenter(null); // Reset center jika terjadi kesalahan
      }
    };

    if (shouldUpdateMap) {
      fetchCoordinates();
      setShouldUpdateMap(false);
    }

    return () => clearTimeout(timeoutId);
  }, [kelurahan, city, shouldUpdateMap]);

  const handleMapClick = (coordinates) => {
    console.log('Koordinat yang diklik:', coordinates);
    setCenter(coordinates);
    setIsCoordinateSelected(true); // Set state menjadi true saat koordinat dipilih
    onCoordinateSelect();
    ifCoordinateSelect(coordinates); // Panggil properti onCoordinateSelect untuk memberi tahu parent bahwa koordinat telah dipilih
  };

  const debouncedUpdateMap = () => {
    setShouldUpdateMap(true);
  };

  return (
    <div>
      <div className='choose-coordinate' onClick={debouncedUpdateMap}>
        <span>Pilih dulu alamat di peta <FaMapMarkerAlt/></span>
      </div>
      {center && (
        <MapContainer center={center} zoom={13} className='maps-shipping'>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapComponent center={center} onClick={handleMapClick} />
        </MapContainer>
      )}
    </div>
  );
}
