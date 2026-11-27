import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky-top bg-white border-bottom shadow-sm">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <nav className="navbar navbar-expand-lg container py-2" aria-label="Navegación principal">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-2 bg-textech-primary"
            style={{ width: 34, height: 34 }}
            aria-hidden="true"
          >
            T
          </span>
          <span className="text-textech-primary fs-4">Textech</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="textechNavbar"
          aria-expanded={menuOpen}
          aria-label="Alternar menú de navegación"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="textechNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={() => setMenuOpen(false)}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalog" onClick={() => setMenuOpen(false)}>
                Catálogo Digital
              </NavLink>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="/#lead-form-section"
                onClick={() => setMenuOpen(false)}
              >
                Solicitar Catálogo
              </a>
            </li>
          </ul>

          <div className="dropdown">
            <button
              className="btn btn-outline-textech dropdown-toggle"
              type="button"
              id="workspaceModeDropdown"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user ? `Cuenta: ${user.fullName}` : 'Cambiar Vista / Admin'}
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}
              aria-labelledby="workspaceModeDropdown"
            >
              <li>
                <Link
                  className="dropdown-item"
                  to="/"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Landing Page Pública
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="/catalog"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  Catálogo Público
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              {isAdmin ? (
                <>
                  <li>
                    <Link
                      className="dropdown-item fw-semibold text-textech-primary"
                      to="/admin"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      Panel Administrativo
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" type="button" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    className="dropdown-item fw-semibold text-textech-primary"
                    to="/login"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    Acceso Panel Administrativo
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
