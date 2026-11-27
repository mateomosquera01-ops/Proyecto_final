import React, { useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  if (!isLoading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('El correo y la contraseña son obligatorios.');
      setTimeout(() => errorRef.current?.focus(), 100);
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await login(email.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Credenciales inválidas.';
      setError(msg);
      setTimeout(() => errorRef.current?.focus(), 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-5 d-flex justify-content-center">
        <div className="card border-0 shadow-sm p-4" style={{ width: '100%', maxWidth: 420 }}>
          <h1 className="fs-4 fw-bold text-textech-primary mb-4 text-center">
            Acceso Panel Administrativo
          </h1>

          {error && (
            <div
              ref={errorRef}
              className="alert alert-danger d-flex align-items-center gap-2"
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
            >
              <span aria-hidden="true">✗</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Formulario de inicio de sesión">
            <div className="mb-3">
              <label htmlFor="login-email" className="form-label fw-semibold">
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                className="form-control textech-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-required="true"
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label htmlFor="login-password" className="form-label fw-semibold">
                Contraseña
              </label>
              <input
                id="login-password"
                type="password"
                className="form-control textech-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-required="true"
              />
            </div>
            <button
              type="submit"
              className="btn btn-textech w-100 py-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                  Verificando…
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
