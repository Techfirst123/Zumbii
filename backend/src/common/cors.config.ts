export const ADMIN_API_PATH_REGEX = /^\/api\/v\d+\/admin/;

function parseOrigins(value: string | undefined): string[] {
  return (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function corsOptionsFor(scope: 'admin' | 'storefront') {
  if (scope === 'admin') {
    const origins = parseOrigins(process.env.ADMIN_CORS_ORIGIN);
    return {
      // No ADMIN_CORS_ORIGIN configured => no browser origin is allowed at all,
      // which is the safe default for a namespace that should only ever be
      // called from the admin app's own origin.
      origin: origins.length > 0 ? origins : false,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      credentials: true,
    };
  }

  // Falls back to the legacy single-origin CORS_ORIGIN var during migration.
  const origins = parseOrigins(process.env.STOREFRONT_CORS_ORIGIN || process.env.CORS_ORIGIN);
  return {
    origin: origins.length > 0 ? origins : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  };
}
