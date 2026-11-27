import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';

export const PrivacyPolicy: React.FC = () => (
  <MainLayout>
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <h1 className="fw-bold text-textech-primary mb-4">Política de Privacidad</h1>
      <p className="text-muted">
        <strong>Última actualización:</strong> Noviembre 2026
      </p>
      <p>
        En <strong>Textech</strong> tratamos los datos personales que nos proporcionas
        a través del formulario de solicitud de catálogo con el único propósito de
        enviar el catálogo digital textil solicitado y contactarte con propuestas
        comerciales relacionadas con nuestros productos.
      </p>
      <h2 className="fs-5 fw-bold mt-4 mb-2">Datos que recopilamos</h2>
      <ul>
        <li>Nombre completo</li>
        <li>Correo electrónico</li>
        <li>Rol de interés (Distribuidor, Diseñador, Comprador)</li>
        <li>Mensaje / Consulta</li>
      </ul>
      <h2 className="fs-5 fw-bold mt-4 mb-2">Uso de los datos</h2>
      <p>
        Los datos se utilizan exclusivamente para el envío del catálogo Textech y
        contacto comercial. No se comparten con terceros sin tu consentimiento.
      </p>
      <h2 className="fs-5 fw-bold mt-4 mb-2">Tus derechos</h2>
      <p>
        Puedes solicitar la eliminación de tus datos en cualquier momento enviando
        un correo a <a href="mailto:privacidad@textech.com">privacidad@textech.com</a>.
      </p>
    </div>
  </MainLayout>
);
