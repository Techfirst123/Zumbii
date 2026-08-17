import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { BulkCreateProductDto } from './dto/bulk-create-product.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER)
  @Post('bulk')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create products (e.g. from a spreadsheet import)' })
  bulkCreate(@Body() dto: BulkCreateProductDto) {
    return this.productsService.bulkCreate(dto.items);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List products with filtering' })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  getFeatured() {
    return this.productsService.getFeatured();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Get related products' })
  getRelated(@Param('id') id: string) {
    return this.productsService.findOne(id).then((product) =>
      this.productsService.getRelated(id, product.categoryId),
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SELLER)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
