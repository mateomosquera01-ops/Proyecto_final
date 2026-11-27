import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { leadService } from '../../services/leadService';
import { LeadDTO } from '../../types/lead';
import { formatDate } from '../../utils/formatters';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Nuevo',
  CONTACTED: 'Contactado',
  QUALIFIED: 'Calificado',
  CLOSED: 'Cerrado',
};

const STATUS_BADGE: Record<string, string> = {
  NEW: 'primary',
  CONTACTED: 'warning',
  QUALIFIED: 'success',
  CLOSED: 'secondary',
};

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<LeadDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const msgRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await leadService.getAll();
      setLeads(data);
    } catch {
      setError('No se pudieron cargar los leads. Verifica tu sesión.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const notify = (type: 'success' | 'danger', text: string) => {
    setActionMsg({ type, text });
    setTimeout(() => msgRef.current?.focus(), 100);
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await leadService.updateStatus(id, status);
      setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
      notify('success', 'Estado del lead actualizado correctamente.');
    } catch {
      notify('danger', 'No se pudo actualizar el estado. Intenta nuevamente.');
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar el lead de "${name}"? Esta acción no se puede deshacer.`)) return;
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await leadService.remove(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      notify('success', `Lead de "${name}" eliminado.`);
    } catch {
      notify('danger', 'No se pudo eliminar el lead.');
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h1 className="fs-3 fw-bold mb-0">Gestión de Leads</h1>
          <p className="text-muted small mb-0">
            Prospectos captados desde el formulario público de Textech.
          </p>
        </div>
        <button
          className="btn btn-outline-textech btn-sm"
          onClick={load}
          aria-label="Recargar lista de leads"
        >
          🔄 Recargar
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

      {isLoading && (
        <div className="text-center py-5" role="status" aria-live="polite">
          <div className="spinner-border text-textech-primary" aria-hidden="true" />
          <p className="mt-2 mb-0">Cargando leads…</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="table-responsive rounded-3 shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Catálogo</th>
                <th scope="col">Estado</th>
                <th scope="col">Fecha</th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No hay leads registrados aún.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="fw-semibold">{lead.fullName}</td>
                    <td>
                      <a href={`mailto:${lead.email}`} className="text-textech-primary">
                        {lead.email}
                      </a>
                    </td>
                    <td>
                      <span className="badge bg-textech-soft text-textech-primary">
                        {lead.interestRole}
                      </span>
                    </td>
                    <td>
                      {lead.catalogDispatched ? (
                        <span className="text-success fw-semibold">✓ Enviado</span>
                      ) : (
                        <span className="text-warning">⚠ Pendiente</span>
                      )}
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={lead.status}
                        disabled={updating[lead.id]}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        aria-label={`Estado del lead ${lead.fullName}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-muted small">{formatDate(lead.createdAt)}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(lead.id, lead.fullName)}
                        disabled={updating[lead.id]}
                        aria-label={`Eliminar lead de ${lead.fullName}`}
                      >
                        {updating[lead.id] ? (
                          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                        ) : '🗑'}
                      </button>
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
