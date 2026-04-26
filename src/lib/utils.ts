/**
 * Normalizes a phone number to the internal database format.
 * Strips 91 if present and returns + followed by 10 digits.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, '');
  
  // If it has 12 digits and starts with 91, strip the country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  }
  
  // Always return with a + prefix as per user requirement (e.g., +8511274216)
  return `+${cleaned}`;
}
