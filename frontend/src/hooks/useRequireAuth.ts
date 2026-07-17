'use client';

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
