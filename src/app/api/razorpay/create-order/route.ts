import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { razorpay, DELIVERY_COD, DELIVERY_ONLINE, COD_ADVANCE } from '@/lib/razorpay';

interface OrderItem {
  variant_size_id: string;
  product_id: string;
  product_variant_id: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  let step = 'init';
  try {
    // --- Auth ---
    step = 'auth';
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in and try again.' }, { status: 401 });
    }

    // --- Parse & validate body ---
    step = 'parse_body';
    const body = await request.json();
    const { payment_method, items }: { payment_method: 'cod' | 'online'; items: OrderItem[] } = body;

    if (!payment_method || !['cod', 'online'].includes(payment_method)) {
      return NextResponse.json({ error: 'Invalid payment_method' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required and cannot be empty' }, { status: 400 });
    }
    for (const item of items) {
      if (!item.variant_size_id || !item.product_id || !item.product_variant_id || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: 'Each item must have variant_size_id, product_id, product_variant_id, quantity' }, { status: 400 });
      }
    }

    // --- Fetch user's default address ---
    step = 'fetch_address';
    const { data: addressData, error: addressError } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_default', true)
      .is('deleted_at', null)
      .single();

    if (addressError || !addressData) {
      return NextResponse.json(
        { error: 'No default address found. Please add a delivery address in your profile first.' },
        { status: 400 }
      );
    }

    // --- Fetch variant sizes (validate + get prices) ---
    step = 'fetch_variant_sizes';
    const variantSizeIds = items.map(i => i.variant_size_id);
    const { data: variantSizes, error: vsError } = await supabaseAdmin
      .from('variant_sizes')
      .select(`
        id, size, discount_price, original_price, stock,
        product_variants (
          id, color,
          products ( id, name )
        )
      `)
      .in('id', variantSizeIds)
      .is('deleted_at', null);

    if (vsError) {
      console.error('variant_sizes fetch error:', vsError);
      return NextResponse.json({ error: `Failed to fetch product details: ${vsError.message}` }, { status: 500 });
    }
    if (!variantSizes || variantSizes.length !== variantSizeIds.length) {
      return NextResponse.json({ error: 'One or more items are invalid or unavailable' }, { status: 400 });
    }

    // --- Check stock ---
    step = 'check_stock';
    for (const item of items) {
      const vs = variantSizes.find(v => v.id === item.variant_size_id);
      if (!vs) return NextResponse.json({ error: `Item not found: ${item.variant_size_id}` }, { status: 400 });
      if (vs.stock < item.quantity) {
        const pv = vs.product_variants as { color: string; products: { name: string } } | null;
        return NextResponse.json(
          { error: `Insufficient stock for ${pv?.products?.name || 'item'} (${pv?.color || ''} - ${vs.size})` },
          { status: 400 }
        );
      }
    }

    // --- Calculate totals ---
    step = 'calculate_totals';
    let subtotal = 0;
    for (const item of items) {
      const vs = variantSizes.find(v => v.id === item.variant_size_id)!;
      const price = vs.discount_price ?? vs.original_price;
      subtotal += price * item.quantity;
    }
    const deliveryCharge = payment_method === 'cod' ? DELIVERY_COD : DELIVERY_ONLINE;
    const totalAmount = subtotal + deliveryCharge;

    let razorpayAmountPaise: number;
    if (payment_method === 'online') {
      razorpayAmountPaise = Math.round(totalAmount * 100);
    } else {
      const advanceRs = Math.min(totalAmount, COD_ADVANCE);
      razorpayAmountPaise = Math.round(advanceRs * 100);
    }
    if (razorpayAmountPaise < 100) razorpayAmountPaise = 100;

    // --- Create Razorpay order ---
    step = 'create_razorpay_order';
    const receipt = `rcpt_${Date.now()}_${user.id.slice(0, 8)}`;
    let rzpOrder;
    try {
      rzpOrder = await razorpay.orders.create({
        amount: razorpayAmountPaise,
        currency: 'INR',
        receipt,
        notes: { user_id: user.id, payment_method },
      });
    } catch (rzpErr: unknown) {
      const rzpError = rzpErr as { error?: { description?: string }; message?: string };
      const rzpMsg = rzpError?.error?.description || rzpError?.message || String(rzpErr);
      console.error('Razorpay order creation failed:', rzpMsg);
      return NextResponse.json(
        { error: `Payment gateway error: ${rzpMsg}` },
        { status: 502 }
      );
    }

    // --- Create order record in Supabase ---
    step = 'insert_order';
    const { data: dbOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        snapshot_order_full_address: addressData.full_address,
        snapshot_order_city: addressData.city,
        snapshot_order_state: addressData.state,
        snapshot_order_pincode: addressData.pincode,
        total_amount: totalAmount,
        payment_method: payment_method as 'cod' | 'online',
        payment_status: 'pending' as const,
        delivery_status: 'pending' as const,
      })
      .select()
      .single();

    if (orderError || !dbOrder) {
      console.error('Order DB insert error:', orderError);
      return NextResponse.json(
        { error: `Failed to create order: ${orderError?.message || 'unknown db error'}` },
        { status: 500 }
      );
    }

    // --- Create order_items ---
    step = 'insert_order_items';
    const orderItemsPayload = items.map(item => {
      const vs = variantSizes.find(v => v.id === item.variant_size_id)!;
      const pv = vs.product_variants as { id: string; color: string; products: { id: string; name: string } } | null;
      return {
        order_id: dbOrder.id,
        product_id: item.product_id,
        product_variant_id: item.product_variant_id,
        variant_size_id: item.variant_size_id,
        product_name_snapshot: pv?.products?.name ?? 'Unknown Product',
        color_snapshot: pv?.color ?? 'Unknown',
        size_snapshot: vs.size,
        price_snapshot: vs.discount_price ?? vs.original_price,
        quantity: item.quantity,
      };
    });

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsPayload);
    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      await supabaseAdmin.from('orders').delete().eq('id', dbOrder.id);
      return NextResponse.json(
        { error: `Failed to save order items: ${itemsError.message}` },
        { status: 500 }
      );
    }

    // --- Create payment record ---
    step = 'insert_payment';
    const { error: paymentError } = await supabaseAdmin.from('payments').insert({
      order_id: dbOrder.id,
      razorpay_order_id: rzpOrder.id,
      amount: razorpayAmountPaise / 100,
      status: 'pending' as const,
    });
    if (paymentError) {
      console.error('Payment record insert error (non-fatal):', paymentError);
    }

    return NextResponse.json({
      success: true,
      razorpay_order_id: rzpOrder.id,
      amount: razorpayAmountPaise,
      currency: 'INR',
      our_order_id: dbOrder.id,
    });

  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error(`create-order CRASH at step [${step}]:`, err);
    return NextResponse.json(
      { error: `Order failed at step "${step}": ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
