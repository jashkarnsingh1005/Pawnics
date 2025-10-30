import React, { useState, useEffect } from 'react';
import styles from './MapIntegration.module.css';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const MapIntegration = ({ onLocationSelect, initialLocation }) => {
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [coordinates, setCoordinates] = useState({
    lat: initialLocation?.lat || 0,
    lng: initialLocation?.lng || 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simple geocoding function (you can replace with Google Maps API or other service)
  const geocodeAddress = async (addressText) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll use a simple mock geocoding
      // In production, you would use Google Maps Geocoding API or similar
      const mockCoordinates = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Mock NYC area
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };
      
      setCoordinates(mockCoordinates);
      
      if (onLocationSelect) {
        onLocationSelect({
          address: addressText,
          lat: mockCoordinates.lat,
          lng: mockCoordinates.lng
        });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    setIsLoading(false);
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCoordinates(coords);
          
          // Reverse geocoding (mock implementation)
          const mockAddress = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
          setAddress(mockAddress);
          
          if (onLocationSelect) {
            onLocationSelect({
              address: mockAddress,
              lat: coords.lat,
              lng: coords.lng
            });
          }
          
          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enter address manually.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      geocodeAddress(address);
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.locationInput}>
        <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address or location..."
            className={styles.addressInput}
            required
          />
          <button type="submit" className={styles.searchBtn} disabled={isLoading}>
            <FaSearch />
          </button>
        </form>
        
        <button 
          type="button" 
          onClick={getCurrentLocation}
          className={styles.currentLocationBtn}
          disabled={isLoading}
        >
          <FaMapMarkerAlt />
          {isLoading ? 'Getting Location...' : 'Use Current Location'}
        </button>
      </div>

      {coordinates.lat !== 0 && coordinates.lng !== 0 && (
        <div className={styles.mapPreview}>
          <div className={styles.coordinatesDisplay}>
            <p><strong>Selected Location:</strong></p>
            <p>Address: {address}</p>
            <p>Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</p>
          </div>
          
          {/* Simple map placeholder - in production, integrate with Google Maps or similar */}
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapMarker}>
              <FaMapMarkerAlt />
            </div>
            <p>Map View</p>
            <small>Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapIntegration;
