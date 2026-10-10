import { calculateDistanceKm } from '../utils/geo';

describe('Geo Distance Utilities', () => {
  it('should correctly calculate distance between two coordinates', () => {
    // San Francisco (37.7749, -122.4194) to Oakland (37.8044, -122.2712) ~ 13-14 km
    const distance = calculateDistanceKm(37.7749, -122.4194, 37.8044, -122.2712);
    expect(distance).toBeGreaterThan(12);
    expect(distance).toBeLessThan(16);
  });

  it('should return 0 for identical coordinates', () => {
    const distance = calculateDistanceKm(37.7749, -122.4194, 37.7749, -122.4194);
    expect(distance).toBe(0);
  });
});
