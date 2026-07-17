import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private uploadDir = process.env.UPLOAD_DIR || './uploads';

  constructor() {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch {
      this.uploadDir = '/tmp/uploads';
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    subfolder = 'general',
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const targetDir = path.join(this.uploadDir, subfolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filepath = path.join(targetDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return `/uploads/${subfolder}/${filename}`;
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
    const filepath = path.join(process.cwd(), fileUrl);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
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
