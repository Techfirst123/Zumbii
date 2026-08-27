import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CouponValidationResult {
  code: string;
  description: string | null;
  discountType: string;
  discountAmount: number;
}

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  /** Shared by the /coupons/validate preview endpoint and OrdersService.create(). */
  async validate(rawCode: string, subtotal: number): Promise<CouponValidationResult> {
    const code = rawCode.trim().toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

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
        `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`,
      );
    }

    let discountAmount =
      coupon.discountType === 'percentage'
        ? (subtotal * Number(coupon.discountValue)) / 100
        : Number(coupon.discountValue);

    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
    }
    discountAmount = Math.min(Math.round(discountAmount), subtotal);

    return {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountAmount,
    };
  }

  async recordUsage(code: string) {
    await this.prisma.coupon.update({
      where: { code },
      data: { usedCount: { increment: 1 } },
    });
  }
}
