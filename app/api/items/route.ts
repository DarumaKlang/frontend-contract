import { NextResponse } from 'next/server';

const demoItems = [
  { id: 1, name: 'สินค้า A' },
  { id: 2, name: 'สินค้า B' },
  { id: 3, name: 'สินค้า C' },
];

export async function GET() {
  return NextResponse.json(demoItems);
}
