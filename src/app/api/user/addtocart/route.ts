import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { variant_size_id } = await request.json();

    if (!variant_size_id) {
      return NextResponse.json({ error: "Missing variant_size_id" }, { status: 400 });
    }

    // 1. Check if item already exists in cart to provide a friendly message
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("variant_size_id", variant_size_id)
      .maybeSingle();

    if (existingItem) {
      return NextResponse.json({ error: "You already added this item in cart" }, { status: 400 });
    }

    // 2. Perform the insert
    const { error: insertError } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        variant_size_id
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Could not add item to bag. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
