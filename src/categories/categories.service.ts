import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Ambil semua kategori, urutan by name(public endpoint)
  async findAll(query: QueryCategoryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.categoriesWhereInput = {
      ...(query.search && {
        name: { contains: query.search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.categories.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.categories.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Ambil detail 1 kategori + jumlah produk(Public endpoint)
  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
      },
    });

    if (!category) throw new NotFoundException('Kategori tidak ditemukan');
    return category;
  }

  // Buat kategori baru, Admin only, Constraint: name unik -> 409 kalau duplikat
  async create(dto: CreateCategoryDto) {
    const name = dto.name.trim();

    const existing = await this.prisma.categories.findUnique({
      where: { name },
    });
    if (existing) throw new ConflictException('Nama kategori sudah ada');

    return this.prisma.categories.create({
      data: { name },
    });
  }

  // Update kategori, Admin only, Cek existence + cek duplikat nama kalau name diubah
  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    if (dto.name) {
      const name = dto.name.trim();

      const duplicate = await this.prisma.categories.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });
      if (duplicate) throw new ConflictException('Nama kategori sudah ada');

      dto.name = name;
    }

    return this.prisma.categories.update({
      where: { id },
      data: dto,
    });
  }

  // Hapus kategori, Admin Only, Constraint: tidak boleh dihapus kalau masih punya produk
  async remove(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw new NotFoundException('Kategori tidak ditemukan');

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Kategori tidak bisa dihapus karena masih dipakai oleh ${category._count.products} produk`,
      );
    }

    await this.prisma.categories.delete({ where: { id } });

    return { message: 'Kategori berhasil dihapus' };
  }
}
