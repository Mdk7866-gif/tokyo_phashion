import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // --- Auth ---
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Parse body ---
    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, our_order_id } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !our_order_id) {
      return NextResponse.json({ error: 'Missing required fields: razorpay_payment_id, razorpay_order_id, razorpay_signature, our_order_id' }, { status: 400 });
    }

    // --- Verify Razorpay HMAC-SHA256 signature ---
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Tampered payment — do NOT mark as paid
      console.warn(`Signature mismatch! expected=${expectedSignature}, got=${razorpay_signature}`);
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // --- Confirm order belongs to this user ---
    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from('orders')
      .select('id, user_id, payment_method, total_amount')
      .eq('id', our_order_id)
      .single();

    if (orderFetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // --- Update order: payment_status = paid ---
    const { error: updateOrderError } = await supabaseAdmin
      .from('orders')
      .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
      .eq('id', our_order_id);

    if (updateOrderError) {
      console.error('Failed to update order payment_status:', updateOrderError);
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }

    // --- Decrease Stock ---
    try {
      const { data: orderItems, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select('variant_size_id, quantity')
        .eq('order_id', our_order_id);

      if (orderItems && !itemsError && orderItems.length > 0) {
        // Fetch all variant sizes at once
        const variantSizeIds = orderItems.map(i => i.variant_size_id);
        const { data: variantSizes } = await supabaseAdmin
          .from('variant_sizes')
          .select('id, stock')
          .in('id', variantSizeIds);

        if (variantSizes) {
          // Update stocks in parallel
          await Promise.all(orderItems.map(async (item) => {
            const vs = variantSizes.find(v => v.id === item.variant_size_id);
            if (vs) {
              const newStock = Math.max(0, vs.stock - item.quantity);
              return supabaseAdmin
                .from('variant_sizes')
                .update({ stock: newStock })
                .eq('id', item.variant_size_id);
            }
          }));
        }
      }
    } catch (stockErr) {
      console.error('Failed to decrease stock:', stockErr);
      // Non-fatal, let the order confirmation succeed
    }

    // --- Update payment record ---
    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (updatePaymentError) {
      console.error('Failed to update payment record (non-fatal):', updatePaymentError);
    }

    const isCod = order.payment_method === 'cod';
    return NextResponse.json({
      success: true,
      order_id: our_order_id,
      razorpay_payment_id,
      message: isCod
        ? 'Advance payment received! Your COD order is confirmed.'
        : 'Payment successful! Your order is confirmed.',
    });
  } catch (err) {
    console.error('verify-payment error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
