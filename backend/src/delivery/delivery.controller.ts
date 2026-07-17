import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Public()
  @Get('pincode/:code')
  @ApiOperation({ summary: 'Check delivery serviceability for a pincode' })
  checkPincode(@Param('code') code: string) {
    return this.deliveryService.checkPincode(code);
  }
}
