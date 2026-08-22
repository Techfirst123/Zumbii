import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2faDto {
  @ApiProperty({ description: 'Short-lived pending token returned by /admin/auth/login' })
  @IsString()
  pendingToken: string;

  @ApiProperty({ description: '6-digit TOTP code from the authenticator app' })
  @IsString()
  @Length(6, 6)
  token: string;
}
