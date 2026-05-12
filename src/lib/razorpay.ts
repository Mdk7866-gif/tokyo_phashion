import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export const DELIVERY_COD = 150;
export const DELIVERY_ONLINE = 100;
export const COD_ADVANCE = 100;    // ₹100 minimum advance for COD
