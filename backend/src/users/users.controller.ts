import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my profile' })
  getMe(@Request() req: any) {
    return this.usersService.getMyProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my profile (e.g. complete signup with a name)' })
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMyProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/addresses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my addresses' })
  getMyAddresses(@Request() req: any) {
    return this.usersService.getAddresses(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me/addresses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new address' })
  addAddress(@Request() req: any, @Body() body: any) {
    return this.usersService.addAddress(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me/addresses/:addressId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an address' })
  updateAddress(
    @Request() req: any,
    @Param('addressId') addressId: string,
    @Body() body: any,
  ) {
    return this.usersService.updateAddress(req.user.id, addressId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me/addresses/:addressId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an address' })
  removeAddress(@Request() req: any, @Param('addressId') addressId: string) {
    return this.usersService.removeAddress(req.user.id, addressId);
  }
}
