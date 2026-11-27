import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import { CategoryDTO } from '../../types/catalog';
import { ProductDTO, ProductPayload } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';

const EMPTY_FORM: ProductPayload = {
  sku: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  status: 'ACTIVE',
  categoryId: '',
  imageUrl: '',
};

export const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
  const [form, setForm] = useState<ProductPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const msgRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const notify = (type: 'success' | 'danger', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => msgRef.current?.focus(), 100);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([
        productService.getAll({ search: search.trim() || undefined }),
        categoryService.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      setError('No se pudo cargar el inventario de productos.');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 350);
    return () => clearTimeout(timer);
  }, [load]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (product: ProductDTO) => {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      status: product.status as ProductPayload['status'],
      categoryId: product.categoryId,
      imageUrl: product.primaryImageUrl || '',
    });
    setFormError('');
    setTimeout(() => formRef.current?.querySelector<HTMLElement>('[name="sku"]')?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const validateForm = (): boolean => {
    if (!form.sku.trim()) { setFormError('El SKU es obligatorio.'); return false; }
    if (!form.name.trim()) { setFormError('El nombre es obligatorio.'); return false; }
    if (!form.description.trim()) { setFormError('La descripción es obligatoria.'); return false; }
    if (Number(form.price) <= 0) { setFormError('El precio debe ser mayor a 0.'); return false; }
    if (!form.categoryId) { setFormError('Selecciona una categoría.'); return false; }
    setFormError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload: ProductPayload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        imageUrl: form.imageUrl?.trim() || undefined,
      };
      if (editingId) {
        const updated = await productService.update(editingId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        notify('success', 'Producto actualizado correctamente.');
      } else {
        const created = await productService.create(payload);
        setProducts((prev) => [created, ...prev]);
        notify('success', 'Producto creado exitosamente.');
      }
      cancelEdit();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el producto.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      notify('success', `Producto "${name}" eliminado.`);
    } catch {
      notify('danger', 'No se pudo eliminar el producto.');
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="fs-3 fw-bold mb-0">Inventario de Productos</h1>
          <p className="text-muted small mb-0">Gestión CRUD de prendas y textiles.</p>
        </div>
        <button
          className="btn btn-textech btn-sm px-4"
          onClick={cancelEdit}
          aria-label="Nuevo producto"
        >
          + Nuevo Producto
        </button>
      </div>

      {actionMsg && (
        <div
          ref={msgRef}
          className={`alert alert-${actionMsg.type} d-flex gap-2 align-items-center`}
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          <span aria-hidden="true">{actionMsg.type === 'success' ? '✓' : '✗'}</span>
          {actionMsg.text}
        </div>
      )}

      {/* Formulario de creación/edición */}
      <div className="card border-0 shadow-sm mb-4 p-4">
        <h2 className="fs-5 fw-bold mb-3">
          {editingId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h2>
        {formError && (
          <div className="alert alert-danger py-2" role="alert">{formError}</div>
        )}
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-label="Formulario de producto">
          <div className="row g-3">
            <div className="col-12 col-sm-4">
              <label htmlFor="p-sku" className="form-label fw-semibold">SKU / Referencia *</label>
              <input id="p-sku" name="sku" type="text" className="form-control textech-input"
                value={form.sku} onChange={handleFormChange} maxLength={80} required />
            </div>
            <div className="col-12 col-sm-8">
              <label htmlFor="p-name" className="form-label fw-semibold">Nombre *</label>
              <input id="p-name" name="name" type="text" className="form-control textech-input"
                value={form.name} onChange={handleFormChange} maxLength={180} required />
            </div>
            <div className="col-12">
              <label htmlFor="p-description" className="form-label fw-semibold">Descripción *</label>
              <textarea id="p-description" name="description" rows={2}
                className="form-control textech-input"
                value={form.description} onChange={handleFormChange} maxLength={2000} required />
            </div>
            <div className="col-6 col-sm-3">
              <label htmlFor="p-price" className="form-label fw-semibold">Precio (USD) *</label>
              <input id="p-price" name="price" type="number" step="0.01" min="0"
                className="form-control textech-input"
                value={form.price} onChange={handleFormChange} required />
            </div>
            <div className="col-6 col-sm-3">
              <label htmlFor="p-stock" className="form-label fw-semibold">Stock</label>
              <input id="p-stock" name="stock" type="number" min="0"
                className="form-control textech-input"
                value={form.stock} onChange={handleFormChange} />
            </div>
            <div className="col-12 col-sm-3">
              <label htmlFor="p-status" className="form-label fw-semibold">Estado</label>
              <select id="p-status" name="status" className="form-select textech-input"
                value={form.status} onChange={handleFormChange}>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="OUT_OF_STOCK">Sin Stock</option>
              </select>
            </div>
            <div className="col-12 col-sm-3">
              <label htmlFor="p-category" className="form-label fw-semibold">Categoría *</label>
              <select id="p-category" name="categoryId" className="form-select textech-input"
                value={form.categoryId} onChange={handleFormChange} required>
                <option value="">— Seleccionar —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label htmlFor="p-imageUrl" className="form-label fw-semibold">URL de Imagen</label>
              <input id="p-imageUrl" name="imageUrl" type="url"
                className="form-control textech-input" placeholder="https://..."
                value={form.imageUrl} onChange={handleFormChange} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-textech"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Guardando…</>
              ) : editingId ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Buscador */}
      <div className="mb-3">
        <label htmlFor="admin-product-search" className="visually-hidden">Buscar producto</label>
        <input
          id="admin-product-search"
          type="search"
          className="form-control textech-input"
          placeholder="Buscar por nombre o SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="text-center py-5" role="status" aria-live="polite">
          <div className="spinner-border text-textech-primary" aria-hidden="true" />
          <p className="mt-2 mb-0">Cargando inventario…</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">{error}</div>
      ) : (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">SKU</th>
                <th scope="col">Nombre</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">Precio</th>
                <th scope="col" className="text-center">Stock</th>
                <th scope="col" className="text-center">Estado</th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">No hay productos.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}>
                    <td className="fw-semibold text-muted small">{p.sku}</td>
                    <td>{p.name}</td>
                    <td><span className="badge bg-textech-soft text-textech-primary">{p.categoryName}</span></td>
                    <td className="text-end fw-semibold">{formatCurrency(p.price)}</td>
                    <td className="text-center">{p.stock}</td>
                    <td className="text-center">
                      <span className={`badge ${p.status === 'ACTIVE' ? 'bg-success-subtle text-success' : p.status === 'OUT_OF_STOCK' ? 'bg-warning-subtle text-warning' : 'bg-secondary-subtle text-secondary'}`}>
                        {p.status === 'ACTIVE' ? 'Activo' : p.status === 'OUT_OF_STOCK' ? 'Sin Stock' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-textech btn-sm"
                          onClick={() => startEdit(p)}
                          aria-label={`Editar ${p.name}`}
                        >✏️</button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(p.id, p.name)}
                          aria-label={`Eliminar ${p.name}`}
                        >🗑</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};
