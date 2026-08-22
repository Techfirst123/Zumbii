import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

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
}
