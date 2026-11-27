export interface ProductAttributeDTO {
  name: string;
  value: string;
  unit: string | null;
}

export interface ProductDTO {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  categoryId: string;
  categoryName: string;
  primaryImageUrl: string | null;
  attributes: ProductAttributeDTO[];
  createdAt: string;
  updatedAt: string;
}
