import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get('category_id');
    const subcategory_ids = searchParams.get('subcategory_ids'); // comma separated
    const sort = searchParams.get('sort'); // 'newest', 'price_low', 'price_high'

    if (!category_id) {
      return NextResponse.json({ error: 'Missing category_id' }, { status: 400 });
    }

    // Step 1: Get all subcategories for this category if none provided
    let subsToQuery: string[] = [];
    if (subcategory_ids) {
      subsToQuery = subcategory_ids.split(',').filter(Boolean);
    } else {
      const { data: subs } = await supabaseAdmin
        .from('subcategories')
        .select('id')
        .eq('category_id', category_id);
      
      if (subs) subsToQuery = subs.map(s => s.id);
    }

    if (subsToQuery.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Step 2: Fetch products in these subcategories
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        subcategories!inner(id, name, category_id),
        product_variants!inner(
          id, color,
          product_images(image_url, sort_order),
          variant_sizes(original_price, discount_price, stock)
        )
      `)
      .in('subcategory_id', subsToQuery)
      .is('deleted_at', null);

    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    }

    const { data: products, error } = await query;
    if (error) throw error;
    if (!products) return NextResponse.json({ data: [] });

    // Format products for listing
    const formattedProducts = products.map((p) => {
      // Find default variant (first one with stock, or just first one)
      const defaultVariant = p.product_variants[0];
      
      // Calculate price (lowest price among sizes in default variant)
      let price = 0;
      if (defaultVariant && defaultVariant.variant_sizes.length > 0) {
        price = Math.min(...defaultVariant.variant_sizes.map((s) => s.discount_price || s.original_price));
      }

      // Get main image
      let imageUrl = "";
      if (defaultVariant && defaultVariant.product_images.length > 0) {
        const sortedImages = [...defaultVariant.product_images].sort((a, b) => a.sort_order - b.sort_order);
        imageUrl = sortedImages[0].image_url;
      }

      return {
        id: p.id,
        name: p.name,
        price,
        imageUrl,
        defaultVariantId: defaultVariant?.id || null,
        created_at: p.created_at,
        subcategory_id: p.subcategory_id
      };
    });

    // Handle manual sorting for derived fields (like price)
    if (sort === 'price_low') {
      formattedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_high') {
      formattedProducts.sort((a, b) => b.price - a.price);
    } else if (!sort || sort === 'newest') {
      // already handled by DB or fallback
      formattedProducts.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
    }

    return NextResponse.json({ data: formattedProducts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
