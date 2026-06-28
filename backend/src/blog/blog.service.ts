import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogStatus } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBlogDto) {
    const existing = await this.prisma.blog.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Blog slug already exists');
    }

    const data: any = {
      authorId: userId,
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImage: dto.coverImage,
      tags: dto.tags || [],
      status: dto.status || BlogStatus.DRAFT,
    };

    if (data.status === BlogStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }

    return this.prisma.blog.create({
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    status?: string;
    tag?: string;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (params.status) {
      where.status = params.status;
    } else {
      where.status = BlogStatus.PUBLISHED;
    }

    if (params.tag) {
      where.tags = { has: params.tag };
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { excerpt: { contains: params.search, mode: 'insensitive' } },
        { content: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return post;
  }

  async update(id: string, dto: UpdateBlogDto) {
    const post = await this.prisma.blog.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    if (dto.slug && dto.slug !== post.slug) {
      const slugExists = await this.prisma.blog.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new ConflictException('Blog slug already exists');
      }
    }

    const data: any = { ...dto };

    if (dto.status === BlogStatus.PUBLISHED && !post.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.blog.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });
  }

  async remove(id: string) {
    const post = await this.prisma.blog.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blog.delete({ where: { id } });

    return { message: 'Blog post deleted successfully' };
  }

  async publish(id: string) {
    const post = await this.prisma.blog.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return this.prisma.blog.update({
      where: { id },
      data: {
        status: BlogStatus.PUBLISHED,
        publishedAt: post.publishedAt || new Date(),
      },
    });
  }

  async archive(id: string) {
    const post = await this.prisma.blog.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    return this.prisma.blog.update({
      where: { id },
      data: { status: BlogStatus.ARCHIVED },
    });
  }
}
