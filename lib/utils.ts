import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cityDistances: Record<string, Record<string, number>> = {
  'Mumbai': { 'Pune': 150, 'Nashik': 165, 'Navi Mumbai': 20, 'Thane': 25, 'Aurangabad': 335, 'Belgaum': 480 },
  'Pune': { 'Mumbai': 150, 'Nashik': 210, 'Navi Mumbai': 130, 'Thane': 155, 'Aurangabad': 235, 'Belgaum': 335 },
  'Navi Mumbai': { 'Pune': 130, 'Mumbai': 20, 'Nashik': 150, 'Thane': 15, 'Aurangabad': 320 },
  'Nashik': { 'Mumbai': 165, 'Pune': 210, 'Navi Mumbai': 150, 'Thane': 145 },
};

export function getDistance(cityA: string, cityB: string): number {
  if (cityA === cityB) return 0;
  if (cityDistances[cityA] && cityDistances[cityA][cityB]) return cityDistances[cityA][cityB];
  if (cityDistances[cityB] && cityDistances[cityB][cityA]) return cityDistances[cityB][cityA];
  
  // Fallback: procedural random but deterministic distance based on basic char codes
  const fallback = Math.abs(cityA.charCodeAt(0) - cityB.charCodeAt(0)) * 50 + 100;
  return fallback;
}
