import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FranchiseService } from './franchise.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';

@ApiTags('Franchise')
@Controller('franchise')
export class FranchiseController {
  constructor(private franchiseService: FranchiseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a franchise application' })
  create(@Request() req: any, @Body() dto: CreateFranchiseDto) {
    return this.franchiseService.create(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my franchise applications' })
  getMyApplications(@Request() req: any) {
    return this.franchiseService.findMyApplications(req.user.id);
  }
}
