import { NextResponse } from 'next/server';
import { acceptLoad } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { loadId, driverId } = await request.json();
    
    if (!loadId) {
      return NextResponse.json({ error: 'Load ID is required' }, { status: 400 });
    }
    
    const acceptedLoad = acceptLoad(loadId, driverId || 'current_driver_123');
    
    if (!acceptedLoad) {
      return NextResponse.json({ error: 'Load not found' }, { status: 404 });
    }
    
    return NextResponse.json(acceptedLoad);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to accept load' }, { status: 400 });
  }
}
