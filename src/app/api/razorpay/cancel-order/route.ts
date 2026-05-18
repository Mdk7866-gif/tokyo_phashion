import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Called when user closes the Razorpay modal (reason='dismissed') or payment explicitly fails (reason='failed').
// 'dismissed' → user knowingly exited → payment_status='pending', delivery_status='failed'
// 'failed'    → technical/server error  → payment_status='failed',  delivery_status='failed'
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { our_order_id, reason } = body;
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

    // Only update if currently pending — don't overwrite a successful/already-resolved payment
    if (order.payment_status !== 'pending') {
      return NextResponse.json({ success: true, message: 'Order already resolved' });
    }

    // 'dismissed' = user intentionally closed modal → keep payment as pending, mark delivery failed
    // 'failed'    = technical/Razorpay error      → mark payment as failed, mark delivery failed
    const newPaymentStatus = reason === 'dismissed' ? 'pending' : 'failed';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin.from('orders') as any)
      .update({
        payment_status: newPaymentStatus,
        delivery_status: 'failed',
        cancellation_note: reason === 'dismissed'
          ? 'Customer exited payment without completing'
          : 'Payment could not be processed (technical/gateway error)',
        cancelled_by: 'system',
        updated_at: new Date().toISOString(),
      })
      .eq('id', our_order_id);

    // Also update the payments record
    await supabaseAdmin
      .from('payments')
      .update({ status: newPaymentStatus, updated_at: new Date().toISOString() })
      .eq('order_id', our_order_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('cancel-order error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
