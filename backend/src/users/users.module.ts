import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AdminCustomersController } from './admin-customers.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController, AdminCustomersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
