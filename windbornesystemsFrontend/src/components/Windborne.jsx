import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: 'calc(100vw - 20px)',
  height: 'calc(100vh - 140px)',
  margin: '10px',
  boxSizing: 'border-box',
  borderRadius: '8px',
  overflow: 'hidden',
};

const center = {
  lat: 0,
  lng: 0,
};

const options = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
                 '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
                ];

const Windborne = () => {
  const [selected, setSelected] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [geoPoints, setGeoPoints] = useState([]);
  const [selectedOption, setSelectedOption] = useState('00');

  useEffect(() => {
    const url = `https://windborne-rm80.onrender.com/windborne/${selectedOption}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((json) => setGeoPoints(json))
      .catch((error) => console.error('Error fetching JSON:', error));
  }, [selectedOption]);

  const handleMarkerClick = async (lat, lng, alt) => {
    setSelected({ lat, lng, alt });
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setLocationName(results[0].formatted_address);
      } else {
        setLocationName('Unknown location');
      }
    });
  };

  return (
    <div>
      {/* Description */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px 16px',
          marginTop: '10px',
          borderRadius: '6px',
          maxWidth: '95%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        00 is the current position and 01 is the position of one hour ago, 03 is the position of three hours ago, etc.
      </div>

      {/* Dropdown */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Map */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
          {geoPoints.map(([lat, lng, alt], idx) => (
            <Marker
              key={idx}
              position={{ lat, lng }}
              onClick={() => handleMarkerClick(lat, lng, alt)}
            />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
                setLocationName('');
              }}
            >
              <div>
                <strong>Location:</strong> {locationName}<br />
                <strong>Latitude:</strong> {selected.lat.toFixed(2)}<br />
                <strong>Longitude:</strong> {selected.lng.toFixed(2)}<br />
                <strong>Altitude:</strong> {selected.alt.toFixed(2)}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Windborne;