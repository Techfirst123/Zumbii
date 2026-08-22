import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';

@ApiTags('Admin Upload')
@Controller('admin/upload')
@UseGuards(AdminJwtGuard)
@ApiBearerAuth()
export class AdminUploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images')
  @ApiOperation({ summary: 'Upload product/category/campaign images (admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5242880 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadMultiple(files, 'products');
    return { urls };
  }
}
