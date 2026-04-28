import { mockDriverLoads, mockShipperLoads } from './mock-data';
import { getDistance } from './utils';

export type LoadStatus = 'pending' | 'accepted' | 'in_transit' | 'completed';

export interface Load {
  id: string;
  from: string;
  to: string;
  distance: string;
  distanceValue: number; // For calculations
  weight: string;
  goodsType: string;
  price: string;
  priceValue: number; // For calculations
  timeEstimate: string;
  tag: string;
  status: LoadStatus;
  acceptedBy?: string;
  postedAt?: string;
}

// Convert mock data string price like "₹8,500" or distance "148 km" to numbers
function parseNumber(str: string): number {
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

// Initialize store using global to persist across Next.js dev server hot-reloads
const globalStore = global as typeof globalThis & {
  __loads: Load[];
};

if (!globalStore.__loads) {
  const initialLoads: Load[] = mockDriverLoads.map((l) => ({
    ...l,
    distanceValue: parseNumber(l.distance),
    priceValue: parseNumber(l.price),
    status: 'pending',
  }));

  const initialShipperLoads: Load[] = mockShipperLoads.map((sl) => ({
    id: sl.id,
    from: sl.from,
    to: sl.to,
    distance: `${getDistance(sl.from, sl.to)} km`,
    distanceValue: getDistance(sl.from, sl.to),
    weight: sl.weight,
    goodsType: 'Mixed', // Default for shipper
    price: sl.price,
    priceValue: parseNumber(sl.price),
    timeEstimate: '6-8 hours',
    tag: 'New',
    status: sl.status.toLowerCase() === 'pending' ? 'pending' : (sl.status.toLowerCase().replace(' ', '_') as LoadStatus),
    postedAt: sl.postedAt,
  }));

  globalStore.__loads = [...initialLoads, ...initialShipperLoads.filter(sl => sl.status === 'pending')];
}

export function getLoads(): Load[] {
  return globalStore.__loads;
}

export function addLoad(load: Omit<Load, 'id' | 'status' | 'distanceValue' | 'priceValue'> & { status?: LoadStatus }) {
  const newLoad: Load = {
    ...load,
    id: `L-${Date.now().toString().slice(-6)}`,
    status: load.status || 'pending',
    distanceValue: parseNumber(load.distance),
    priceValue: parseNumber(load.price),
  };
  globalStore.__loads.unshift(newLoad); // Add to top
  return newLoad;
}

export function acceptLoad(id: string, driverId: string) {
  const loads = globalStore.__loads;
  const index = loads.findIndex(l => l.id === id);
  if (index !== -1) {
    loads[index] = { ...loads[index], status: 'accepted', acceptedBy: driverId };
    return loads[index];
  }
  return null;
}
