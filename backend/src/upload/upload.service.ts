import { Injectable, BadRequestException } from '@nestjs/common';
import { put, del } from '@vercel/blob';

@Injectable()
export class UploadService {
  async uploadFile(
    file: Express.Multer.File,
    subfolder = 'general',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const blob = await put(`${subfolder}/${file.originalname}`, file.buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.mimetype,
    });

    return blob.url;
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    subfolder = 'general',
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const urls = await Promise.all(
      files.map((file) => this.uploadFile(file, subfolder)),
    );

    return urls;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl.startsWith('http')) {
      return;
    }

    await del(fileUrl);
  }

  validateImage(file: Express.Multer.File): boolean {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    return allowedMimes.includes(file.mimetype);
  }

  validateDocument(file: Express.Multer.File): boolean {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    return allowedMimes.includes(file.mimetype);
  }

  getMaxFileSize(): number {
    return parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
  }
}
