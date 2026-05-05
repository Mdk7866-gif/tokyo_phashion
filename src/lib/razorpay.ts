import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Missing Razorpay env vars: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const DELIVERY_CHARGE = 49; // ₹49
export const COD_ADVANCE = 100;    // ₹100 minimum advance for COD
