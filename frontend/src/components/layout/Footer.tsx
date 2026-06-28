'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  ArrowRight,
  Check,
  Smartphone,
} from 'lucide-react';
import { siteConfig, footerLinks, supportLinks } from '@/lib/constants';
import clsx from 'clsx';

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-surface-secondary">
      {/* Newsletter section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-text-primary">
                Stay in the loop
              </h3>
              <p className="mt-2 text-text-secondary">
                Get exclusive deals, new arrivals, and franchise opportunities
                delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-12 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-zumbii-300 focus:outline-none focus:ring-2 focus:ring-zumbii-100"
                />
              </div>
              <button
                type="submit"
                className={clsx(
                  'flex h-12 items-center gap-2 rounded-xl px-6 font-medium text-white transition-all',
                  subscribed
                    ? 'bg-emerald-500'
                    : 'bg-zumbii-600 hover:bg-zumbii-700 active:bg-zumbii-800'
                )}
              >
                {subscribed ? (
                  <>
                    <Check className="h-4 w-4" />
                    Done
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zumbii-600 text-base font-bold text-white">
                Z
              </div>
              <span className="text-xl font-bold text-text-primary">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary">
              India&apos;s premier B2B & B2C marketplace. Empowering businesses,
              connecting communities, and growing together.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <MapPin className="h-4 w-4 shrink-0 text-zumbii-500" />
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Phone className="h-4 w-4 shrink-0 text-zumbii-500" />
                <span>{siteConfig.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail className="h-4 w-4 shrink-0 text-zumbii-500" />
                <span>{siteConfig.email}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {[footerLinks.company, footerLinks.quickLinks, footerLinks.customerService].map(
            (section) => (
              <div key={section.title}>
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-zumbii-600"
                      >
                        <ChevronRight className="h-3 w-3 shrink-0 text-zumbii-400 opacity-0 transition-all group-hover:opacity-100" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* Connect & Download */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Connect
            </h4>
            <div className="mb-6 flex gap-3">
              {footerLinks.connect.links.map((link) => {
                const Icon = socialIcons[link.icon] || Facebook;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-text-secondary shadow-sm transition-all hover:bg-zumbii-600 hover:text-white hover:shadow-md"
                    aria-label={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>

            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Download App
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href={siteConfig.download.appStore}
                className="flex items-center gap-3 rounded-xl bg-black px-4 py-3 text-white transition-opacity hover:opacity-90"
              >
                <Smartphone className="h-6 w-6" />
                <div className="text-left text-xs leading-tight">
                  <span className="block opacity-70">Download on</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </Link>
              <Link
                href={siteConfig.download.googlePlay}
                className="flex items-center gap-3 rounded-xl bg-black px-4 py-3 text-white transition-opacity hover:opacity-90"
              >
                <Smartphone className="h-6 w-6" />
                <div className="text-left text-xs leading-tight">
                  <span className="block opacity-70">Get it on</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
              <span>
                &copy; {currentYear} {siteConfig.name}. All rights reserved.
              </span>
              <span className="hidden text-border lg:inline">|</span>
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-zumbii-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="text-center text-xs italic text-text-tertiary lg:text-right">
              &ldquo;{siteConfig.tagline}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
