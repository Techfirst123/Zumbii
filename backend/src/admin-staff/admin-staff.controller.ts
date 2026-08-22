import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminStaffService } from './admin-staff.service';
import { CreateAdminStaffDto } from './dto/create-admin-staff.dto';
import { UpdateAdminStaffDto } from './dto/update-admin-staff.dto';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditLogInterceptor } from '../audit/audit-log.interceptor';

@ApiTags('Admin Staff')
@Controller('admin/staff')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.SUPER_ADMIN)
@UseInterceptors(AuditLogInterceptor)
@ApiBearerAuth()
export class AdminStaffController {
  constructor(private adminStaffService: AdminStaffService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new admin staff account' })
  create(@Body() dto: CreateAdminStaffDto) {
    return this.adminStaffService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List admin staff accounts' })
  findAll() {
    return this.adminStaffService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin staff account by ID' })
  findOne(@Param('id') id: string) {
    return this.adminStaffService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role / active status of an admin staff account' })
  update(@Param('id') id: string, @Body() dto: UpdateAdminStaffDto) {
    return this.adminStaffService.update(id, dto);
  }

  @Put(':id/reset-2fa')
  @ApiOperation({ summary: 'Reset an admin staff account 2FA (forces re-enrollment)' })
  resetTwoFactor(@Param('id') id: string) {
    return this.adminStaffService.resetTwoFactor(id);
  }
}
