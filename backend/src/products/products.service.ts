import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/product-variant.dto';
import { getActiveCampaignsByProductId } from '../campaigns/active-campaign.util';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function buildVariantData(v: CreateVariantDto, baseSku: string) {
  return {
    sku: v.sku?.trim() || `${baseSku}-${slugify(Object.values(v.optionValues).join('-'))}`,
    price: v.price,
    comparePrice: v.comparePrice,
    costPrice: v.costPrice,
    quantity: v.quantity,
    images: v.images ?? [],
    optionValues: v.optionValues as Prisma.InputJsonValue,
    isActive: v.isActive ?? true,
  };
}

const PRODUCT_INCLUDE = {
  category: true,
  brand: true,
  variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' as const } },
};

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const { variants, variantOptions, ...rest } = dto;

    const slugExists = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (slugExists) {
      throw new ConflictException('Product slug already exists');
    }

    const skuExists = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (skuExists) {
      throw new ConflictException('Product SKU already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        ...rest,
        variantOptions: (variantOptions as unknown as Prisma.InputJsonValue) ?? undefined,
        variants: variants?.length
          ? { create: variants.map((v) => buildVariantData(v, dto.sku)) }
          : undefined,
      },
      include: PRODUCT_INCLUDE,
    });

    if (variants?.length) {
      return this.syncAggregatesFromVariants(product.id);
    }

    return product;
  }

  async bulkCreate(dtos: CreateProductDto[]) {
    const results: Array<
      | { index: number; success: true; product: Awaited<ReturnType<ProductsService['create']>> }
      | { index: number; success: false; error: string }
    > = [];

    for (let i = 0; i < dtos.length; i++) {
      try {
        const product = await this.create(dtos[i]);
        results.push({ index: i, success: true, product });
      } catch (err) {
        results.push({
          index: i,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return {
      created: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      results,
    };
  }

  async findAll(query: QueryProductDto) {
    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      isFeatured,
      page = 1,
      limit = 12,
    } = query;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const campaignMap = await getActiveCampaignsByProductId(
      this.prisma,
      products.map((p) => p.id),
    );

    return {
      data: products.map((p) => ({ ...p, activeCampaign: campaignMap.get(p.id) ?? null })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
        reviews: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const campaignMap = await getActiveCampaignsByProductId(this.prisma, [product.id]);
    return { ...product, activeCampaign: campaignMap.get(product.id) ?? null };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
        reviews: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const campaignMap = await getActiveCampaignsByProductId(this.prisma, [product.id]);
    return { ...product, activeCampaign: campaignMap.get(product.id) ?? null };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.slug && dto.slug !== product.slug) {
      const slugExists = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException('Product slug already exists');
      }
    }

    if (dto.sku && dto.sku !== product.sku) {
      const skuExists = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (skuExists) {
        throw new ConflictException('Product SKU already exists');
      }
    }

    const { variants, variantOptions, ...rest } = dto;

    await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(variantOptions !== undefined
          ? { variantOptions: variantOptions as unknown as Prisma.InputJsonValue }
          : {}),
      },
    });

    if (variants !== undefined) {
      await this.prisma.productVariant.deleteMany({ where: { productId: id } });
      if (variants.length > 0) {
        await this.prisma.productVariant.createMany({
          data: variants.map((v) => ({
            productId: id,
            ...buildVariantData(v, dto.sku ?? product.sku),
          })),
        });
      }
      return this.syncAggregatesFromVariants(id);
    }

    return this.prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE });
  }

  async syncAggregatesFromVariants(productId: string) {
    const [variants, product] = await Promise.all([
      this.prisma.productVariant.findMany({ where: { productId, isActive: true } }),
      this.prisma.product.findUnique({ where: { id: productId } }),
    ]);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (variants.length === 0) {
      return this.prisma.product.findUnique({ where: { id: productId }, include: PRODUCT_INCLUDE });
    }

    const cheapest = variants.reduce((min, v) => (Number(v.price) < Number(min.price) ? v : min));
    const totalQuantity = variants.reduce((sum, v) => sum + v.quantity, 0);
    const mirroredImages =
      product.images.length === 0 ? variants.find((v) => v.images.length > 0)?.images : undefined;

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        price: cheapest.price,
        comparePrice: cheapest.comparePrice,
        quantity: totalQuantity,
        ...(mirroredImages ? { images: mirroredImages } : {}),
      },
      include: PRODUCT_INCLUDE,
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Product deleted successfully' };
  }

  async getFeatured() {
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const campaignMap = await getActiveCampaignsByProductId(
      this.prisma,
      products.map((p) => p.id),
    );
    return products.map((p) => ({ ...p, activeCampaign: campaignMap.get(p.id) ?? null }));
  }

  async getRelated(productId: string, categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: { not: productId },
      },
      take: 4,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
      },
    });

    const campaignMap = await getActiveCampaignsByProductId(
      this.prisma,
      products.map((p) => p.id),
    );
    return products.map((p) => ({ ...p, activeCampaign: campaignMap.get(p.id) ?? null }));
  }

  async updateStock(id: string, quantity: number) {
    return this.prisma.product.update({
      where: { id },
      data: { quantity: { decrement: quantity }, soldCount: { increment: quantity } },
    });
  }
}
