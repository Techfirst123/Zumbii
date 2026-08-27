import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my wishlist' })
  list(@Request() req: any) {
    return this.wishlistService.list(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a product to my wishlist' })
  add(@Request() req: any, @Body() dto: AddWishlistItemDto) {
    return this.wishlistService.add(req.user.id, dto.productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a product from my wishlist' })
  remove(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, productId);
  }
}
