import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminRolesGuard } from '../admin-auth/guards/admin-roles.guard';
import { AdminRoles } from '../admin-auth/decorators/admin-roles.decorator';
import { AuditLogInterceptor } from '../audit/audit-log.interceptor';

@ApiTags('Admin Blog')
@Controller('admin/blog')
@UseGuards(AdminJwtGuard, AdminRolesGuard)
@AdminRoles(AdminRole.CATALOGUE_MANAGER, AdminRole.SUPER_ADMIN)
@UseInterceptors(AuditLogInterceptor)
@ApiBearerAuth()
export class AdminBlogController {
  constructor(private blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a blog post' })
  create(@Request() req: any, @Body() dto: CreateBlogDto) {
    return this.blogService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all blog posts' })
  findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.blogService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog post by ID' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Put(':id/publish')
  @ApiOperation({ summary: 'Publish a blog post' })
  publish(@Param('id') id: string) {
    return this.blogService.publish(id);
  }

  @Put(':id/archive')
  @ApiOperation({ summary: 'Archive a blog post' })
  archive(@Param('id') id: string) {
    return this.blogService.archive(id);
  }
}
