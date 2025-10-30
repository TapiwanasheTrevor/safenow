// Location Service - Geolocation API wrapper
// Handles GPS location tracking for emergency alerts

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export interface LocationResult {
  success: boolean;
  location?: LocationCoordinates;
  error?: string;
}

class LocationService {
  private currentLocation: LocationCoordinates | null = null;

  // Check if Geolocation API is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current location
  async getCurrentLocation(): Promise<LocationResult> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'Geolocation is not supported by this browser',
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          };

          this.currentLocation = location;

          resolve({
            success: true,
            location,
          });
        },
        (error) => {
          let errorMessage = 'Unable to get location';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }

          resolve({
            success: false,
            error: errorMessage,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  // Request location permission
  async requestPermission(): Promise<PermissionState | 'unknown'> {
    try {
      if (!('permissions' in navigator)) {
        return 'unknown';
      }

      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      console.error('Error checking location permission:', error);
      return 'unknown';
    }
  }

  // Format location as Google Maps link
  getMapLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  // Get human-readable address from coordinates (requires online)
  async getReverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (!response.ok) {
        return 'Address unavailable (offline)';
      }

      const data = await response.json();
      return data.display_name || 'Address unavailable';
    } catch (error) {
      // Offline or API error
      return 'Address unavailable (offline)';
    }
  }

  // Format coordinates for display
  formatCoordinates(location: LocationCoordinates): string {
    return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get cached location (last known)
  getCachedLocation(): LocationCoordinates | null {
    return this.currentLocation;
  }

  // Watch position continuously (for future features)
  watchPosition(
    onSuccess: (location: LocationCoordinates) => void,
    onError: (error: string) => void
  ): number | null {
    if (!this.isSupported()) {
      onError('Geolocation not supported');
      return null;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };

        this.currentLocation = location;
        onSuccess(location);
      },
      (error) => {
        onError(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

  // Stop watching position
  clearWatch(watchId: number): void {
    navigator.geolocation.clearWatch(watchId);
  }
}

// Export singleton instance
const locationService = new LocationService();
export default locationService;
