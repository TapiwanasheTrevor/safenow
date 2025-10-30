// Re-export from new implementation with adapter for backward compatibility
import locationServiceNew from '@/lib/services/locationService';

class LocationService {
  async getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
    const result = await locationServiceNew.getCurrentLocation();

    if (result.success && result.location) {
      return {
        lat: result.location.latitude,
        lng: result.location.longitude,
      };
    }

    return null;
  }

  async watchLocation(callback: (location: { lat: number; lng: number }) => void): Promise<number> {
    if (!locationServiceNew.isSupported()) {
      return -1;
    }

    const watchId = locationServiceNew.watchPosition(
      (location) => {
        callback({
          lat: location.latitude,
          lng: location.longitude,
        });
      },
      (error) => {
        console.error('Error watching location:', error);
      }
    );

    return watchId || -1;
  }

  clearWatch(watchId: number): void {
    locationServiceNew.clearWatch(watchId);
  }

  formatLocationAsAddress(lat: number, lng: number): string {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

export const locationService = new LocationService();
