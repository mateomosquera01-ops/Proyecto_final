import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  status?: string;
}

export class ProductsRepository {
  async findAll(filters: ProductFilterParams) {
    const where: Prisma.ProductWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          take: 1,
        },
        productAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
        productAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }

  async create(data: {
    sku: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    categoryId: string;
    imageUrl?: string;
  }) {
    return prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        status: data.status,
        categoryId: data.categoryId,
        ...(data.imageUrl
          ? {
              images: {
                create: {
                  url: data.imageUrl,
                  altText: data.name,
                  isPrimary: true,
                  sortOrder: 1,
                },
              },
            }
          : {}),
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          take: 1,
        },
        productAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      sku: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      status: string;
      categoryId: string;
    }>,
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          take: 1,
        },
        productAttributes: {
          include: {
            attribute: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}

export const productsRepository = new ProductsRepository();
