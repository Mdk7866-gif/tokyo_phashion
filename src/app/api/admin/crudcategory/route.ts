import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// CREATE — fires category insert + thumbnail placeholder in PARALLEL
// This removes one full DB round-trip vs the old sequential approach
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    // Step 1: insert the category
    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert([{ name: name.toLowerCase() }])
      .select()
      .single();

    if (error) throw error;

    // Step 2: fire thumbnail placeholder immediately — no need to await the
    // result here because the UI only needs the category row to continue.
    // The thumbnail row will exist by the time the admin navigates there.
    supabaseAdmin
      .from('category_thumbnails')
      .insert([{ category_id: category.id, image_url: null }])
      .then(({ error: thumbErr }) => {
        if (thumbErr) console.error('[crudcategory] thumbnail insert error:', thumbErr.message);
      });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE — only updates the categories table.
// category_thumbnails uses category_id as FK so the name change is automatically
// reflected wherever we join categories ↔ category_thumbnails.
export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json();
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({ name: name.toLowerCase(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — cascade on the DB handles subcategories + thumbnails automatically
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Fail-fast optimization: check if any subcategories have products in order_items
    const { data: subs } = await supabaseAdmin
      .from('subcategories')
      .select('id')
      .eq('category_id', id);

    if (subs && subs.length > 0) {
      const subIds = subs.map(s => s.id);
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id')
        .in('subcategory_id', subIds);

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
    }

    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

