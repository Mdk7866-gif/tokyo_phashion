import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - fetch all wishlist items for the user
export async function GET() {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("wishlist_items")
      .select(`
        id,
        product_variant_id,
        created_at,
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
      `)
      .eq("user_id", user.id)
      .is("product_variants.products.deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - add a variant to wishlist
export async function POST(request: Request) {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { product_variant_id } = await request.json();
    if (!product_variant_id) return NextResponse.json({ error: "Missing product_variant_id" }, { status: 400 });

    const { error } = await supabase
      .from("wishlist_items")
      .upsert({ user_id: user.id, product_variant_id }, { onConflict: "user_id,product_variant_id" });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - remove from wishlist by ?id= (wishlist row id) or ?variant_id=
export async function DELETE(request: Request) {
  const supabase = await createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const variant_id = searchParams.get("variant_id");

    if (!id && !variant_id) {
      return NextResponse.json({ error: "Missing id or variant_id" }, { status: 400 });
    }

    let query = supabase.from("wishlist_items").delete().eq("user_id", user.id);
    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("product_variant_id", variant_id!);
    }

    const { error } = await query;
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
