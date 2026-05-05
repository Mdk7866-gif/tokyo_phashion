import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sub_id = searchParams.get('sub_id');
  const product_id = searchParams.get('product_id');

  try {
    if (product_id) {
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
        .eq('id', product_id)
        .is('deleted_at', null)
        .single();
      if (error) throw error;
      return NextResponse.json({ data });
    }

    if (sub_id) {
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
        .eq('subcategory_id', sub_id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Missing sub_id or product_id" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subcategory_id, name, description, variants } = body;

    // 1. Create Product
    const { data: product, error: productErr } = await supabaseAdmin
      .from('products')
      .insert({ subcategory_id, name, description })
      .select()
      .single();
    if (productErr) throw productErr;

    // 2. Create Variants
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (!variant.color) continue;
        const { data: prodVar, error: varErr } = await supabaseAdmin
          .from('product_variants')
          .insert({ product_id: product.id, color: variant.color })
          .select()
          .single();
        if (varErr) throw varErr;

        // 3. Create Sizes
        if (variant.sizes && variant.sizes.length > 0) {
          const sizesData = variant.sizes.map((s: { size: string; original_price: number; discount_price: number; stock: number }) => ({
            product_variant_id: prodVar.id,
            size: s.size,
            original_price: s.original_price,
            discount_price: s.discount_price,
            stock: s.stock
          }));
          const { error: sizeErr } = await supabaseAdmin.from('variant_sizes').insert(sizesData);
          if (sizeErr) throw sizeErr;
        }

        // 4. Create Images
        if (variant.images && variant.images.length > 0) {
          const imagesData = variant.images.map((img: { url: string }, idx: number) => ({
            product_variant_id: prodVar.id,
            image_url: img.url,
            sort_order: idx
          }));
          const { error: imgErr } = await supabaseAdmin.from('product_images').insert(imagesData);
          if (imgErr) throw imgErr;
        }
      }
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, variants } = body;

    // 1. Update Product
    if (name || description) {
      const { error: productErr } = await supabaseAdmin
        .from('products')
        .update({ name, description, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (productErr) throw productErr;
    }

    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        let variantId = variant.id;

        // 2. Insert or Update Variant
        if (!variantId) {
          const { data: newVar, error: varErr } = await supabaseAdmin
            .from('product_variants')
            .insert({ product_id: id, color: variant.color })
            .select()
            .single();
          if (varErr) throw varErr;
          variantId = newVar.id;
        } else {
           const { error: varErr } = await supabaseAdmin
            .from('product_variants')
            .update({ color: variant.color, updated_at: new Date().toISOString() })
            .eq('id', variantId);
          if (varErr) throw varErr;
        }

        // 3. Sync Sizes (Delete old sizes and insert new ones)
        if (variant.sizes) {
           await supabaseAdmin.from('variant_sizes').delete().eq('product_variant_id', variantId);
           if (variant.sizes.length > 0) {
             const sizesData = variant.sizes.map((s: { size: string; original_price: number; discount_price: number; stock: number }) => ({
               product_variant_id: variantId,
               size: s.size,
               original_price: s.original_price,
               discount_price: s.discount_price,
               stock: s.stock
             }));
             const { error: sizeErr } = await supabaseAdmin.from('variant_sizes').insert(sizesData);
             if (sizeErr) throw sizeErr;
           }
        }

        // 4. Sync Images (Delete old images and insert new ones)
        if (variant.images) {
           await supabaseAdmin.from('product_images').delete().eq('product_variant_id', variantId);
           if (variant.images.length > 0) {
             const imagesData = variant.images.map((img: { url: string }, idx: number) => ({
               product_variant_id: variantId,
               image_url: img.url,
               sort_order: idx
             }));
             const { error: imgErr } = await supabaseAdmin.from('product_images').insert(imagesData);
             if (imgErr) throw imgErr;
           }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
