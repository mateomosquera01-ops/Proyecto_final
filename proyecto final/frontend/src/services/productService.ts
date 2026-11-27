import { ProductDTO, ProductPayload } from '../types/product';
import { apiRequest } from './api';

export const productService = {
  getAll(params?: { search?: string; categoryId?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return apiRequest<ProductDTO[]>(`/products${qs ? `?${qs}` : ''}`);
  },
  create(payload: ProductPayload) {
    return apiRequest<ProductDTO>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(id: string, payload: Partial<ProductPayload>) {
    return apiRequest<ProductDTO>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  remove(id: string) {
    return apiRequest<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};
