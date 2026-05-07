import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Called when user closes the Razorpay modal or payment explicitly fails.
// Marks the order payment_status as 'failed' so it doesn't stay stuck in 'pending'.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { our_order_id } = body;
    if (!our_order_id) {
      return NextResponse.json({ error: 'our_order_id required' }, { status: 400 });
    }

    // Verify order belongs to this user
    const { data: order, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('id, user_id, payment_status')
      .eq('id', our_order_id)
      .single();

    if (fetchErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only mark as failed if currently pending — don't overwrite a successful/already-failed payment
    if (order.payment_status !== 'pending') {
      return NextResponse.json({ success: true, message: 'Order already resolved' });
    }

    // Mark order as failed
    await supabaseAdmin
      .from('orders')
      .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', our_order_id);

    // Also update the payments record
    await supabaseAdmin
      .from('payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('order_id', our_order_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('cancel-order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
