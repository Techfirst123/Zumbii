interface EmailResult {
  ok: boolean;
  provider: string;
  error?: unknown;
}

/** Dev-mode fallback: prints the OTP to the server console instead of sending it. */
async function sendViaConsole(email: string, otp: string): Promise<EmailResult> {
  console.log(
    `\n[DEV MODE][EMAIL] OTP for ${email}: ${otp}\n(Set SENDGRID_API_KEY to send real email via SendGrid.)\n`,
  );
  return { ok: true, provider: 'console-dev' };
}

/**
 * Sends an OTP email via SendGrid's v3 Mail Send API.
 * Docs: https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */
async function sendViaSendgrid(
  email: string,
  otp: string,
  expiryMinutes: number,
): Promise<EmailResult> {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'no-reply@zumbii.com';
  const fromName = process.env.SENDGRID_FROM_NAME || 'Zumbii';

  const body = {
    personalizations: [{ to: [{ email }] }],
    from: { email: fromEmail, name: fromName },
    subject: `Your Zumbii verification code: ${otp}`,
    content: [
      {
        type: 'text/plain',
        value: `Your Zumbii verification code is ${otp}. It expires in ${expiryMinutes} minutes. If you didn't request this, you can ignore this email.`,
      },
      {
        type: 'text/html',
        value: `<p>Your Zumbii verification code is:</p><h2 style="letter-spacing:4px">${otp}</h2><p>This code expires in ${expiryMinutes} minutes. If you didn't request this, you can ignore this email.</p>`,
      },
    ],
  };

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => res.statusText);
      return { ok: false, provider: 'sendgrid', error };
    }
    return { ok: true, provider: 'sendgrid' };
  } catch (err) {
    return { ok: false, provider: 'sendgrid', error: err instanceof Error ? err.message : err };
  }
}

/** Sends an OTP via email, auto-selecting SendGrid (if configured) or the console dev fallback. */
export async function sendOtpEmail(
  email: string,
  otp: string,
  expiryMinutes: number,
): Promise<EmailResult> {
  return process.env.SENDGRID_API_KEY
    ? sendViaSendgrid(email, otp, expiryMinutes)
    : sendViaConsole(email, otp);
}
