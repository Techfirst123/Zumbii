import { IsArray, ValidateNested, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class BulkCreateProductDto {
  @ApiProperty({ type: [CreateProductDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(500)
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  items: CreateProductDto[];
}
