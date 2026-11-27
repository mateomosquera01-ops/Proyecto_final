import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminLayout } from '../../components/layout/AdminLayout';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="fw-bold fs-3 mb-1">
          Panel Administrativo <span className="text-textech-primary">Textech</span>
        </h1>
        <p className="text-muted">
          Bienvenido, <strong>{user?.fullName}</strong>. Gestiona leads, inventario y catálogos
          desde las pestañas a continuación.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <a href="/admin/products" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 h-100 benefit-card">
              <div className="benefit-icon-badge mb-3" aria-hidden="true">📦</div>
              <h2 className="fs-5 fw-bold mb-1">Inventario de Productos</h2>
              <p className="text-muted small mb-0">
                CRUD completo: crear, editar, eliminar y filtrar el catálogo textil.
              </p>
            </div>
          </a>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <a href="/admin/leads" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 h-100 benefit-card">
              <div className="benefit-icon-badge mb-3" aria-hidden="true">📋</div>
              <h2 className="fs-5 fw-bold mb-1">Gestión de Leads</h2>
              <p className="text-muted small mb-0">
                Visualiza y gestiona todos los prospectos captados desde el formulario público.
              </p>
            </div>
          </a>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <a href="/catalog" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 h-100 benefit-card">
              <div className="benefit-icon-badge mb-3" aria-hidden="true">🧵</div>
              <h2 className="fs-5 fw-bold mb-1">Catálogo Público</h2>
              <p className="text-muted small mb-0">
                Visualiza la landing page y el catálogo tal como lo ve el cliente.
              </p>
            </div>
          </a>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <a href="/" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 h-100 benefit-card">
              <div className="benefit-icon-badge mb-3" aria-hidden="true">🌐</div>
              <h2 className="fs-5 fw-bold mb-1">Landing Page</h2>
              <p className="text-muted small mb-0">
                Vuelve a la página principal pública de Textech.
              </p>
            </div>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
};
