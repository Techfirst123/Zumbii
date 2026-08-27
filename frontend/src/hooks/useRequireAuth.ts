'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return function requireAuth(): boolean {
    if (user) return true;
    router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
    return false;
  };
}

/**
 * Full-page guard for routes like Checkout/Account that must not render without
 * a session. Waits for the persisted authStore to hydrate on the client before
 * deciding (the persisted `user` is unavailable during SSR/first paint, so
 * checking it too early would bounce an already-logged-in user to /login).
 */
export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
    }
  }, [mounted, user, pathname, router]);

  return { ready: mounted, authenticated: mounted && !!user };
}
