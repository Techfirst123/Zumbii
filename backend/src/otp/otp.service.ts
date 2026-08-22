import {
  BadRequestException,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { generateOtp, normalizeEmail, normalizePhone } from './utils/normalize';
import { sendOtpSms } from './providers/sms.provider';
import { sendOtpEmail } from './providers/email.provider';

type IdentifierType = 'phone' | 'email';

const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6', 10);
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10);
const OTP_RESEND_COOLDOWN_SECONDS = parseInt(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || '60',
  10,
);

@Injectable()
export class OtpService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private resolveIdentifier(body: { phone?: string; email?: string }): {
    type: IdentifierType;
    value: string;
  } {
    if (body.phone) {
      const value = normalizePhone(body.phone);
      if (!value) {
        throw new BadRequestException(
          'Invalid phone number. Use a 10-digit Indian mobile number.',
        );
      }
      return { type: 'phone', value };
    }
    if (body.email) {
      const value = normalizeEmail(body.email);
      if (!value) throw new BadRequestException('Invalid email address.');
      return { type: 'email', value };
    }
    throw new BadRequestException("Provide either 'phone' or 'email'.");
  }

  async sendOtp(dto: SendOtpDto) {
    const { type, value } = this.resolveIdentifier(dto);

    const existing = await this.prisma.otpCode.findUnique({
      where: { type_identifier: { type, identifier: value } },
    });

    if (existing) {
      const elapsedSeconds = (Date.now() - existing.lastSentAt.getTime()) / 1000;
      const remaining = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds);
      if (remaining > 0) {
        throw new HttpException(
          {
            message: `Please wait ${remaining}s before requesting another OTP.`,
            retryAfterSeconds: remaining,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    const otp = generateOtp(OTP_LENGTH);
    const otpHash = await bcrypt.hash(otp, 10);
    const now = new Date();

    await this.prisma.otpCode.upsert({
      where: { type_identifier: { type, identifier: value } },
      create: {
        type,
        identifier: value,
        otpHash,
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000),
        lastSentAt: now,
      },
      update: {
        otpHash,
        attempts: 0,
        consumedAt: null,
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000),
        lastSentAt: now,
      },
    });

    const result =
      type === 'phone' ? await sendOtpSms(value, otp) : await sendOtpEmail(value, otp, OTP_EXPIRY_MINUTES);

    if (!result.ok) {
      throw new HttpException(
        { message: `Failed to send OTP via ${result.provider}.`, details: result.error },
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      message: `OTP sent via ${type === 'phone' ? 'SMS' : 'email'}.`,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
      devMode: result.provider.endsWith('-dev'),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { type, value } = this.resolveIdentifier(dto);
    if (!dto.otp) throw new BadRequestException("Provide the 'otp' field.");

    const record = await this.prisma.otpCode.findUnique({
      where: { type_identifier: { type, identifier: value } },
    });

    if (!record || record.consumedAt) {
      throw new BadRequestException(
        'No OTP was requested for this identifier, or it was already used.',
      );
    }

    if (new Date() > record.expiresAt) {
      await this.prisma.otpCode.delete({ where: { id: record.id } });
      throw new GoneException('This OTP has expired. Please request a new one.');
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      await this.prisma.otpCode.delete({ where: { id: record.id } });
      throw new HttpException(
        'Too many incorrect attempts. Please request a new OTP.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const match = await bcrypt.compare(String(dto.otp), record.otpHash);
    if (!match) {
      const attempts = record.attempts + 1;
      await this.prisma.otpCode.update({ where: { id: record.id }, data: { attempts } });
      const attemptsLeft = OTP_MAX_ATTEMPTS - attempts;
      throw new UnauthorizedException(`Incorrect OTP. ${attemptsLeft} attempt(s) left.`);
    }

    await this.prisma.otpCode.delete({ where: { id: record.id } });

    // Stored phone numbers aren't normalized elsewhere in the app (raw 10-digit,
    // +91-prefixed, etc.), so match on the national number's last 10 digits.
    const user = await this.prisma.user.findFirst({
      where:
        type === 'phone' ? { phone: { endsWith: value.replace('+91', '') } } : { email: value },
    });

    if (!user) {
      throw new NotFoundException(
        `No account found for this ${type === 'phone' ? 'phone number' : 'email'}. Please sign up first.`,
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
        ...(type === 'phone' ? { isPhoneVerified: true } : { isEmailVerified: true }),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
      ...tokens,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });
    return { accessToken, refreshToken };
  }
}
