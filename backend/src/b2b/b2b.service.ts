import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { RespondRfqDto } from './dto/respond-rfq.dto';

@Injectable()
export class B2bService {
  constructor(private prisma: PrismaService) {}

  async createRfq(userId: string, dto: CreateRfqDto) {
    return this.prisma.rFQ.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async findAllRfqs(params: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params.status) where.status = params.status;
    if (params.category) where.category = params.category;

    const [rfqs, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
          _count: { select: { responses: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rFQ.count({ where }),
    ]);

    return {
      data: rfqs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMyRfqs(userId: string) {
    return this.prisma.rFQ.findMany({
      where: { userId },
      include: {
        responses: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRfqById(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        responses: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    return rfq;
  }

  async respondToRfq(rfqId: string, userId: string, dto: RespondRfqDto) {
    const rfq = await this.prisma.rFQ.findUnique({ where: { id: rfqId } });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    if (rfq.status !== 'OPEN') {
      throw new ForbiddenException('RFQ is not open for responses');
    }

    return this.prisma.rFQResponse.create({
      data: {
        rfqId,
        userId,
        ...dto,
      },
    });
  }

  async acceptResponse(rfqId: string, responseId: string, userId: string) {
    const rfq = await this.prisma.rFQ.findUnique({ where: { id: rfqId } });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    if (rfq.userId !== userId) {
      throw new ForbiddenException('Only the RFQ owner can accept responses');
    }

    const response = await this.prisma.rFQResponse.findUnique({
      where: { id: responseId },
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    await this.prisma.rFQ.update({
      where: { id: rfqId },
      data: { status: 'ACCEPTED' },
    });

    return this.prisma.rFQResponse.update({
      where: { id: responseId },
      data: { isAccepted: true },
    });
  }

  async closeRfq(id: string, userId: string) {
    const rfq = await this.prisma.rFQ.findUnique({ where: { id } });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    if (rfq.userId !== userId) {
      throw new ForbiddenException('Only the RFQ owner can close it');
    }

    return this.prisma.rFQ.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }
}
