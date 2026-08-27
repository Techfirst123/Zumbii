import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async subscribe(email: string) {
    const normalized = email.trim().toLowerCase();
    await this.prisma.newsletterSubscriber.upsert({
      where: { email: normalized },
      create: { email: normalized },
      update: {},
    });
    return { message: 'Subscribed successfully' };
  }
}
