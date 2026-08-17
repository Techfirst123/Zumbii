import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async checkPincode(code: string) {
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException('Enter a valid 6-digit pincode');
    }

    const pincode = await this.prisma.pincode.findUnique({ where: { code } });

    if (!pincode || !pincode.isServiceable) {
      return { code, serviceable: false };
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(
      estimatedDeliveryDate.getDate() + pincode.deliveryDays,
    );

    return {
      code,
      serviceable: true,
      city: pincode.city,
      state: pincode.state,
      codAvailable: pincode.codAvailable,
      deliveryDays: pincode.deliveryDays,
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
    };
  }
}
