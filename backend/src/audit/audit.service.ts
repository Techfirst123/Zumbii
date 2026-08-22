import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RecordAuditEntryInput {
  adminUserId: string | null;
  adminEmail: string;
  action: string;
  method: string;
  path: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async record(entry: RecordAuditEntryInput) {
    await this.prisma.auditLog.create({
      data: {
        adminUserId: entry.adminUserId,
        adminEmail: entry.adminEmail,
        action: entry.action,
        method: entry.method,
        path: entry.path,
        entityType: entry.entityType,
        entityId: entry.entityId,
        metadata: entry.metadata as any,
        ip: entry.ip,
      },
    });
  }

  async findAll(params: { page: number; limit: number; adminEmail?: string; action?: string }) {
    const { page, limit, adminEmail, action } = params;
    const where: any = {};
    if (adminEmail) where.adminEmail = { contains: adminEmail, mode: 'insensitive' };
    if (action) where.action = { contains: action, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
