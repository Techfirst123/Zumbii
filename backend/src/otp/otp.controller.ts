import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth/otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Public()
  @Post('send')
  @ApiOperation({ summary: 'Send a login OTP via SMS or email' })
  send(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto);
  }

  @Public()
  @Post('verify')
  @ApiOperation({ summary: 'Verify a login OTP and receive a session' })
  verify(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto);
  }
}
