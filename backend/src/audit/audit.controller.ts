import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditService } from './audit.service';

@ApiTags('Admin Audit Log')
@Controller('admin/audit-logs')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'List audit log entries (Super Admin only)' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('adminEmail') adminEmail?: string,
    @Query('action') action?: string,
  ) {
    return this.auditService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
      adminEmail,
      action,
    });
  }
}
