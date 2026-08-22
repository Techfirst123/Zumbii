import { Controller, Put, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { SellersService } from './sellers.service';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditLogInterceptor } from '../audit/audit-log.interceptor';

@ApiTags('Admin Sellers')
@Controller('admin/sellers')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.FRANCHISE_MANAGER, AdminRole.SUPER_ADMIN)
@UseInterceptors(AuditLogInterceptor)
@ApiBearerAuth()
export class AdminSellersController {
  constructor(private sellersService: SellersService) {}

  @Put(':id/verify')
  @ApiOperation({ summary: 'Verify seller' })
  verify(@Param('id') id: string) {
    return this.sellersService.verify(id);
  }

  @Put(':id/reject')
  @ApiOperation({ summary: 'Reject seller' })
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.sellersService.reject(id, reason);
  }

  @Put(':id/suspend')
  @ApiOperation({ summary: 'Suspend seller' })
  suspend(@Param('id') id: string) {
    return this.sellersService.suspend(id);
  }
}
