import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { filter } from 'rxjs';
import { transformAuthInfo } from 'passport';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // Ambil daftar produk dengan pagination + filter
  // Endpoint publik : default is_active = true
  // Endpoint admin : bisa override is_active via Query
  async findAll(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.productsWhereInput = {};

    // Default publik: hanya produk aktif
    // Kalau admin kirim is_active, pakai nilai itu (bisa true/false/all)
    if (query.is_active !== undefined) {
      where.is_active = query.is_active;
    } else {
      where.is_active = true;
    }

    if (query.category_id) {
      where.category_id = query.category_id;
    }

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: `insensitive`,
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.products.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: { categories: { select: { id: true, name: true } } },
      }),
      this.prisma.products.count({ where }),
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

  //   Ambil detail produk by ID
  async findOne(id: string) {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: {
        categories: {
          select: { id: true, name: true },
        },
      },
    });

    if (!product) throw new NotFoundException('Produk tidak ditemukan');
    return product;
  }

  // Buat product baru
  // Validasi: category_id harus ada di tabel categories
  async create(dto: CreateProductDto) {
    const category = await this.prisma.categories.findUnique({
      where: { id: dto.category_id },
    });
    if (!category) throw new BadRequestException('Kategori tidak ditemukan');

    return this.prisma.products.create({
      data: {
        name: dto.name.trim(),
        category_id: dto.category_id,
        selling_price: dto.selling_price,
        unit: dto.unit.trim(),
        image_url: dto.image_url ?? null,
      },
      include: {
        categories: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Update produk by ID, field yang tidak dikirim tidak diubah
  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.category_id) {
      const category = await this.prisma.categories.findUnique({
        where: { id: dto.category_id },
      });
      if (!category) throw new BadRequestException('Kategori tidak ditemukan');
    }

    return this.prisma.products.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.category_id && { category_id: dto.category_id }),
        ...(dto.selling_price !== undefined && {
          selling_price: dto.selling_price,
        }),
        ...(dto.unit && { unit: dto.unit.trim() }),
        ...(dto.image_url !== undefined && { image_url: dto.image_url }),
      },
      include: {
        categories: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Aktifkan / nonaktifkan produk
  async updateStatus(id: string, is_active: boolean) {
    await this.findOne(id);

    return this.prisma.products.update({
      where: { id },
      data: { is_active },
      include: {
        categories: {
          select: { id: true, name: true },
        },
      },
    });
  }

  // Soft delete: nonaktifkan produk
  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.products.update({
      where: { id },
      data: { is_active: false },
    });

    return { message: 'Produk berhasil dinonaktifkan' };
  }
}
