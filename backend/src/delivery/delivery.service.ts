import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateZoneDto, UpdateZoneDto, AddPincodeDto } from './dto/zone.dto';

export type PincodeStatus = 'ACTIVE' | 'INACTIVE' | 'COMING_SOON' | 'UNLISTED';

export interface PincodeCheckResult {
  code: string;
  serviceable: boolean;
  status: PincodeStatus;
  message: string;
  city?: string;
  state?: string;
  codAvailable?: boolean;
  deliveryDays?: number;
  estimatedDeliveryDate?: string;
}

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async checkPincode(code: string): Promise<PincodeCheckResult> {
    if (!/^\d{6}$/.test(code)) {
      throw new BadRequestException('Enter a valid 6-digit pincode');
    }

    const pincode = await this.prisma.pincode.findUnique({
      where: { code },
      include: { zone: true },
    });

    if (!pincode || !pincode.zone) {
      return {
        code,
        serviceable: false,
        status: 'UNLISTED',
        message: "Sorry, we don't deliver to this pincode yet.",
      };
    }

    const { zone } = pincode;

    if (zone.status === 'COMING_SOON') {
      return {
        code,
        serviceable: false,
        status: 'COMING_SOON',
        city: pincode.city,
        state: pincode.state,
        message: `We're launching in ${pincode.city} soon — check back shortly!`,
      };
    }

    if (zone.status === 'INACTIVE') {
      return {
        code,
        serviceable: false,
        status: 'INACTIVE',
        city: pincode.city,
        state: pincode.state,
        message: `Delivery to ${pincode.city} is temporarily unavailable.`,
      };
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + zone.deliveryDays);

    return {
      code,
      serviceable: true,
      status: 'ACTIVE',
      city: pincode.city,
      state: pincode.state,
      codAvailable: zone.codAvailable,
      deliveryDays: zone.deliveryDays,
      estimatedDeliveryDate: estimatedDeliveryDate.toISOString(),
      message: `Delivery available to ${pincode.city}.`,
    };
  }

  /** Used internally (checkout gating) — same rules as checkPincode, no 400 on a malformed code. */
  async isServiceable(code: string | null | undefined): Promise<boolean> {
    if (!code || !/^\d{6}$/.test(code)) return false;
    const pincode = await this.prisma.pincode.findUnique({
      where: { code },
      include: { zone: true },
    });
    return Boolean(pincode?.zone && pincode.zone.status === 'ACTIVE');
  }

  // ---- Admin: zone + pincode management ----

  async listZones() {
    const zones = await this.prisma.deliveryZone.findMany({
      include: { pincodes: true, _count: { select: { pincodes: true } } },
      orderBy: { name: 'asc' },
    });
    return zones;
  }

  async getZone(id: string) {
    const zone = await this.prisma.deliveryZone.findUnique({
      where: { id },
      include: { pincodes: { orderBy: { code: 'asc' } } },
    });
    if (!zone) throw new NotFoundException('Zone not found');
    return zone;
  }

  async createZone(dto: CreateZoneDto) {
    return this.prisma.deliveryZone.create({ data: dto });
  }

  async updateZone(id: string, dto: UpdateZoneDto) {
    const zone = await this.prisma.deliveryZone.findUnique({ where: { id } });
    if (!zone) throw new NotFoundException('Zone not found');
    return this.prisma.deliveryZone.update({ where: { id }, data: dto });
  }

  async removeZone(id: string) {
    const zone = await this.prisma.deliveryZone.findUnique({ where: { id } });
    if (!zone) throw new NotFoundException('Zone not found');
    // Pincodes aren't deleted — they just fall back to unlisted (onDelete: SetNull).
    await this.prisma.deliveryZone.delete({ where: { id } });
    return { message: 'Zone deleted successfully' };
  }

  async addPincode(zoneId: string, dto: AddPincodeDto) {
    const zone = await this.prisma.deliveryZone.findUnique({ where: { id: zoneId } });
    if (!zone) throw new NotFoundException('Zone not found');

    if (!/^\d{6}$/.test(dto.code)) {
      throw new BadRequestException('Enter a valid 6-digit pincode');
    }

    const existing = await this.prisma.pincode.findUnique({ where: { code: dto.code } });
    if (existing) {
      return this.prisma.pincode.update({
        where: { code: dto.code },
        data: { city: dto.city, state: dto.state, zoneId },
      });
    }

    return this.prisma.pincode.create({
      data: { code: dto.code, city: dto.city, state: dto.state, zoneId },
    });
  }

  async removePincode(zoneId: string, pincodeId: string) {
    const pincode = await this.prisma.pincode.findFirst({ where: { id: pincodeId, zoneId } });
    if (!pincode) throw new NotFoundException('Pincode not found in this zone');
    await this.prisma.pincode.delete({ where: { id: pincodeId } });
    return { message: 'Pincode removed successfully' };
  }
}
