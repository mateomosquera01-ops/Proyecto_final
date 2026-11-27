import React from 'react';
import { ProductDTO } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: ProductDTO;
  onViewDetail?: (id: string) => void;
}

const FALLBACK_IMAGE =
  'https://via.placeholder.com/400x300/f6d5d5/e25050?text=Textech';

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
  return (
    <article
      className="card h-100 border-0 shadow-sm overflow-hidden"
      aria-label={`Producto: ${product.name}`}
    >
      <div className="ratio ratio-4x3 bg-light overflow-hidden">
        <img
          src={product.primaryImageUrl || FALLBACK_IMAGE}
          alt={product.name}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <span className="badge bg-textech-soft text-textech-primary mb-1 align-self-start">
          {product.categoryName}
        </span>
        <h3 className="card-title fs-6 fw-bold mb-1 text-dark">{product.name}</h3>
        <p className="card-text text-muted small flex-grow-1 mb-2 lh-sm">
          {product.description.length > 90
            ? `${product.description.slice(0, 90)}…`
            : product.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
          <strong className="text-textech-primary fs-6">
            {formatCurrency(product.price)}
          </strong>
          <span
            className={`badge ${product.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
          >
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
          </span>
        </div>
        {onViewDetail && (
          <button
            type="button"
            className="btn btn-outline-textech btn-sm mt-3 w-100"
            onClick={() => onViewDetail(product.id)}
            aria-label={`Ver detalles de ${product.name}`}
          >
            Ver detalles
          </button>
        )}
      </div>
    </article>
  );
};
