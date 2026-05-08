import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// POST /api/user/reviews — submit or update review
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id, product_id: explicitProductId, rating, comment } = await req.json();
  if (!order_id || !rating) {
    return NextResponse.json({ error: "order_id and rating are required" }, { status: 400 });
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

  // If product_id not provided, resolve the first item from the order
  let product_id = explicitProductId;
  if (!product_id) {
    const { data: firstItem } = await admin
      .from("order_items")
      .select("product_id")
      .eq("order_id", order_id)
      .limit(1)
      .single();
    product_id = firstItem?.product_id ?? null;
  }

  // Check if user already reviewed this order
  const { data: existingReview } = await admin
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("order_id", order_id)
    .single();

  if (existingReview) {
    return NextResponse.json({ error: "You have already reviewed this order" }, { status: 400 });
  }

  // Insert new review
  const { error } = await ((admin as any).from("reviews")).insert({
    user_id: user.id,
    product_id,
    order_id,
    rating,
    comment: comment ?? null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// GET /api/user/reviews?product_id=xxx OR ?order_id=xxx
export async function GET(req: NextRequest) {
  const product_id = req.nextUrl.searchParams.get("product_id");
  const order_id = req.nextUrl.searchParams.get("order_id");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = supabaseAdmin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = ((admin as any).from("reviews"))
    .select("id, rating, comment, created_at, order_id, product_id, users(name, profile_image)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (product_id) {
    query = query.eq("product_id", product_id);
  } else if (order_id) {
    query = query.eq("order_id", order_id);
  } else if (user) {
    // If no specific product/order, but user is logged in, return their reviews
    query = query.eq("user_id", user.id);
  } else {
    return NextResponse.json({ error: "product_id or order_id required" }, { status: 400 });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
