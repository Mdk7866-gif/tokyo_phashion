import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// POST /api/user/reviews — submit or update review
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id, product_id, rating, comment } = await req.json();
  if (!order_id || !product_id || !rating) {
    return NextResponse.json({ error: "order_id, product_id and rating are required" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const admin = supabaseAdmin;
  // Verify order belongs to user and is delivered
  const { data: order } = await admin
    .from("orders")
    .select("id, delivery_status")
    .eq("id", order_id)
    .eq("user_id", user.id)
    .single();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.delivery_status !== "delivered") {
    return NextResponse.json({ error: "You can only review delivered orders" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await ((admin as any).from("reviews")).upsert({
    user_id: user.id,
    product_id,
    order_id,
    rating,
    comment: comment ?? null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,order_id,product_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// GET /api/user/reviews?product_id=xxx — get reviews for a product
export async function GET(req: NextRequest) {
  const product_id = req.nextUrl.searchParams.get("product_id");
  if (!product_id) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  const admin = supabaseAdmin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await ((admin as any).from("reviews"))
    .select("id, rating, comment, created_at, users(name, profile_image)")
    .eq("product_id", product_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
