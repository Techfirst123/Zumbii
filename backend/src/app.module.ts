import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { FranchiseModule } from './franchise/franchise.module';
import { SellersModule } from './sellers/sellers.module';
import { B2bModule } from './b2b/b2b.module';
import { BlogModule } from './blog/blog.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    FranchiseModule,
    SellersModule,
    B2bModule,
    BlogModule,
    UploadModule,
  ],
})
export class AppModule {}
