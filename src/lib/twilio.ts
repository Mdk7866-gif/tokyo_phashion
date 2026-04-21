import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const SERVICE_SID = process.env.TWILIO_SERVICE_SID!;

/**
 * Helper to ensure Twilio always gets a valid +91 Indian number.
 */
function normalizeForTwilio(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const last10 = cleaned.slice(-10);
  return `+91${last10}`;
}

/**
 * Normalizes a phone number to the internal database format.
 * Strips 91 if present and returns + followed by 10 digits.
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  // If it has 12 digits and starts with 91, strip the country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }
  
  // Always return with a + prefix as per user requirement (e.g., +8511274216)
  return `+${cleaned}`;
}

/**
 * Send OTP to the given phone number via Twilio Verify.
 */
export async function sendOtp(phone: string): Promise<void> {
  const forTwilio = normalizeForTwilio(phone);
  await client.verify.v2.services(SERVICE_SID).verifications.create({
    to: forTwilio,
    channel: 'sms',
  });
}

/**
 * Check the OTP entered by the user.
 * Returns true if approved, false otherwise.
 */
export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const forTwilio = normalizeForTwilio(phone);
  const result = await client.verify.v2
    .services(SERVICE_SID)
    .verificationChecks.create({ to: forTwilio, code });
  return result.status === 'approved';
}

