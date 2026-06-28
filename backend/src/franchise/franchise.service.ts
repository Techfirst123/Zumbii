import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseStatusDto } from './dto/update-franchise-status.dto';

@Injectable()
export class FranchiseService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFranchiseDto) {
    return this.prisma.franchiseApplication.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params.status) where.status = params.status;

    const [applications, total] = await Promise.all([
      this.prisma.franchiseApplication.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.franchiseApplication.count({ where }),
    ]);

    return {
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMyApplications(userId: string) {
    return this.prisma.franchiseApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.franchiseApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('Franchise application not found');
    }

    return application;
  }

  async updateStatus(id: string, dto: UpdateFranchiseStatusDto) {
    const application = await this.prisma.franchiseApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Franchise application not found');
    }

    const data: any = {
      status: dto.status,
      reviewedAt: new Date(),
      rejectionReason: dto.rejectionReason,
    };

    return this.prisma.franchiseApplication.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }
}
