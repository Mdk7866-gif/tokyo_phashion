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

    // Step 1: Update product name/description
    const { error: productErr } = await supabaseAdmin
      .from('products')
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (productErr) throw productErr;

    // Step 2: Process all variants concurrently
    if (Array.isArray(variants) && variants.length > 0) {
      await Promise.all(
        variants.map(async (variant: {
          id: string | null;
          color: string;
          sizes: { size: string; original_price: number; discount_price: number; stock: number }[];
          images: { url: string }[];
        }) => {
          // Resolve variantId as a definite string before any DB work
          let variantId: string;

          if (!variant.id) {
            const { data: newVar, error: varErr } = await supabaseAdmin
              .from('product_variants')
              .insert({ product_id: id, color: variant.color })
              .select('id')
              .single();
            if (varErr) throw varErr;
            variantId = newVar.id;
          } else {
            variantId = variant.id;
            const { error: varErr } = await supabaseAdmin
              .from('product_variants')
              .update({ color: variant.color, updated_at: new Date().toISOString() })
              .eq('id', variantId);
            if (varErr) throw varErr;
          }

          // Sizes and images are independent — run in parallel
          await Promise.all([

            // ── SIZES ──────────────────────────────────────────────────────────
            // Cannot delete+reinsert: order_items.variant_size_id has a hard FK
            // to variant_sizes.id. Deleting referenced rows causes error 23503.
            // Solution: UPSERT by (product_variant_id, size) unique key so IDs
            // are preserved in-place, then handle removed sizes separately.
            (async () => {
              if (variant.sizes?.length > 0) {
                const { error: upsertErr } = await supabaseAdmin
                  .from('variant_sizes')
                  .upsert(
                    variant.sizes.map(s => ({
                      product_variant_id: variantId,
                      size: s.size,
                      original_price: s.original_price,
                      discount_price: s.discount_price,
                      stock: s.stock,
                      deleted_at: null,                       // re-activate if previously soft-deleted
                      updated_at: new Date().toISOString(),
                    })),
                    { onConflict: 'product_variant_id,size' } // unique index in schema
                  );
                if (upsertErr) throw upsertErr;
              }

              // Find active sizes in DB that are no longer in the payload
              const { data: existingSizes } = await supabaseAdmin
                .from('variant_sizes')
                .select('id, size')
                .eq('product_variant_id', variantId)
                .is('deleted_at', null);

              const keptSizeNames = new Set((variant.sizes || []).map(s => s.size));
              const toRemove = (existingSizes || []).filter(r => !keptSizeNames.has(r.size));

              // Try hard-delete; fall back to soft-delete if order_items references it
              await Promise.all(toRemove.map(async row => {
                const { error: delErr } = await supabaseAdmin
                  .from('variant_sizes')
                  .delete()
                  .eq('id', row.id);

                if (delErr?.code === '23503') {
                  // Referenced by an existing order — soft-delete so it's hidden
                  // from the shop but order history remains intact
                  await supabaseAdmin
                    .from('variant_sizes')
                    .update({ stock: 0, deleted_at: new Date().toISOString() })
                    .eq('id', row.id);
                } else if (delErr) {
                  throw delErr;
                }
              }));
            })(),

            // ── IMAGES ─────────────────────────────────────────────────────────
            // Safe to delete+reinsert: no FK from order_items → product_images
            (async () => {
              const { error: delErr } = await supabaseAdmin
                .from('product_images')
                .delete()
                .eq('product_variant_id', variantId);
              if (delErr) throw delErr;
              if (variant.images?.length > 0) {
                const { error: insErr } = await supabaseAdmin
                  .from('product_images')
                  .insert(variant.images.map((img, idx) => ({
                    product_variant_id: variantId,
                    image_url: img.url,
                    sort_order: idx,
                  })));
                if (insErr) throw insErr;
              }
            })(),
          ]);
        })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[crudproduct PATCH]', error);
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
