import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [AuthModule, ProductsModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
