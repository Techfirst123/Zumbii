import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminStaffModule } from './admin-staff/admin-staff.module';
import { AuditModule } from './audit/audit.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { OrdersModule } from './orders/orders.module';
import { FranchiseModule } from './franchise/franchise.module';
import { SellersModule } from './sellers/sellers.module';
import { B2bModule } from './b2b/b2b.module';
import { BlogModule } from './blog/blog.module';
import { UploadModule } from './upload/upload.module';
import { DeliveryModule } from './delivery/delivery.module';
import { OtpModule } from './otp/otp.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        // Generous default for public storefront traffic.
        { name: 'default', ttl: 60000, limit: 120 },
        // Much stricter bucket, applied per-route with @Throttle() on admin auth endpoints.
        { name: 'admin-auth', ttl: 300000, limit: 5 },
      ],
    }),
    PrismaModule,
    AuthModule,
    AdminAuthModule,
    AdminStaffModule,
    AuditModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CampaignsModule,
    OrdersModule,
    FranchiseModule,
    SellersModule,
    B2bModule,
    BlogModule,
    UploadModule,
    DeliveryModule,
    OtpModule,
    WishlistModule,
    CouponsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
