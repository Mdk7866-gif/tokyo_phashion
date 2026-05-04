import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        created_at,
        variant_sizes!inner (
          id,
          size,
          original_price,
          discount_price,
          product_variants!inner (
            id,
            color,
            products!inner (
              id,
              name,
              subcategory_id,
              subcategories!inner (
                id,
                name,
                category_id,
                categories!inner (
                  id,
                  name
                )
              )
            ),
            product_images (
              image_url,
              sort_order
            )
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Get cart error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
