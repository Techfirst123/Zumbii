import { Module } from '@nestjs/common';
import { SellersController } from './sellers.controller';
import { AdminSellersController } from './admin-sellers.controller';
import { SellersService } from './sellers.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SellersController, AdminSellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
