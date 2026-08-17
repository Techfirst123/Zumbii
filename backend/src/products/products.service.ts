import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
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

    return this.prisma.product.create({
      data: {
        ...dto,
        price: dto.price,
        comparePrice: dto.comparePrice,
        costPrice: dto.costPrice,
        weight: dto.weight,
      },
      include: {
        category: true,
        brand: true,
      },
    });
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
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
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

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
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

    return product;
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

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        brand: true,
      },
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
    return this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelated(productId: string, categoryId: string) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: { not: productId },
      },
      take: 4,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async updateStock(id: string, quantity: number) {
    return this.prisma.product.update({
      where: { id },
      data: { quantity: { decrement: quantity }, soldCount: { increment: quantity } },
    });
  }
}
