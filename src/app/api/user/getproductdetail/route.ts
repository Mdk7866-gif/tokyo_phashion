import { NextResponse } from 'next/server';
import { fetchShareProduct as getProductDetail } from '@/app/admin/shareproduct/route';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');

  if (!product_id) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  const { data, error } = await getProductDetail(product_id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
