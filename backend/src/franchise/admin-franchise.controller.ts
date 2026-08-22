import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { FranchiseService } from './franchise.service';
import { UpdateFranchiseStatusDto } from './dto/update-franchise-status.dto';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditLogInterceptor } from '../audit/audit-log.interceptor';

@ApiTags('Admin Franchise')
@Controller('admin/franchise')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.FRANCHISE_MANAGER, AdminRole.SUPER_ADMIN)
@UseInterceptors(AuditLogInterceptor)
@ApiBearerAuth()
export class AdminFranchiseController {
  constructor(private franchiseService: FranchiseService) {}

  @Get()
  @ApiOperation({ summary: 'List all franchise applications' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.franchiseService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get franchise application by ID' })
  findOne(@Param('id') id: string) {
    return this.franchiseService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update franchise application status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateFranchiseStatusDto) {
    return this.franchiseService.updateStatus(id, dto);
  }
}
