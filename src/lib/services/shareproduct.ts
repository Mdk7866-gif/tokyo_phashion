import { supabaseAdmin } from '@/lib/supabase/admin';

export async function getShareProductDetail(productId: string) {
  if (!productId) return { data: null, error: "Missing product_id" };

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        subcategories (
          id,
          name,
          category_id,
          categories (
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
