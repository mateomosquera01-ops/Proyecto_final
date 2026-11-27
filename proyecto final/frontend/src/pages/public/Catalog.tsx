import React from 'react';
import { ProductGallery } from '../../components/catalog/ProductGallery';
import { MainLayout } from '../../components/layout/MainLayout';

export const Catalog: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-5">
        <div className="mb-5">
          <h1 id="catalog-heading" className="fw-bold fs-2 mb-1">
            Catálogo Digital{' '}
            <span className="text-textech-primary">Textech</span>
          </h1>
          <p className="text-muted">
            Explora nuestra colección completa de prendas técnicas, sastrería ejecutiva y
            línea deportiva. Busca, filtra y solicita tu propuesta comercial.
          </p>
        </div>
        <ProductGallery />
        <div className="mt-5 p-4 bg-textech-soft rounded-3 text-center">
          <h2 className="fs-4 fw-bold mb-2">
            ¿Te interesa algún producto?
          </h2>
          <p className="text-muted mb-3">
            Solicita información de precios y disponibilidad para pedidos mayoristas.
          </p>
          <a href="/#lead-form-section" className="btn btn-textech btn-lg px-5">
            Solicitar Catálogo Gratuito
          </a>
        </div>
      </div>
    </MainLayout>
  );
};
