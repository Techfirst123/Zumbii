import { randomInt } from 'crypto';

/** Domain used for the synthetic email placeholder issued to phone-only signups
 * (the `users.email` column is unique/non-null, but phone-only OTP accounts have no real email). */
export const PHONE_PLACEHOLDER_EMAIL_DOMAIN = 'phone.zumbii.local';

export function placeholderEmailForPhone(e164Phone: string): string {
  return `${e164Phone.replace(/[^\d]/g, '')}@${PHONE_PLACEHOLDER_EMAIL_DOMAIN}`;
}

export function isPlaceholderEmail(email?: string | null): boolean {
  return !!email && email.endsWith(`@${PHONE_PLACEHOLDER_EMAIL_DOMAIN}`);
}

/** Normalizes an Indian phone number to E.164 form: +91XXXXXXXXXX, or null if invalid. */
export function normalizePhone(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = String(raw).replace(/[^\d]/g, '');
  if (digits.length === 10) digits = '91' + digits;
  if (digits.length === 12 && digits.startsWith('91')) return '+' + digits;
  if (digits.length === 13 && digits.startsWith('091')) return '+91' + digits.slice(3);
  return null;
}

/** Normalizes and validates an email address, or returns null if invalid. */
export function normalizeEmail(raw?: string | null): string | null {
  if (!raw) return null;
  const email = String(raw).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Generates a numeric OTP of the given length using a CSPRNG. */
export function generateOtp(length = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10);
  }
  return otp;
}
