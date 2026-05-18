import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orderId = req.nextUrl.searchParams.get("order_id");
    if (!orderId) {
      return new NextResponse("order_id is required", { status: 400 });
    }

    // 1. Fetch order and associated items, ensuring it belongs to the authenticated user
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderErr || !order) {
      return new NextResponse("Order not found or access denied", { status: 404 });
    }

    // 2. Fetch corresponding payment information
    const { data: payment } = await supabase
      .from("payments")
      .select("razorpay_payment_id")
      .eq("order_id", orderId)
      .limit(1)
      .maybeSingle();

    // 3. Fetch current user metadata
    const { data: profile } = await supabase
      .from("users")
      .select("name, email, mobile_number")
      .eq("id", user.id)
      .single();

    // 4. Calculate receipt totals securely on server side
    const subtotal = (order.order_items || []).reduce(
      (acc: number, item: { price_snapshot: number; quantity: number }) =>
        acc + item.price_snapshot * item.quantity,
      0
    );
    const deliveryCharge = order.payment_method === "cod" ? 150 : 100;
    const total = subtotal + deliveryCharge;
    const isCod = order.payment_method === "cod";
    const paidAmount = isCod ? Math.min(total, 100) : total;
    const balanceAmount = total - paidAmount;

    // 5. Generate beautiful print-optimized HTML list
    const itemsHtml = (order.order_items || []).map(
      (item: {
        product_name_snapshot: string;
        color_snapshot: string;
        size_snapshot: string;
        quantity: number;
        price_snapshot: number;
      }) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <div style="font-weight: 800; text-transform: uppercase; font-size: 13px;">${item.product_name_snapshot}</div>
          <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">
            ${item.color_snapshot} | Size: ${item.size_snapshot} | Qty: ${item.quantity}
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 800;">
          ₹${(item.price_snapshot * item.quantity).toFixed(0)}
        </td>
      </tr>
    `
    ).join("");

    const addressString = `${order.snapshot_order_full_address}, ${order.snapshot_order_city}, ${order.snapshot_order_state} - ${order.snapshot_order_pincode}`;

    const htmlContent = `
  <html>
    <head>
      <meta charset="utf-8">
      <title>Receipt - Tokyo Fashion</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          padding: 20px;
          color: #000;
          line-height: 1.4;
          max-width: 800px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          border-bottom: 3px solid #000;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -1px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
          font-size: 11px;
        }

        .section-title {
          font-weight: 900;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
          margin-bottom: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .label {
          text-transform: uppercase;
          font-weight: 700;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .summary-row {
          display: flex;
          justify-content: flex-end;
          gap: 40px;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .total-box {
          background: #000;
          color: #fff;
          padding: 15px;
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .total-box span:first-child {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .total-box span:last-child {
          font-size: 20px;
          font-weight: 900;
          font-style: italic;
        }

        .cod-breakdown {
          background: #f4f4f4;
          border: 1px dashed #ccc;
          padding: 15px;
          margin-top: 20px;
          font-size: 11px;
        }

        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 9px;
          color: #999;
          letter-spacing: 2px;
          text-transform: lowercase;
        }

        .lowercase {
          text-transform: lowercase !important;
        }
      </style>
    </head>

    <body>
      <div class="header">
        <h1>TOKYO FASHION</h1>
        <p style="font-size: 10px; font-weight: 700; letter-spacing: 3px; margin-top: 5px;">
          OFFICIAL PURCHASE RECEIPT
        </p>
      </div>

      <div class="details-grid">

        <div>
          <div class="section-title">Order Information</div>

          <span class="label">Order ID:</span>
          <span class="lowercase">${(order.id || 'N/A').toLowerCase()}</span>
          <br>

          <span class="label">Payment ID:</span>
          <span class="lowercase">
            ${(payment?.razorpay_payment_id || 'N/A').toLowerCase()}
          </span>
          <br>

          <span class="label">Method:</span>
          ${order.payment_method.toUpperCase()}
          <br>

          <span class="label">Date:</span>
          ${new Date(order.created_at || Date.now()).toLocaleDateString()}
        </div>

        <div>
          <div class="section-title">Customer Details</div>

          <span class="label">Name:</span>
          ${profile?.name || 'N/A'}
          <br>

          <span class="label">Email:</span>
          <span class="lowercase">
            ${(profile?.email || 'N/A').toLowerCase()}
          </span>
          <br>

          <span class="label">Mobile:</span>
          ${profile?.mobile_number || 'N/A'}
          <br>

          <span class="label">Address:</span>
          ${addressString}
        </div>

      </div>

      <table>
        <thead>
          <tr style="border-bottom: 2px solid #000; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
            <th style="text-align: left; padding-bottom: 10px;">Item Details</th>
            <th style="text-align: right; padding-bottom: 10px;">Amount</th>
          </tr>
        </thead>

        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="summary-row">
        <span style="color: #666; text-transform: uppercase; font-size: 10px;">
          Subtotal
        </span>

        <span style="font-weight: 700;">
          ₹${subtotal.toFixed(0)}
        </span>
      </div>

      <div class="summary-row">
        <span style="color: #666; text-transform: uppercase; font-size: 10px;">
          Delivery
        </span>

        <span style="font-weight: 700;">
          ₹${deliveryCharge}
        </span>
      </div>

      <div class="total-box">
        <span>Grand Total Paid</span>
        <span>₹${paidAmount.toFixed(0)}</span>
      </div>

      ${isCod ? `
        <div class="cod-breakdown">

          <div style="font-weight: 900; margin-bottom: 8px; text-transform: uppercase;">
            COD Payment Breakdown
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Advance Paid Online:</span>
            <span>₹${paidAmount.toFixed(0)}</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-weight: 900; color: #e11d48; margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
            <span>Balance to pay at Delivery:</span>
            <span>₹${balanceAmount.toFixed(0)}</span>
          </div>

        </div>
      ` : `
        <div style="text-align: right; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-top: 10px; color: #16a34a;">
          ✓ Full Payment Settled Online
        </div>
      `}

      <div class="footer">
        thank you for shopping with us. stay fashionable.
        <br>
        www.tokyfashion.syp3.com
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 500);
        };
      </script>
    </body>
  </html>
`;

    return new NextResponse(htmlContent, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("Failed to generate server receipt:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
