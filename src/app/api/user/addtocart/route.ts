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

    // Just a simple insert. If it exists, the UNIQUE constraint handles it.
    const { error: insertError } = await supabase
      .from("cart_items")
      .upsert({
        user_id: user.id,
        variant_size_id
      }, { onConflict: 'user_id, variant_size_id' });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
