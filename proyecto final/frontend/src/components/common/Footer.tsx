import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div>
          <strong className="text-textech-primary">Textech</strong> — Innovación Textil y Catálogo Digital
        </div>
        <nav aria-label="Enlaces legales">
          <ul className="list-inline mb-0">
            <li className="list-inline-item me-3">
              <Link className="link-light text-decoration-none" to="/catalog">
                Catálogo
              </Link>
            </li>
            <li className="list-inline-item">
              <Link className="link-light text-decoration-none" to="/privacy">
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};
