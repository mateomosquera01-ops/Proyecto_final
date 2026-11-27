import { prisma } from '../../config/database';

export class CategoriesRepository {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string | null;
  }) {
    return prisma.category.create({ data });
  }
}

export const categoriesRepository = new CategoriesRepository();
