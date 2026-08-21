import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto, UpdatePaymentStatusDto } from './dto/update-order-status.dto';
import { getActiveCampaignsByProductId } from '../campaigns/active-campaign.util';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });

    if (!address) {
      throw new BadRequestException('Address not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: dto.items.map((i) => i.productId) },
        isActive: true,
      },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException('Some products are not available');
    }

    const campaignMap = await getActiveCampaignsByProductId(
      this.prisma,
      products.map((p) => p.id),
    );

    let subtotal = 0;
    const orderItems: any[] = [];
    const campaignIncrements: { campaignProductId: string; quantity: number }[] = [];

    for (const item of dto.items) {
      const product = products.find((p: { id: string }) => p.id === item.productId);

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
        );
      }

      const campaign = campaignMap.get(product.id);
      if (campaign && campaign.stockCap !== null) {
        const remaining = campaign.stockCap - campaign.soldCount;
        if (item.quantity > remaining) {
          throw new BadRequestException(
            remaining > 0
              ? `Only ${remaining} unit(s) of ${product.name} left at the ${campaign.campaignName} price.`
              : `${product.name} is sold out at the ${campaign.campaignName} price.`,
          );
        }
        campaignIncrements.push({ campaignProductId: campaign.campaignProductId, quantity: item.quantity });
      }

      const unitPrice = campaign ? campaign.campaignPrice : Number(product.price);
      const total = unitPrice * item.quantity;
      subtotal += total;

      orderItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: unitPrice,
        quantity: item.quantity,
        total,
        image: product.images[0] || null,
      });
    }

    let discountAmount = 0;
    let couponCode: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode },
      });

      if (!coupon || !coupon.isActive) {
        throw new BadRequestException('Invalid coupon code');
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('Coupon has expired');
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }

      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        throw new BadRequestException(
          `Minimum order amount of $${coupon.minOrderAmount} required`,
        );
      }

      if (coupon.discountType === 'percentage') {
        discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
        }
      } else {
        discountAmount = Number(coupon.discountValue);
      }

      couponCode = coupon.code;

      await this.prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const taxRate = 0.08;
    const taxAmount = (subtotal - discountAmount) * taxRate;
    const total = subtotal - discountAmount + shippingCost + taxAmount;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        addressId: dto.addressId,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        total,
        couponCode,
        notes: dto.notes,
        giftMessage: dto.giftMessage,
        items: { create: orderItems },
      },
      include: {
        items: true,
        address: true,
      },
    });

    for (const item of orderItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: { decrement: item.quantity },
          soldCount: { increment: item.quantity },
        },
      });
    }

    for (const increment of campaignIncrements) {
      await this.prisma.campaignProduct.update({
        where: { id: increment.campaignProductId },
        data: { soldCount: { increment: increment.quantity } },
      });
    }

    await this.prisma.cart.deleteMany({
      where: {
        userId,
        productId: { in: dto.items.map((i) => i.productId) },
      },
    });

    return order;
  }

  async findAllByUser(userId: string, params: { page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          items: true,
          address: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
        { orderNumber: { contains: params.search, mode: 'insensitive' } },
        { user: { email: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: true,
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, phone: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const data: any = { status: dto.status };

    if (dto.status === 'SHIPPED') data.shippedAt = new Date();
    if (dto.status === 'DELIVERED') data.deliveredAt = new Date();
    if (dto.status === 'CANCELLED') {
      data.cancelledAt = new Date();
      data.cancelReason = dto.cancelReason;

      for (const item of await this.prisma.orderItem.findMany({ where: { orderId: id } })) {
        await this.prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.quantity },
            soldCount: { decrement: item.quantity },
          },
        });
      }
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: { items: true },
    });
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus: dto.paymentStatus },
    });
  }
}
