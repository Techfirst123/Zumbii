import { Module } from '@nestjs/common';
import { FranchiseController } from './franchise.controller';
import { AdminFranchiseController } from './admin-franchise.controller';
import { FranchiseService } from './franchise.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FranchiseController, AdminFranchiseController],
  providers: [FranchiseService],
})
export class FranchiseModule {}
