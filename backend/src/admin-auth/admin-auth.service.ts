import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { PrismaService } from '../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';

const ADMIN_JWT_ISSUER = 'zumbii-admin';
const ADMIN_JWT_AUDIENCE = 'admin';

@Injectable()
export class AdminAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.twoFactorEnabled) {
      const secret = speakeasy.generateSecret({
        name: `Zumbii Admin:${admin.email}`,
      });

      await this.prisma.adminUser.update({
        where: { id: admin.id },
        data: { twoFactorSecret: secret.base32 },
      });

      const pendingToken = this.signPendingToken(admin.id, 'setup');

      return {
        setupRequired: true,
        pendingToken,
        secret: secret.base32,
        otpauthUrl: secret.otpauth_url,
      };
    }

    const pendingToken = this.signPendingToken(admin.id, 'verify');
    return { setupRequired: false, pendingToken };
  }

  async verify2fa(dto: Verify2faDto) {
    let payload: { sub: string; purpose: string };
    try {
      payload = this.jwtService.verify(dto.pendingToken, {
        secret: this.adminJwtSecret(),
        audience: ADMIN_JWT_AUDIENCE,
        issuer: ADMIN_JWT_ISSUER,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired pending token');
    }

    if (payload.purpose !== 'setup' && payload.purpose !== 'verify') {
      throw new UnauthorizedException('Invalid pending token');
    }

    const admin = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive || !admin.twoFactorSecret) {
      throw new UnauthorizedException('2FA is not set up for this account');
    }

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: dto.token,
      window: 1,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const tokens = await this.generateTokens(admin.id, admin.email, admin.role);

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        twoFactorEnabled: true,
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.adminJwtSecret(),
        audience: ADMIN_JWT_AUDIENCE,
        issuer: ADMIN_JWT_ISSUER,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const admin = await this.prisma.adminUser.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive || admin.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(admin.id, admin.email, admin.role);

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async logout(adminId: string) {
    await this.prisma.adminUser.update({
      where: { id: adminId },
      data: { refreshToken: null },
    });
  }

  async getProfile(adminId: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new ForbiddenException('Admin not found');
    }

    return admin;
  }

  private signPendingToken(adminId: string, purpose: 'setup' | 'verify') {
    return this.jwtService.sign(
      { sub: adminId, purpose },
      {
        secret: this.adminJwtSecret(),
        issuer: ADMIN_JWT_ISSUER,
        audience: ADMIN_JWT_AUDIENCE,
        expiresIn: '5m',
      },
    );
  }

  private async generateTokens(adminId: string, email: string, role: string) {
    const payload = { sub: adminId, email, role };
    const secret = this.adminJwtSecret();

    const accessToken = this.jwtService.sign(payload, {
      secret,
      issuer: ADMIN_JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
      expiresIn: process.env.ADMIN_JWT_EXPIRATION || '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret,
      issuer: ADMIN_JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
      expiresIn: process.env.ADMIN_JWT_REFRESH_EXPIRATION || '2h',
    });

    return { accessToken, refreshToken };
  }

  private adminJwtSecret() {
    return (
      process.env.ADMIN_JWT_SECRET ||
      'change-me-admin-secret-must-differ-from-customer-jwt-secret'
    );
  }
}
