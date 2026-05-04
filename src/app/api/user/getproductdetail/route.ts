import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');

  if (!product_id) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories:subcategory_id (
          id,
          name,
          parent_id,
          parent:parent_id (
            id,
            name
          )
        ),
        product_variants (
          *,
          variant_sizes (*),
          product_images (*)
        )
      `)
      .eq('id', product_id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
