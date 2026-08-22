import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;

    if (!WRITE_METHODS.has(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const admin = req.user;
        if (!admin) return;

        const routePath: string = req.route?.path || req.path;
        const segments = routePath.split('/').filter(Boolean);
        const adminIndex = segments.indexOf('admin');
        const entityType = adminIndex >= 0 ? segments[adminIndex + 1] : undefined;
        const entityId: string | undefined = req.params?.id;

        this.auditService
          .record({
            adminUserId: admin.id,
            adminEmail: admin.email,
            action: `${method} ${routePath}`,
            method,
            path: req.originalUrl || req.url,
            entityType,
            entityId,
            metadata: sanitizeBody(req.body),
            ip: req.ip,
          })
          .catch(() => {
            // audit logging must never break the underlying request
          });
      }),
    );
  }
}

function sanitizeBody(body: unknown): Record<string, unknown> | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const { password, passwordHash, token, ...rest } = body as Record<string, unknown>;
  return rest;
}
