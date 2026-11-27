import { prisma } from '../../config/database';

export class CatalogsRepository {
  async findAll() {
    return prisma.catalog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { catalogProducts: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.catalog.findUnique({ where: { slug } });
  }

  async create(data: {
    title: string;
    slug: string;
    description?: string;
    season?: string;
    pdfUrl?: string;
    isActive: boolean;
  }) {
    return prisma.catalog.create({
      data,
      include: {
        _count: {
          select: { catalogProducts: true },
        },
      },
    });
  }
}

export const catalogsRepository = new CatalogsRepository();
