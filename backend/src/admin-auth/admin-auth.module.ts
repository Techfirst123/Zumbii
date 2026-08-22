import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { AdminRolesGuard } from './guards/admin-roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'admin-jwt' }),
    JwtModule.register({
      secret:
        process.env.ADMIN_JWT_SECRET ||
        'change-me-admin-secret-must-differ-from-customer-jwt-secret',
      signOptions: { expiresIn: process.env.ADMIN_JWT_EXPIRATION || '30m' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtStrategy, AdminRolesGuard],
  exports: [AdminAuthService, JwtModule, PassportModule, AdminRolesGuard],
})
export class AdminAuthModule {}
