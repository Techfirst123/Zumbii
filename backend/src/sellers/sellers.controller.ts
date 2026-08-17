import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a seller' })
  register(@Request() req: any, @Body() dto: CreateSellerDto) {
    return this.sellersService.register(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my seller profile' })
  getMyProfile(@Request() req: any) {
    return this.sellersService.getMyProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my seller profile' })
  updateMyProfile(@Request() req: any, @Body() dto: UpdateSellerDto) {
    return this.sellersService.updateMyProfile(req.user.id, dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all sellers' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.sellersService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      status,
      search,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get seller by ID' })
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id/verify')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify seller' })
  verify(@Param('id') id: string) {
    return this.sellersService.verify(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id/reject')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject seller' })
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.sellersService.reject(id, reason);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id/suspend')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend seller' })
  suspend(@Param('id') id: string) {
    return this.sellersService.suspend(id);
  }
}
