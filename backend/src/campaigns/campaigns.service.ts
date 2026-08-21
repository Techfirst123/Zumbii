import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CampaignStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { AttachProductsDto } from './dto/attach-products.dto';
import { computeEffectiveStatus } from './campaign-status.util';

const campaignInclude = {
  _count: { select: { products: true } },
} satisfies Prisma.CampaignInclude;

function withEffectiveStatus<
  T extends { status: CampaignStatus; startAt: Date; endAt: Date },
>(campaign: T, now: Date = new Date()) {
  return {
    ...campaign,
    effectiveStatus: computeEffectiveStatus(campaign.status, campaign.startAt, campaign.endAt, now),
  };
}

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCampaignDto) {
    if (dto.status === 'ENDED') {
      throw new BadRequestException(
        'A campaign cannot be created with status Ended — publish it, then use "End Campaign Early" if needed.',
      );
    }
    this.validateDates(dto.startAt, dto.endAt);

    const slugExists = await this.prisma.campaign.findUnique({ where: { slug: dto.slug } });
    if (slugExists) {
      throw new ConflictException('Campaign slug already exists');
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        type: dto.type,
        description: dto.description,
        bannerImageUrl: dto.bannerImageUrl,
        startAt: new Date(dto.startAt),
        endAt: new Date(dto.endAt),
        status: dto.status ?? 'DRAFT',
        showOnHomepage: dto.showOnHomepage ?? false,
      },
      include: campaignInclude,
    });

    return withEffectiveStatus(campaign);
  }

  async findAllAdmin(query: QueryCampaignDto) {
    const { search, status, page = 1, limit = 20 } = query;

    const where: Prisma.CampaignWhereInput = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const campaigns = await this.prisma.campaign.findMany({
      where,
      include: campaignInclude,
      orderBy: { createdAt: 'desc' },
    });

    let withStatus = campaigns.map((c) => withEffectiveStatus(c));
    if (status) {
      withStatus = withStatus.filter(
        (c) => c.effectiveStatus.toLowerCase() === status.toLowerCase(),
      );
    }

    const total = withStatus.length;
    const skip = (page - 1) * limit;
    const data = withStatus.slice(skip, skip + limit);

    return { data, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
  }

  async findHomepage() {
    const now = new Date();
    const campaigns = await this.prisma.campaign.findMany({
      where: {
        showOnHomepage: true,
        status: 'ACTIVE',
        startAt: { lte: now },
        endAt: { gte: now },
      },
      include: campaignInclude,
      orderBy: { startAt: 'desc' },
    });

    return campaigns.map((c) => withEffectiveStatus(c, now));
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        ...campaignInclude,
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                sku: true,
                images: true,
                price: true,
                quantity: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return withEffectiveStatus(campaign);
  }

  async findBySlug(slug: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: {
              include: {
                category: { select: { id: true, name: true, slug: true } },
                brand: { select: { id: true, name: true, slug: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const withStatus = withEffectiveStatus(campaign);
    if (withStatus.effectiveStatus !== 'Active') {
      throw new NotFoundException('Campaign not found');
    }

    const products = withStatus.products.map((cp) => ({
      ...cp.product,
      activeCampaign: {
        campaignId: withStatus.id,
        campaignName: withStatus.name,
        campaignSlug: withStatus.slug,
        campaignPrice: Number(cp.campaignPrice),
        discountPercent: Number(cp.discountPercent),
      },
    }));

    return { ...withStatus, products };
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    if (dto.status === 'ENDED') {
      throw new BadRequestException('Use "End Campaign Early" to end a campaign, not the general update.');
    }

    const startAt = dto.startAt ? new Date(dto.startAt) : campaign.startAt;
    const endAt = dto.endAt ? new Date(dto.endAt) : campaign.endAt;
    if (endAt <= startAt) {
      throw new BadRequestException('End date must be after start date');
    }

    if (dto.slug && dto.slug !== campaign.slug) {
      const slugExists = await this.prisma.campaign.findUnique({ where: { slug: dto.slug } });
      if (slugExists) {
        throw new ConflictException('Campaign slug already exists');
      }
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.bannerImageUrl !== undefined && { bannerImageUrl: dto.bannerImageUrl }),
        ...(dto.startAt !== undefined && { startAt: new Date(dto.startAt) }),
        ...(dto.endAt !== undefined && { endAt: new Date(dto.endAt) }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.showOnHomepage !== undefined && { showOnHomepage: dto.showOnHomepage }),
      },
      include: campaignInclude,
    });

    return withEffectiveStatus(updated);
  }

  async endEarly(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const updated = await this.prisma.campaign.update({
      where: { id },
      data: { status: 'ENDED' },
      include: campaignInclude,
    });

    return withEffectiveStatus(updated);
  }

  async remove(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    await this.prisma.campaign.delete({ where: { id } });

    return { message: 'Campaign deleted successfully' };
  }

  async attachProducts(campaignId: string, dto: AttachProductsDto) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const warnings: string[] = [];
    const attached: Prisma.CampaignProductGetPayload<{ include: { product: true } }>[] = [];

    for (const item of dto.items) {
      if (item.campaignPrice === undefined && item.discountPercent === undefined) {
        throw new BadRequestException(
          `Product ${item.productId}: provide either a campaign price or a discount percent.`,
        );
      }

      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      const regularPrice = Number(product.price);
      let campaignPrice: number;
      let discountPercent: number;

      if (item.campaignPrice !== undefined) {
        campaignPrice = item.campaignPrice;
        discountPercent = Math.round((1 - campaignPrice / regularPrice) * 10000) / 100;
      } else {
        discountPercent = item.discountPercent as number;
        campaignPrice = Math.round(regularPrice * (1 - discountPercent / 100) * 100) / 100;
      }

      if (campaignPrice >= regularPrice) {
        warnings.push(
          `${product.name}: campaign price (₹${campaignPrice}) is not lower than the regular price (₹${regularPrice}).`,
        );
      }

      const siblings = await this.prisma.campaignProduct.findMany({
        where: {
          productId: item.productId,
          campaignId: { not: campaignId },
          campaign: {
            status: 'ACTIVE',
            startAt: { lte: campaign.endAt },
            endAt: { gte: campaign.startAt },
          },
        },
        include: { campaign: { select: { name: true } } },
      });

      for (const sibling of siblings) {
        if (Number(sibling.campaignPrice) !== campaignPrice) {
          warnings.push(
            `${product.name} is already in overlapping campaign "${sibling.campaign.name}" at a different price (₹${sibling.campaignPrice} vs ₹${campaignPrice}) — this may confuse customers if both are shown.`,
          );
        }
      }

      const row = await this.prisma.campaignProduct.upsert({
        where: { campaignId_productId: { campaignId, productId: item.productId } },
        create: {
          campaignId,
          productId: item.productId,
          campaignPrice,
          discountPercent,
          stockCap: item.stockCap,
        },
        update: {
          campaignPrice,
          discountPercent,
          stockCap: item.stockCap ?? null,
        },
        include: { product: true },
      });

      attached.push(row);
    }

    return { attached, warnings };
  }

  async detachProduct(campaignId: string, productId: string) {
    const row = await this.prisma.campaignProduct.findUnique({
      where: { campaignId_productId: { campaignId, productId } },
    });
    if (!row) {
      throw new NotFoundException('Product is not attached to this campaign');
    }

    await this.prisma.campaignProduct.delete({
      where: { campaignId_productId: { campaignId, productId } },
    });

    return { message: 'Product removed from campaign' };
  }

  private validateDates(startAt: string, endAt: string) {
    if (new Date(endAt) <= new Date(startAt)) {
      throw new BadRequestException('End date must be after start date');
    }
  }
}
