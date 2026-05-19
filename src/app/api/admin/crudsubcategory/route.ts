import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// CREATE
export async function POST(request: Request) {
  try {
    const { category_id, name } = await request.json();
    const { data, error } = await supabaseAdmin.from('subcategories').insert([{ category_id, name: name.toLowerCase() }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json();
    const { data, error } = await supabaseAdmin.from('subcategories').update({ name: name.toLowerCase() }).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Fail-fast optimization: check if any products in this subcategory are in order_items
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('subcategory_id', id);

    if (products && products.length > 0) {
      const productIds = products.map(p => p.id);
      const { count } = await supabaseAdmin
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .in('product_id', productIds);

      if (count && count > 0) {
        return NextResponse.json(
          { error: "violates foreign key constraint: order_items reference these products" },
          { status: 400 }
        );
      }
    }

    const { error } = await supabaseAdmin.from('subcategories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
