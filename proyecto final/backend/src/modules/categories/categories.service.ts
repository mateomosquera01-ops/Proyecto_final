import { ApiError } from '../../shared/exceptions/ApiError';
import { CategoryDTO } from './categories.entity';
import { categoriesRepository } from './categories.repository';
import { CreateCategoryInput } from './categories.validation';

function mapCategoryToDTO(cat: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}): CategoryDTO {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    parentId: cat.parentId,
  };
}

export class CategoriesService {
  async listCategories(): Promise<CategoryDTO[]> {
    const categories = await categoriesRepository.findAll();
    return categories.map(mapCategoryToDTO);
  }

  async createCategory(input: CreateCategoryInput): Promise<CategoryDTO> {
    const existing = await categoriesRepository.findBySlug(input.slug);
    if (existing) {
      throw ApiError.conflict(`Ya existe una categoría con el slug ${input.slug}`);
    }
    const created = await categoriesRepository.create(input);
    return mapCategoryToDTO(created);
  }
}

export const categoriesService = new CategoriesService();
