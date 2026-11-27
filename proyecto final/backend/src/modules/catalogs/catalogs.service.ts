import { ApiError } from '../../shared/exceptions/ApiError';
import { CatalogDTO } from './catalogs.entity';
import { catalogsRepository } from './catalogs.repository';
import { CreateCatalogInput } from './catalogs.validation';

function mapCatalogToDTO(catalog: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  season: string | null;
  pdfUrl: string | null;
  isActive: boolean;
  _count: { catalogProducts: number };
}): CatalogDTO {
  return {
    id: catalog.id,
    title: catalog.title,
    slug: catalog.slug,
    description: catalog.description,
    season: catalog.season,
    pdfUrl: catalog.pdfUrl,
    isActive: catalog.isActive,
    productCount: catalog._count.catalogProducts,
  };
}

export class CatalogsService {
  async listCatalogs(): Promise<CatalogDTO[]> {
    const catalogs = await catalogsRepository.findAll();
    return catalogs.map(mapCatalogToDTO);
  }

  async createCatalog(input: CreateCatalogInput): Promise<CatalogDTO> {
    const existing = await catalogsRepository.findBySlug(input.slug);
    if (existing) {
      throw ApiError.conflict(`Ya existe un catálogo con el slug ${input.slug}`);
    }
    const created = await catalogsRepository.create(input);
    return mapCatalogToDTO(created);
  }
}

export const catalogsService = new CatalogsService();
