import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { AdminJwtGuard } from './guards/admin-jwt.guard';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Throttle({ 'admin-auth': { limit: 5, ttl: 300000 } })
  @Post('login')
  @ApiOperation({ summary: 'Admin staff login (step 1 of 2: credentials)' })
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto);
  }

  @Throttle({ 'admin-auth': { limit: 5, ttl: 300000 } })
  @Post('2fa/verify')
  @ApiOperation({ summary: 'Admin staff login (step 2 of 2: TOTP code)' })
  verify2fa(@Body() dto: Verify2faDto) {
    return this.adminAuthService.verify2fa(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh admin access token' })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.adminAuthService.refreshToken(refreshToken);
  }

  @UseGuards(AdminJwtGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin logout' })
  logout(@Request() req: any) {
    return this.adminAuthService.logout(req.user.id);
  }

  @UseGuards(AdminJwtGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin profile' })
  me(@Request() req: any) {
    return this.adminAuthService.getProfile(req.user.id);
  }
}
