import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdminSession } from "@/lib/supabase/server";

// GET /api/admin/orders?status=pending|paid|delivered|cancelled
export async function GET(req: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status") ?? "paid";
  const supabase = supabaseAdmin;

  let query = supabase
    .from("orders")
    .select(`
      id, user_id, payment_method, payment_status, delivery_status,
      total_amount, tracking_id, parcel_image, cancelled_by, cancellation_note,
      created_at, updated_at,
      snapshot_order_full_address, snapshot_order_city, snapshot_order_state, snapshot_order_pincode,
      users ( id, name, email, mobile_number, profile_image ),
      order_items (
        id, quantity, price_snapshot, product_name_snapshot, color_snapshot, size_snapshot,
        product_id, product_variant_id,
        product_variants (
          product_images ( image_url )
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (status === "paid") {
    // Paid online orders awaiting dispatch
    query = query.eq("payment_status", "paid").eq("payment_method", "online").eq("delivery_status", "pending");
  } else if (status === "cod") {
    // COD orders where advance has been paid via Razorpay, awaiting dispatch
    query = query.eq("payment_status", "paid").eq("payment_method", "cod").eq("delivery_status", "pending");
  } else if (status === "failed") {
    // Failed/abandoned payments: payment_status='failed'
    // Includes both explicit payment failures and system-auto-cancels (cancelled_by='system').
    query = query.eq("payment_status", "failed");
  } else if (status === "delivered") {
    query = query.eq("delivery_status", "delivered");
    const paymentMethod = req.nextUrl.searchParams.get("payment_method");
    if (paymentMethod === "cod" || paymentMethod === "online") {
      query = query.eq("payment_method", paymentMethod);
    }
  } else if (status === "cancelled") {
    // Human-initiated cancellations only (admin or user).
    // Using .in() instead of .neq('system') to avoid the PostgreSQL NULL != 'system' = NULL gotcha.
    query = query.eq("delivery_status", "cancelled").in("cancelled_by", ["admin", "user"]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PATCH /api/admin/orders — update tracking_id, parcel_image, delivery_status
export async function PATCH(req: NextRequest) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { order_id, tracking_id, parcel_image, delivery_status, cancellation_note } = body;
  if (!order_id) return NextResponse.json({ error: "order_id required" }, { status: 400 });

  const supabase = supabaseAdmin;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = { updated_at: new Date().toISOString() };

  if (tracking_id !== undefined) updates.tracking_id = tracking_id;
  if (parcel_image !== undefined) updates.parcel_image = parcel_image;
  if (delivery_status !== undefined) updates.delivery_status = delivery_status;
  if (cancellation_note !== undefined) updates.cancellation_note = cancellation_note;
  if (delivery_status === "cancelled") updates.cancelled_by = "admin";

  const { error } = await supabase.from("orders").update(updates).eq("id", order_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
