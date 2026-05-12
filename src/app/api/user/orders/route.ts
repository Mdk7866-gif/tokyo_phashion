import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/user/orders — user's own orders
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = supabaseAdmin;
  const { data, error } = await admin
    .from("orders")
    .select(`
      id, payment_method, payment_status, delivery_status, total_amount,
      tracking_id, parcel_image, cancelled_by, cancellation_note, created_at,
      snapshot_order_full_address, snapshot_order_city, snapshot_order_state, snapshot_order_pincode,
      order_items (
        id, quantity, price_snapshot, product_name_snapshot, color_snapshot, size_snapshot,
        product_id, product_variant_id,
        product_variants (
          id,
          product_images ( image_url, sort_order )
        )
      )
    `)
    .eq("user_id", user.id)
    // Exclude orders where payment was never completed.
    // System-cancelled orders (user abandoned checkout) have payment_status='failed'.
    // We exclude those — the user never actually paid so they shouldn't see them.
    .neq("payment_status", "failed")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/user/orders — user cancels an order
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { order_id } = await req.json();
  if (!order_id) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  const admin = supabaseAdmin;
  // Verify order belongs to user and is still in pending/paid delivery
  const { data: order, error: fetchErr } = await admin
    .from("orders")
    .select("id, delivery_status, user_id")
    .eq("id", order_id)
    .eq("user_id", user.id)
    .single();

  if (fetchErr || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.delivery_status === "delivered") {
    return NextResponse.json({ error: "Cannot cancel a delivered order" }, { status: 400 });
  }
  if (order.delivery_status === "cancelled") {
    return NextResponse.json({ error: "Order already cancelled" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await ((admin as any).from("orders"))
    .update({ delivery_status: "cancelled", cancelled_by: "user", updated_at: new Date().toISOString() })
    .eq("id", order_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Order cancelled. No refund will be issued." });
}
