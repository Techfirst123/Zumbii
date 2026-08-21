import { IsArray, IsString, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AttachProductItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional({ description: 'Provide either campaignPrice or discountPercent — the other is computed server-side' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  campaignPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountPercent?: number;

  @ApiPropertyOptional({ description: 'Campaign-only stock cap, separate from real inventory' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockCap?: number;
}

export class AttachProductsDto {
  @ApiProperty({ type: [AttachProductItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachProductItemDto)
  items: AttachProductItemDto[];
}
