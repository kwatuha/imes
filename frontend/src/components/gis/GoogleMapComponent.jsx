import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { CircularProgress, Alert, TextField, Box } from '@mui/material';

// Define the Google Maps libraries you'll use
const libraries = ['places'];

function GoogleMapComponent({ children, center, zoom, style, onCreated, onSearchPlaceChanged, onClick }) {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // LOGGING ADDED: Log the API key to the console
  const apiKey = import.meta.env.VITE_MAPS_API_KEY;
  console.log("Google Maps API Key:", apiKey);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const onLoad = useCallback(map => {
    mapRef.current = map;
    setMapLoaded(true);
    if (onCreated) {
      onCreated(map);
    }
  }, [onCreated]);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setMapLoaded(false);
  }, []);

  const onPlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (mapRef.current) {
          mapRef.current.panTo(place.geometry.location);
          mapRef.current.setZoom(15);
        }
        if (onSearchPlaceChanged) {
          onSearchPlaceChanged(place);
        }
      }
    }
  }, [onSearchPlaceChanged]);


  if (loadError) {
    return <Alert severity="error">Error loading Google Maps: {loadError.message}</Alert>;
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: style.height || '500px' }}>
        <CircularProgress />
        <Box sx={{ ml: 2 }}>Loading map...</Box>
      </Box>
    );
  }

  // Ensure mapContainerStyle is a proper object with width and height
  // This is the actual div that Google Maps will render into
  // If style.height is '100%', we need to ensure the parent has explicit height
  // Otherwise use the style height or default
  const getMapContainerHeight = () => {
    if (style?.height === '100%') {
      // For 100% height, we need to ensure the wrapper has proper height
      // The parent container should have explicit height
      return '100%';
    }
    return style?.height || '500px';
  };

  const mapContainerStyle = {
    width: style?.width || '100%',
    height: getMapContainerHeight(),
  };

  // Box wrapper height should match the map container height
  const boxHeight = mapContainerStyle.height;
  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: boxHeight, 
      overflow: 'hidden',
      display: 'block',
      backgroundColor: '#c8e6c9', // Light green background for debugging - should be covered by map
      border: '2px solid #4caf50', // Green border for visibility
      minHeight: boxHeight
    }}>
      <StandaloneSearchBox
        onLoad={ref => searchBoxRef.current = ref}
        onPlacesChanged={onPlacesChanged}
      >
        <TextField
          type="text"
          placeholder="Search for a location..."
          sx={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            position: "absolute",
            left: "50%",
            marginLeft: "-120px",
            top: "10px",
            zIndex: 10,
            backgroundColor: "white",
          }}
        />
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: true,
        }}
      >
        {children}
      </GoogleMap>
    </Box>
  );
}

export default GoogleMapComponent;