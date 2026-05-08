export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const lat1_rad = lat1 * (Math.PI / 180);
  const lat2_rad = lat2 * (Math.PI / 180);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1_rad) * Math.cos(lat2_rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateSpeed(pos1, pos2, timeDiffSeconds) {
  if (!pos1 || !pos2 || timeDiffSeconds <= 0) return 27600;

  const distance = haversineDistance(
    parseFloat(pos1.latitude), 
    parseFloat(pos1.longitude), 
    parseFloat(pos2.latitude), 
    parseFloat(pos2.longitude)
  );

  const speedKmH = (distance / timeDiffSeconds) * 3600;
  
  if (speedKmH < 1000 || speedKmH > 50000) {
    return 27600;
  }
  
  return Math.round(speedKmH);
}
