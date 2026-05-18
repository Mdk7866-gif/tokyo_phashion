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

        // Decrease stock
        try {
          const { data: orderItems } = await supabaseAdmin
            .from('order_items')
            .select('variant_size_id, quantity')
            .eq('order_id', paymentRow.order_id);

          if (orderItems && orderItems.length > 0) {
            const variantSizeIds = orderItems.map(i => i.variant_size_id);
            const { data: variantSizes } = await supabaseAdmin
              .from('variant_sizes')
              .select('id, stock')
              .in('id', variantSizeIds);

            if (variantSizes) {
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
          console.error('Webhook: Failed to decrease stock:', stockErr);
        }
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseAdmin as any)
          .from('orders')
          .update({
            payment_status: 'failed',
            delivery_status: 'failed',
            cancellation_note: 'Payment failed due to a gateway or technical error',
            cancelled_by: 'system',
            updated_at: new Date().toISOString(),
          })
          .eq('id', paymentRow.order_id);
      }
      break;
    }

    default:
      // Ignore other events
      break;
  }
}
