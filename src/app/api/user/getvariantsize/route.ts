import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('variant_sizes')
      .select(`
        id, size, discount_price, original_price, stock,
        product_variants (
          id, color,
          product_images ( image_url, sort_order ),
          products ( id, name )
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Variant size not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('getvariantsize error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
