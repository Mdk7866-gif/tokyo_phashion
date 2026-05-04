import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - returns cart and wishlist counts for the current user (0 if not logged in)
export async function GET() {
  const supabase = await createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ cartCount: 0, wishlistCount: 0 });
    }

    const [cartRes, wishlistRes] = await Promise.all([
      supabase
        .from("cart_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("wishlist_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    return NextResponse.json({
      cartCount: cartRes.count ?? 0,
      wishlistCount: wishlistRes.count ?? 0,
    });
  } catch (error: any) {
    return NextResponse.json({ cartCount: 0, wishlistCount: 0 });
  }
}
