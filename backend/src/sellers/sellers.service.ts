import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SellerStatus } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, dto: CreateSellerDto) {
    const existing = await this.prisma.seller.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new ConflictException('Seller profile already exists');
    }

    return this.prisma.seller.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async getMyProfile(userId: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { userId },
      include: {
        products: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { products: true } },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    return seller;
  }

  async updateMyProfile(userId: string, dto: UpdateSellerDto) {
    const seller = await this.prisma.seller.findUnique({ where: { userId } });

    if (!seller) {
      throw new NotFoundException('Seller profile not found');
    }

    return this.prisma.seller.update({
      where: { userId },
      data: dto,
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params.status) where.status = params.status;

    if (params.search) {
      where.OR = [
        { businessName: { contains: params.search, mode: 'insensitive' } },
        { businessEmail: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [sellers, total] = await Promise.all([
      this.prisma.seller.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.seller.count({ where }),
    ]);

    return {
      data: sellers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }

  async verify(id: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id } });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.prisma.seller.update({
      where: { id },
      data: {
        status: SellerStatus.APPROVED,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });
  }

  async reject(id: string, reason: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id } });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (!reason) {
      throw new BadRequestException('Rejection reason is required');
    }

    return this.prisma.seller.update({
      where: { id },
      data: {
        status: SellerStatus.REJECTED,
        rejectionReason: reason,
      },
    });
  }

  async suspend(id: string) {
    const seller = await this.prisma.seller.findUnique({ where: { id } });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return this.prisma.seller.update({
      where: { id },
      data: { status: SellerStatus.SUSPENDED },
    });
  }
}
