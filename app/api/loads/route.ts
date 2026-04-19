import { NextResponse } from 'next/server';
import { getLoads, addLoad } from "@/lib/store"
import { getDistance } from "@/lib/utils"
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  
  let loads = getLoads();
  if (status) {
    loads = loads.filter(l => l.status === status);
  }
  
  return NextResponse.json(loads);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Add realistic mock fields for Shipper inputs if missing
    const distanceVal = getDistance(body.from, body.to);
    const distanceStr = `${distanceVal} km`;
    
    const newLoad = addLoad({
      from: body.from,
      to: body.to,
      distance: distanceStr,
      weight: body.weight.includes('tons') ? body.weight : `${body.weight} tons`,
      goodsType: body.goodsType || 'General Goods',
      price: body.price.includes('₹') ? body.price : `₹${body.price}`,
      timeEstimate: body.timeEstimate || '6-8 hours',
      tag: 'New',
      status: 'pending',
      postedAt: 'Just now',
    });
    
    return NextResponse.json(newLoad);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post load' }, { status: 400 });
  }
}
