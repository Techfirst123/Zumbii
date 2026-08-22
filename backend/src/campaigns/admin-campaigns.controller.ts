import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { AttachProductsDto } from './dto/attach-products.dto';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditLogInterceptor } from '../audit/audit-log.interceptor';

@ApiTags('Admin Campaigns')
@Controller('admin/campaigns')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.CATALOGUE_MANAGER, AdminRole.SUPER_ADMIN)
@UseInterceptors(AuditLogInterceptor)
@ApiBearerAuth()
export class AdminCampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new campaign' })
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List campaigns' })
  findAll(@Query() query: QueryCampaignDto) {
    return this.campaignsService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a campaign' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, dto);
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'Force-end a campaign early' })
  endEarly(@Param('id') id: string) {
    return this.campaignsService.endEarly(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a campaign' })
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @Post(':id/products')
  @ApiOperation({ summary: 'Attach products to a campaign' })
  attachProducts(@Param('id') id: string, @Body() dto: AttachProductsDto) {
    return this.campaignsService.attachProducts(id, dto);
  }

  @Delete(':id/products/:productId')
  @ApiOperation({ summary: 'Detach a product from a campaign' })
  detachProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.campaignsService.detachProduct(id, productId);
  }
}
