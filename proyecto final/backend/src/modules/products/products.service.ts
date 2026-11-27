import { ApiError } from '../../shared/exceptions/ApiError';
import { ProductDTO } from './products.entity';
import { ProductFilterParams, productsRepository } from './products.repository';
import { CreateProductInput, UpdateProductInput } from './products.validation';

function mapProductToDTO(product: {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: { toNumber: () => number } | number;
  stock: number;
  status: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string };
  images: { url: string }[];
  productAttributes: { value: string; attribute: { name: string; unit: string | null } }[];
}): ProductDTO {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    price: typeof product.price === 'number' ? product.price : product.price.toNumber(),
    stock: product.stock,
    status: product.status,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    primaryImageUrl: product.images[0]?.url ?? null,
    attributes: product.productAttributes.map((pa) => ({
      name: pa.attribute.name,
      value: pa.value,
      unit: pa.attribute.unit,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export class ProductsService {
  async listProducts(filters: ProductFilterParams): Promise<ProductDTO[]> {
    const products = await productsRepository.findAll(filters);
    return products.map(mapProductToDTO);
  }

  async getProductById(id: string): Promise<ProductDTO> {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw ApiError.notFound('Producto no encontrado');
    }
    return mapProductToDTO(product);
  }

  async createProduct(input: CreateProductInput): Promise<ProductDTO> {
    const existingSku = await productsRepository.findBySku(input.sku);
    if (existingSku) {
      throw ApiError.conflict(`Ya existe un producto con el SKU ${input.sku}`);
    }
    const created = await productsRepository.create(input);
    return mapProductToDTO(created);
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<ProductDTO> {
    const existing = await productsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Producto no encontrado');
    }
    if (input.sku && input.sku !== existing.sku) {
      const skuConflict = await productsRepository.findBySku(input.sku);
      if (skuConflict) {
        throw ApiError.conflict(`Ya existe un producto con el SKU ${input.sku}`);
      }
    }
    const { imageUrl: _ignored, ...updateData } = input;
    const updated = await productsRepository.update(id, updateData);
    return mapProductToDTO(updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const existing = await productsRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound('Producto no encontrado');
    }
    await productsRepository.delete(id);
  }
}

export const productsService = new ProductsService();
