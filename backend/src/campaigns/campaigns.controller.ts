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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { AttachProductsDto } from './dto/attach-products.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new campaign' })
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List campaigns (admin)' })
  findAll(@Query() query: QueryCampaignDto) {
    return this.campaignsService.findAllAdmin(query);
  }

  @Public()
  @Get('homepage')
  @ApiOperation({ summary: 'Get campaigns flagged for homepage display' })
  getHomepage() {
    return this.campaignsService.findHomepage();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get an active campaign by slug (storefront)' })
  findBySlug(@Param('slug') slug: string) {
    return this.campaignsService.findBySlug(slug);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get campaign by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a campaign' })
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id/end')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Force-end a campaign early' })
  endEarly(@Param('id') id: string) {
    return this.campaignsService.endEarly(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a campaign' })
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post(':id/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Attach products to a campaign' })
  attachProducts(@Param('id') id: string, @Body() dto: AttachProductsDto) {
    return this.campaignsService.attachProducts(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id/products/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detach a product from a campaign' })
  detachProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.campaignsService.detachProduct(id, productId);
  }
}
