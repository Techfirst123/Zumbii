import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { DeliveryService } from './delivery.service';
import { CreateZoneDto, UpdateZoneDto, AddPincodeDto } from './dto/zone.dto';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditLogInterceptor } from '../audit/audit-log.interceptor';

@ApiTags('Admin Delivery')
@Controller('admin/delivery/zones')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.ORDER_MANAGER, AdminRole.SUPER_ADMIN)
@UseInterceptors(AuditLogInterceptor)
@ApiBearerAuth()
export class AdminDeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get()
  @ApiOperation({ summary: 'List all delivery zones' })
  list() {
    return this.deliveryService.listZones();
  }

  @Get('pincode-lookup/:code')
  @ApiOperation({ summary: 'Look up city/state/area for a pincode via India Post directory' })
  lookupPincode(@Param('code') code: string) {
    return this.deliveryService.lookupPincode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a delivery zone with its pincodes' })
  get(@Param('id') id: string) {
    return this.deliveryService.getZone(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a delivery zone' })
  create(@Body() dto: CreateZoneDto) {
    return this.deliveryService.createZone(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a delivery zone' })
  update(@Param('id') id: string, @Body() dto: UpdateZoneDto) {
    return this.deliveryService.updateZone(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a delivery zone' })
  remove(@Param('id') id: string) {
    return this.deliveryService.removeZone(id);
  }

  @Post(':id/pincodes')
  @ApiOperation({ summary: 'Add (or reassign) a pincode to this zone' })
  addPincode(@Param('id') id: string, @Body() dto: AddPincodeDto) {
    return this.deliveryService.addPincode(id, dto);
  }

  @Delete(':id/pincodes/:pincodeId')
  @ApiOperation({ summary: 'Remove a pincode from this zone' })
  removePincode(@Param('id') id: string, @Param('pincodeId') pincodeId: string) {
    return this.deliveryService.removePincode(id, pincodeId);
  }
}
