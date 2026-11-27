import React from 'react';
import { LeadForm } from '../../components/forms/LeadForm';
import { MainLayout } from '../../components/layout/MainLayout';

const BENEFITS = [
  {
    icon: '🧵',
    title: 'Catálogo Digital Actualizado',
    description:
      'Accede al portafolio completo de prendas técnicas, sastrería ejecutiva y línea deportiva directamente en tu dispositivo.',
  },
  {
    icon: '🤝',
    title: 'Atención Comercial Personalizada',
    description:
      'Un asesor Textech te contactará para conocer tus necesidades y presentarte la mejor propuesta de valor textil.',
  },
  {
    icon: '📦',
    title: 'Stock Garantizado B2B',
    description:
      'Inventario en tiempo real para distribuidores, diseñadores y compradores corporativos con pedidos desde 1 unidad.',
  },
];

export const Home: React.FC = () => {
  return (
    <MainLayout>
      {/* ── HERO SECTION ── */}
      <section
        className="hero-textech py-5"
        aria-labelledby="hero-heading"
      >
        <div className="container py-3">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <span className="badge bg-textech-soft text-textech-primary fw-semibold mb-3 px-3 py-2">
                Colección Textil 2026 Disponible
              </span>
              <h1
                id="hero-heading"
                className="display-4 fw-bold text-dark lh-sm mb-3"
              >
                Ropa Corporativa y{' '}
                <span className="text-textech-primary">Textil Técnico</span>{' '}
                para Tu Negocio
              </h1>
              <p className="lead text-muted mb-4">
                Textech conecta a distribuidores, diseñadores y compradores con un
                catálogo digital completo de prendas de alto rendimiento —
                confección ejecutiva, telas técnicas y línea deportiva.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <a
                  href="#lead-form-section"
                  className="btn btn-textech btn-lg px-4 py-2"
                  aria-label="Descargar catálogo textil gratuito"
                >
                  Solicitar Catálogo Gratis
                </a>
                <a
                  href="/catalog"
                  className="btn btn-outline-textech btn-lg px-4 py-2"
                >
                  Ver Catálogo Digital
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-6 text-center" aria-hidden="true">
              <div
                className="rounded-4 d-inline-flex align-items-center justify-content-center bg-white shadow-sm border"
                style={{ width: '100%', maxWidth: 440, aspectRatio: '4/3' }}
              >
                <div className="text-center px-4">
                  <div
                    className="display-1 mb-2"
                    role="img"
                    aria-label="Ícono de prendas textiles"
                  >
                    👔
                  </div>
                  <p className="text-muted small mb-0">
                    Trajes ejecutivos · Ropa técnica · Deportiva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ── */}
      <section
        className="py-5 bg-white"
        aria-labelledby="benefits-heading"
      >
        <div className="container">
          <div className="text-center mb-5">
            <h2 id="benefits-heading" className="fw-bold fs-2">
              ¿Por qué elegir{' '}
              <span className="text-textech-primary">Textech</span>?
            </h2>
            <p className="text-muted col-md-6 mx-auto">
              Calidad textil, tecnología digital y un servicio comercial pensado para
              hacer crecer tu negocio.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {BENEFITS.map((b, i) => (
              <div key={i} className="col-12 col-md-4">
                <article className="card benefit-card border-0 shadow-sm h-100 p-4">
                  <div className="benefit-icon-badge mb-3" aria-hidden="true">
                    {b.icon}
                  </div>
                  <h3 className="fs-5 fw-bold mb-2">{b.title}</h3>
                  <p className="text-muted mb-0 small lh-base">{b.description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATÁLOGO PREVIEW ── */}
      <section className="py-5 bg-textech-soft" aria-labelledby="catalog-preview-heading">
        <div className="container text-center">
          <h2 id="catalog-preview-heading" className="fw-bold fs-2 mb-2">
            Colección{' '}
            <span className="text-textech-primary">Textech 2026</span>
          </h2>
          <p className="text-muted mb-4">
            Prendas seleccionadas para distribuidores y compradores corporativos.
          </p>
          <a href="/catalog" className="btn btn-textech btn-lg px-5">
            Explorar Catálogo Completo
          </a>
        </div>
      </section>

      {/* ── FORMULARIO CAPTURA ── */}
      <LeadForm />
    </MainLayout>
  );
};
