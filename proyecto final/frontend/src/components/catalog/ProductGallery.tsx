import React, { useCallback, useEffect, useState } from 'react';
import { CategoryDTO } from '../../types/catalog';
import { ProductDTO } from '../../types/product';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { ProductCard } from './ProductCard';

interface ProductGalleryProps {
  onSelectProduct?: (id: string) => void;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getAll({
        search: search.trim() || undefined,
        categoryId: categoryId || undefined,
        status: 'ACTIVE',
      });
      setProducts(data);
    } catch {
      setError('No pudimos cargar el catálogo. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryId]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 350);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <section aria-labelledby="catalog-heading">
      {/* Barra de búsqueda y filtros */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-7">
          <label htmlFor="catalog-search" className="visually-hidden">
            Buscar productos
          </label>
          <input
            id="catalog-search"
            type="search"
            className="form-control textech-input"
            placeholder="Buscar por nombre, SKU o descripción…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-controls="catalog-results"
          />
        </div>
        <div className="col-12 col-sm-5">
          <label htmlFor="catalog-category" className="visually-hidden">
            Filtrar por categoría
          </label>
          <select
            id="catalog-category"
            className="form-select textech-input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            aria-controls="catalog-results"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div
          className="text-center py-5"
          role="status"
          aria-live="polite"
          aria-label="Cargando catálogo"
        >
          <div className="spinner-border text-textech-primary" aria-hidden="true" />
          <p className="mt-2 mb-0 text-muted">Cargando catálogo…</p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Resultados */}
      {!isLoading && !error && (
        <div
          id="catalog-results"
          className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4"
          aria-live="polite"
          aria-atomic="true"
        >
          {products.length === 0 ? (
            <div className="col-12 text-center py-4 text-muted">
              <p>No se encontraron productos para tu búsqueda.</p>
            </div>
          ) : (
            products.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard product={product} onViewDetail={onSelectProduct} />
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};
