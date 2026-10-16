export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export const LOCALITY_COORDINATES: Record<string, GeoCoordinates> = {
  Dharampeth: { lat: 21.1442, lng: 79.0601 },
  Dhantoli: { lat: 21.1292, lng: 79.0831 },
  Ramdaspeth: { lat: 21.1351, lng: 79.0722 },
  Sitabuldi: { lat: 21.1462, lng: 79.0881 },
  Sadar: { lat: 21.1610, lng: 79.0815 },
  'Wardha Road': { lat: 21.1150, lng: 79.0620 },
  'Medical Square': { lat: 21.1265, lng: 79.0963 },
  Mankapur: { lat: 21.1895, lng: 79.0825 },
  'Laxmi Nagar': { lat: 21.1230, lng: 79.0680 },
};

/**
 * Calculates Haversine distance in kilometers between two coordinates
 */
export function calculateHaversineDistance(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimate transit time by car in Nagpur city traffic (~22 km/h avg)
 */
export function estimateDrivingMinutes(distanceKm: number): number {
  if (distanceKm <= 0.1) return 1;
  const avgSpeedKmH = 22;
  const timeMinutes = Math.round((distanceKm / avgSpeedKmH) * 60) + 3; // +3 min buffer
  return Math.max(3, timeMinutes);
}

/**
 * Generate Google Maps Directions URL
 */
export function getGoogleMapsDirectionsUrl(
  destination: GeoCoordinates,
  destinationName: string,
  userLocation?: GeoCoordinates | null
): string {
  if (userLocation) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    destinationName + ' Nagpur Maharashtra'
  )}`;
}

/**
 * Request real browser location
 */
export function getUserBrowserLocation(): Promise<GeoCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access permission was denied.'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable.'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'));
            break;
          default:
            reject(new Error('An unknown error occurred while retrieving location.'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
