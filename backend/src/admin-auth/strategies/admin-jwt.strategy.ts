import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

interface AdminJwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.ADMIN_JWT_SECRET ||
        'change-me-admin-secret-must-differ-from-customer-jwt-secret',
      issuer: 'zumbii-admin',
      audience: 'admin',
    });
  }

  async validate(payload: AdminJwtPayload) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        twoFactorEnabled: true,
      },
    });

    if (!admin || !admin.isActive || !admin.twoFactorEnabled) {
      throw new UnauthorizedException('Admin account not found or inactive');
    }

    return admin;
  }
}
