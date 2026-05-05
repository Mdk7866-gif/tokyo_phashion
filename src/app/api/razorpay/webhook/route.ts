import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import crypto from 'crypto';

// Razorpay sends raw body — we must NOT parse as JSON before verifying
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // If secret is configured, verify it
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
      }
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSig !== signature) {
        console.warn('Webhook signature mismatch');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    } else {
      console.warn('RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification');
    }

    const event = JSON.parse(rawBody) as {
      event: string;
      payload?: {
        payment?: { entity?: { id?: string; order_id?: string; status?: string } };
        order?: { entity?: { id?: string; status?: string } };
      };
    };

    await handleEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleEvent(event: {
  event: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; status?: string } };
  };
}) {
  const { event: eventType, payload } = event;
  const paymentEntity = payload?.payment?.entity;

  switch (eventType) {
    case 'payment.captured': {
      if (!paymentEntity?.order_id) break;
      // Mark payment paid
      await supabaseAdmin
        .from('payments')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('razorpay_order_id', paymentEntity.order_id);

      // Propagate to order
      const { data: paymentRow } = await supabaseAdmin
        .from('payments')
        .select('order_id')
        .eq('razorpay_order_id', paymentEntity.order_id)
        .single();

      if (paymentRow?.order_id) {
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', paymentRow.order_id);
      }
      break;
    }

    case 'payment.failed': {
      if (!paymentEntity?.order_id) break;
      await supabaseAdmin
        .from('payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('razorpay_order_id', paymentEntity.order_id);

      const { data: paymentRow } = await supabaseAdmin
        .from('payments')
        .select('order_id')
        .eq('razorpay_order_id', paymentEntity.order_id)
        .single();

      if (paymentRow?.order_id) {
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
          .eq('id', paymentRow.order_id);
      }
      break;
    }

    default:
      // Ignore other events
      break;
  }
}
