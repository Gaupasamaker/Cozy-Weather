import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
}

export const getDeviceLocation = async (): Promise<DeviceCoordinates> => {
  if (Capacitor.isNativePlatform()) {
    const permission = await Geolocation.requestPermissions({ permissions: ['coarseLocation'] });
    if (permission.coarseLocation !== 'granted' && permission.location !== 'granted') {
      throw new Error('Location permission denied');
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 60000
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  }

  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation unavailable');
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 5000,
      maximumAge: 60000,
      enableHighAccuracy: false
    });
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  };
};
