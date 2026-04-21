import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const SERVICE_SID = process.env.TWILIO_SERVICE_SID!;

/**
 * Normalizes a phone number to E.164 format.
 * If it's 10 digits, assumes +91 (India).
 * Otherwise ensures it starts with +.
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone.startsWith('+') ? phone : `+${cleaned}`;
}

/**
 * Send OTP to the given phone number via Twilio Verify.
 */
export async function sendOtp(phone: string): Promise<void> {
  const normalized = normalizePhone(phone);
  await client.verify.v2.services(SERVICE_SID).verifications.create({
    to: normalized,
    channel: 'sms',
  });
}

/**
 * Check the OTP entered by the user.
 * Returns true if approved, false otherwise.
 */
export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  const result = await client.verify.v2
    .services(SERVICE_SID)
    .verificationChecks.create({ to: normalized, code });
  return result.status === 'approved';
}

