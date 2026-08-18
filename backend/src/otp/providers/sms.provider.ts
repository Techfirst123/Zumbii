interface SmsResult {
  ok: boolean;
  provider: string;
  error?: unknown;
}

/** Dev-mode fallback: prints the OTP to the server console instead of sending it. */
async function sendViaConsole(phone: string, otp: string): Promise<SmsResult> {
  console.log(
    `\n[DEV MODE][SMS] OTP for ${phone}: ${otp}\n(Set MSG91_AUTH_KEY to send real SMS via MSG91.)\n`,
  );
  return { ok: true, provider: 'console-dev' };
}

/**
 * Sends an OTP SMS via MSG91's OTP API.
 * Docs: https://docs.msg91.com/reference/send-otp
 */
async function sendViaMsg91(phone: string, otp: string): Promise<SmsResult> {
  const phoneDigits = phone.replace('+', '');
  const params = new URLSearchParams({
    otp,
    mobile: phoneDigits,
    authkey: process.env.MSG91_AUTH_KEY || '',
    sender: process.env.MSG91_SENDER_ID || 'ZUMBII',
  });
  if (process.env.MSG91_TEMPLATE_ID) {
    params.set('template_id', process.env.MSG91_TEMPLATE_ID);
  }

  try {
    const res = await fetch(`https://control.msg91.com/api/v5/otp?${params.toString()}`);
    const data = await res.json();
    if (data && (data.type === 'success' || data.type === 'SUCCESS')) {
      return { ok: true, provider: 'msg91' };
    }
    return { ok: false, provider: 'msg91', error: data };
  } catch (err) {
    return { ok: false, provider: 'msg91', error: err instanceof Error ? err.message : err };
  }
}

/** Sends an OTP via SMS, auto-selecting MSG91 (if configured) or the console dev fallback. */
export async function sendOtpSms(phone: string, otp: string): Promise<SmsResult> {
  return process.env.MSG91_AUTH_KEY ? sendViaMsg91(phone, otp) : sendViaConsole(phone, otp);
}
