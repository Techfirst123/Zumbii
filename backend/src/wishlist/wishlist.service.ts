import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    const items = await this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: { include: { seller: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      addedAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        comparePrice: item.product.comparePrice,
        gstRate: item.product.gstRate,
        images: item.product.images,
        rating: item.product.rating,
        reviewCount: item.product.reviewCount,
        inStock: item.product.quantity > 0 && item.product.isActive,
        seller: item.product.seller?.businessName ?? null,
      },
    }));
  }

  async add(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });

    return { message: 'Added to wishlist' };
  }

  async remove(userId: string, productId: string) {
    const existing = await this.prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (!existing) {
      throw new NotFoundException('Item is not in your wishlist');
    }

    await this.prisma.wishlist.delete({ where: { id: existing.id } });
    return { message: 'Removed from wishlist' };
  }
}
