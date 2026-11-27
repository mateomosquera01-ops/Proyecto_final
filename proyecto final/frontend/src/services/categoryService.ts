import { CategoryDTO } from '../types/catalog';
import { apiRequest } from './api';

export const categoryService = {
  getAll() {
    return apiRequest<CategoryDTO[]>('/categories');
  },
};
