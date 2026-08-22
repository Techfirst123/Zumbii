import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminStaffDto } from './dto/create-admin-staff.dto';
import { UpdateAdminStaffDto } from './dto/update-admin-staff.dto';

const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  twoFactorEnabled: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class AdminStaffService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdminStaffDto) {
    const existing = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An admin account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    return this.prisma.adminUser.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
      },
      select: SAFE_SELECT,
    });
  }

  findAll() {
    return this.prisma.adminUser.findMany({
      select: SAFE_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const admin = await this.prisma.adminUser.findUnique({ where: { id }, select: SAFE_SELECT });
    if (!admin) {
      throw new NotFoundException('Admin account not found');
    }
    return admin;
  }

  async update(id: string, dto: UpdateAdminStaffDto) {
    await this.findOne(id);
    return this.prisma.adminUser.update({
      where: { id },
      data: dto,
      select: SAFE_SELECT,
    });
  }

  async resetTwoFactor(id: string) {
    await this.findOne(id);
    // Clears the enrolled secret; the account must re-enroll 2FA on next login.
    return this.prisma.adminUser.update({
      where: { id },
      data: { twoFactorEnabled: false, twoFactorSecret: null, refreshToken: null },
      select: SAFE_SELECT,
    });
  }
}
