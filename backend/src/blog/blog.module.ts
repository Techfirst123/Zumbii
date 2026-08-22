import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { AdminBlogController } from './admin-blog.controller';
import { BlogService } from './blog.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BlogController, AdminBlogController],
  providers: [BlogService],
})
export class BlogModule {}
