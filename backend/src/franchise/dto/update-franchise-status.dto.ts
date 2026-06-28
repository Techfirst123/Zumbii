import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FranchiseStatus } from '@prisma/client';

export class UpdateFranchiseStatusDto {
  @ApiProperty({ enum: FranchiseStatus })
  @IsEnum(FranchiseStatus)
  status: FranchiseStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
