import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function fetchShareProduct(productId: string) {
  if (!productId) return { data: null, error: "Missing product_id" };

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants (
          *,
          variant_sizes (*),
          product_images (*)
        )
      `)
      .eq('id', productId)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return { data: null, error: message };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');

  if (!product_id) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  const { data, error } = await fetchShareProduct(product_id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}
