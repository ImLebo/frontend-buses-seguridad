import { useState, useEffect, useRef, useCallback } from 'react';
import { paraderoService, type ParaderoCercano } from '../../services/business/paraderoService';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useParaderosCercanos = (radioMeters: number = 1000) => {
  const [data, setData] = useState<ParaderoCercano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const lastQueryLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  const fetchCercanos = useCallback(async (lat: number, lng: number, force: boolean = false) => {
    if (!force && lastQueryLocationRef.current) {
      const dist = calculateDistance(
        lastQueryLocationRef.current.lat,
        lastQueryLocationRef.current.lng,
        lat,
        lng
      );
      if (dist < 20) {
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await paraderoService.getCercanos(lat, lng, radioMeters);
      setData(response);
      lastQueryLocationRef.current = { lat, lng };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar paraderos cercanos');
    } finally {
      setLoading(false);
    }
  }, [radioMeters]);

  const handleRefresh = useCallback(() => {
    if (userLocation) {
      void fetchCercanos(userLocation.lat, userLocation.lng, true);
    }
  }, [userLocation, fetchCercanos]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por este navegador.');
      setPermissionState('denied');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setPermissionState('granted');
        setUserLocation({ lat, lng });
        void fetchCercanos(lat, lng);
      },
      (geoError) => {
        setLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('Permiso de ubicación GPS denegado por el usuario.');
            setPermissionState('denied');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('La información de ubicación no está disponible.');
            break;
          case geoError.TIMEOUT:
            setError('Tiempo de espera agotado al obtener la ubicación.');
            break;
          default:
            setError('Error desconocido de geolocalización.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [fetchCercanos]);

  useEffect(() => {
    if (userLocation) {
      void fetchCercanos(userLocation.lat, userLocation.lng, true);
    }
  }, [radioMeters]);

  return {
    data,
    loading,
    error,
    permissionState,
    userLocation,
    refresh: handleRefresh,
  };
};

export default useParaderosCercanos;
