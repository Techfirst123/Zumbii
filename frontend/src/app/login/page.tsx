'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, AlertCircle, LogIn, UserPlus, ShieldCheck, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { authApi, otpApi, otpRetryAfterSeconds, usersApi, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const OTP_LENGTH = 6;

function OtpDigitInputs({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  disabled: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function setDigit(index: number, digit: string) {
    const next = [...value];
    next[index] = digit;
    onChange(next);
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, '');
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || '');
    onChange(next);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    inputRefs.current[Math.max(lastIndex, 0)]?.focus();
  }

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-12 w-full min-w-0 rounded-lg border border-border text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400 disabled:opacity-60"
        />
      ))}
    </div>
  );
}

function OtpLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [identifierType, setIdentifierType] = useState<'phone' | 'email'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [stage, setStage] = useState<'identifier' | 'otp' | 'name'>('identifier');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startCooldown(seconds: number) {
    setCooldown(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1 && timerRef.current) clearInterval(timerRef.current);
        return Math.max(0, prev - 1);
      });
    }, 1000);
  }

  function buildIdentifierPayload() {
    return identifierType === 'phone' ? { phone: identifier } : { email: identifier };
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await otpApi.send(buildIdentifierPayload());
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setStage('otp');
      startCooldown(res.resendCooldownSeconds);
    } catch (err) {
      const retryAfter = otpRetryAfterSeconds(err);
      if (retryAfter) startCooldown(retryAfter);
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(otp: string) {
    setError('');
    setLoading(true);
    try {
      const res = await otpApi.verify(buildIdentifierPayload(), otp);
      setAuth(res);
      if (res.profileComplete === false) {
        setStage('name');
      } else {
        onSuccess();
      }
    } catch (err) {
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteProfile(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const profile = await usersApi.updateMe({ firstName: firstName.trim(), lastName: lastName.trim() || undefined });
      updateUser({ firstName: profile.firstName, lastName: profile.lastName });
      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const otpValue = otpDigits.join('');

  useEffect(() => {
    if (stage === 'otp' && otpValue.length === OTP_LENGTH && !loading) {
      handleVerify(otpValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpValue, stage]);

  if (stage === 'name') {
    return (
      <form onSubmit={handleCompleteProfile} className="space-y-4">
        <div className="text-center mb-1">
          <h2 className="text-base font-semibold text-zumbii-950">Welcome! What should we call you?</h2>
          <p className="text-xs text-text-tertiary mt-1">
            Just need your name to finish setting up your account.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">First name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                required
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="gold"
          className="w-full"
          loading={loading}
          disabled={loading || !firstName.trim()}
        >
          Continue
        </Button>
      </form>
    );
  }

  if (stage === 'otp') {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otpValue.length === OTP_LENGTH) handleVerify(otpValue);
        }}
        className="space-y-4"
      >
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setStage('identifier');
            setOtpDigits(Array(OTP_LENGTH).fill(''));
            setError('');
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-zumbii-600"
        >
          <ArrowLeft size={13} />
          Change {identifierType === 'phone' ? 'phone number' : 'email'}
        </button>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Enter the 6-digit code sent to {identifier}
          </label>
          <OtpDigitInputs value={otpDigits} onChange={setOtpDigits} disabled={loading} />
        </div>

        <Button
          type="submit"
          variant="gold"
          className="w-full"
          loading={loading}
          disabled={loading || otpValue.length !== OTP_LENGTH}
        >
          <ShieldCheck className="w-4 h-4" />
          Verify & sign in
        </Button>

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={cooldown > 0 || loading}
          className="w-full text-center text-xs font-medium text-zumbii-600 hover:text-zumbii-700 disabled:text-text-tertiary disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-1.5 rounded-lg bg-surface-secondary p-1">
        {(['phone', 'email'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setIdentifierType(t);
              setIdentifier('');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
              identifierType === t
                ? 'bg-white text-zumbii-950 shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {t === 'phone' ? <Phone size={13} /> : <Mail size={13} />}
            {t === 'phone' ? 'Phone' : 'Email'}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5">
          {identifierType === 'phone' ? 'Mobile number' : 'Email'}
        </label>
        <div className="relative">
          {identifierType === 'phone' ? (
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          ) : (
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          )}
          <input
            type={identifierType === 'phone' ? 'tel' : 'email'}
            required
            autoFocus
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={identifierType === 'phone' ? '9876543210' : 'you@example.com'}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
          />
        </div>
      </div>

      <Button type="submit" variant="gold" className="w-full" loading={loading} disabled={loading}>
        <ShieldCheck className="w-4 h-4" />
        Send OTP
      </Button>
    </form>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const setAuth = useAuthStore((s) => s.setAuth);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('otp');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await authApi.login(email, password)
          : await authApi.register({ email, password, firstName, lastName });
      setAuth(res);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center pt-16 lg:pt-20">
      <Container className="max-w-sm py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col items-center mb-6 text-center">
            <h1 className="text-2xl font-bold text-zumbii-950">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-sm text-text-tertiary mt-1">
              {mode === 'login'
                ? 'Sign in to continue shopping'
                : 'Sign up to add items to your cart and check out'}
            </p>
          </div>

          <Card className="p-6" hover={false}>
            {mode === 'login' && (
              <div className="flex gap-1.5 rounded-lg bg-surface-secondary p-1 mb-4">
                {(['password', 'otp'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setAuthMethod(m);
                      setError('');
                    }}
                    className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors ${
                      authMethod === m
                        ? 'bg-white text-zumbii-950 shadow-sm'
                        : 'text-text-tertiary hover:text-text-secondary'
                    }`}
                  >
                    {m === 'password' ? 'Password' : 'OTP'}
                  </button>
                ))}
              </div>
            )}

            {mode === 'login' && authMethod === 'otp' ? (
              <OtpLoginForm onSuccess={() => router.push(redirectTo)} />
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      First name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Jane"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-zumbii-400/30 focus:border-zumbii-400"
                  />
                </div>
              </div>

              <Button type="submit" variant="gold" className="w-full" loading={loading} disabled={loading}>
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>
            </form>
            )}
          </Card>

          <p className="text-center text-sm text-text-tertiary mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setError('');
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="font-medium text-brand-red-600 hover:text-brand-red-700"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="text-center text-xs text-text-tertiary mt-2">
            <Link href="/" className="hover:text-zumbii-600">
              Back to home
            </Link>
          </p>
        </motion.div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
