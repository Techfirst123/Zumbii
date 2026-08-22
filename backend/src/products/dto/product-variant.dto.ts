import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VariantOptionValueDto {
  @ApiProperty()
  @IsString()
  label: string;

  @ApiPropertyOptional({ description: 'Hex color, e.g. #F5E050 — renders as a swatch instead of a chip' })
  @IsOptional()
  @IsString()
  swatch?: string;
}

export class VariantOptionTypeDto {
  @ApiProperty({ description: 'e.g. "Size", "Fragrance", "Color"' })
  @IsString()
  name: string;

  @ApiProperty({ type: [VariantOptionValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionValueDto)
  values: VariantOptionValueDto[];
}

export class CreateVariantDto {
  @ApiPropertyOptional({ description: 'Auto-generated from the parent SKU + option values if omitted' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  comparePrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  costPrice?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ description: 'e.g. {"Size":"500ml","Fragrance":"Lemon"}' })
  @IsObject()
  optionValues: Record<string, string>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
