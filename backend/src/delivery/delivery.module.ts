import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { AdminDeliveryController } from './admin-delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
  controllers: [DeliveryController, AdminDeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
