import React, { useRef, useState } from 'react';
import { leadService } from '../../services/leadService';
import { isValidEmail, sanitizeInput } from '../../utils/validators';

type InterestRole = 'DISTRIBUTOR' | 'DESIGNER' | 'BUYER';

interface FormFields {
  fullName: string;
  email: string;
  interestRole: InterestRole | '';
  message: string;
  consentGiven: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  interestRole?: string;
  message?: string;
  consentGiven?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

const MAX_MSG_CHARS = 500;

export const LeadForm: React.FC = () => {
  const [fields, setFields] = useState<FormFields>({
    fullName: '',
    email: '',
    interestRole: '',
    message: '',
    consentGiven: false,
  });
  const [touched, setTouched] = useState<Record<keyof FormFields, boolean>>({
    fullName: false,
    email: false,
    interestRole: false,
    message: false,
    consentGiven: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const firstErrorRef = useRef<HTMLElement | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const validate = (data: FormFields): FormErrors => {
    const e: FormErrors = {};
    if (!data.fullName.trim() || data.fullName.trim().length < 3)
      e.fullName = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    if (!data.email.trim() || !isValidEmail(data.email))
      e.email = 'Ingresa un correo electrónico válido.';
    if (!data.interestRole)
      e.interestRole = 'Selecciona tu rol de interés.';
    if (!data.message.trim() || data.message.trim().length < 10)
      e.message = 'El mensaje debe tener al menos 10 caracteres.';
    if (data.message.trim().length > MAX_MSG_CHARS)
      e.message = `El mensaje no puede superar los ${MAX_MSG_CHARS} caracteres.`;
    if (!data.consentGiven)
      e.consentGiven = 'Debes aceptar la política de privacidad para continuar.';
    return e;
  };

  const handleBlur = (field: keyof FormFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const e = validate(fields);
    setErrors(e);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFields((prev) => ({ ...prev, [name]: newValue }));
    if (touched[name as keyof FormFields]) {
      const updated = { ...fields, [name]: newValue };
      setErrors(validate(updated));
    }
  };

  const getInputClass = (field: keyof FormErrors) => {
    const base = 'form-control textech-input';
    if (!touched[field]) return base;
    return `${base} ${errors[field] ? 'is-invalid' : 'is-valid'}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(
      Object.keys(fields).map((k) => [k, true]),
    ) as Record<keyof FormFields, boolean>;
    setTouched(allTouched);
    const e2 = validate(fields);
    setErrors(e2);

    if (Object.keys(e2).length > 0) {
      // Foco automático al primer error
      const order: (keyof FormErrors)[] = [
        'fullName', 'email', 'interestRole', 'message', 'consentGiven',
      ];
      const firstKey = order.find((k) => e2[k]);
      if (firstKey) {
        const el = document.getElementById(`lead-${firstKey}`);
        if (el) el.focus();
      }
      return;
    }

    setSubmitStatus('loading');
    try {
      await leadService.create({
        fullName: sanitizeInput(fields.fullName),
        email: fields.email.trim().toLowerCase(),
        interestRole: fields.interestRole as InterestRole,
        message: sanitizeInput(fields.message),
        consentGiven: fields.consentGiven,
      });
      setSubmitStatus('success');
      setServerMessage(
        '¡Solicitud enviada! Revisa tu correo para acceder al catálogo Textech.',
      );
      setFields({ fullName: '', email: '', interestRole: '', message: '', consentGiven: false });
      setTouched({ fullName: false, email: false, interestRole: false, message: false, consentGiven: false });
      setErrors({});
      setTimeout(() => statusRef.current?.focus(), 100);
    } catch (err: unknown) {
      setSubmitStatus('error');
      setServerMessage(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al enviar. Intenta nuevamente.',
      );
      setTimeout(() => statusRef.current?.focus(), 100);
    }
  };

  const charsLeft = MAX_MSG_CHARS - fields.message.length;

  return (
    <section
      id="lead-form-section"
      className="py-5 bg-textech-soft"
      aria-labelledby="lead-form-heading"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm p-4">
              <h2
                id="lead-form-heading"
                className="fs-3 fw-bold text-textech-primary mb-1"
              >
                Solicita tu Catálogo Textech
              </h2>
              <p className="text-muted mb-4">
                Completa el formulario y te enviaremos el catálogo digital de nuestra
                colección textil actualizada.
              </p>

              {/* Alerta de estado — sin alert() */}
              {(submitStatus === 'success' || submitStatus === 'error') && (
                <div
                  ref={statusRef}
                  className={`alert ${submitStatus === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center gap-2`}
                  role="alert"
                  aria-live="assertive"
                  tabIndex={-1}
                >
                  <span aria-hidden="true">
                    {submitStatus === 'success' ? '✓' : '✗'}
                  </span>
                  {serverMessage}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Formulario de solicitud de catálogo"
              >
                {/* Nombre */}
                <div className="mb-3">
                  <label htmlFor="lead-fullName" className="form-label fw-semibold">
                    Nombre completo <span aria-hidden="true" className="text-danger">*</span>
                  </label>
                  <input
                    id="lead-fullName"
                    name="fullName"
                    type="text"
                    className={getInputClass('fullName')}
                    value={fields.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('fullName')}
                    autoComplete="name"
                    maxLength={150}
                    aria-required="true"
                    aria-describedby={errors.fullName ? 'err-fullName' : undefined}
                  />
                  {touched.fullName && errors.fullName && (
                    <div id="err-fullName" className="invalid-feedback" role="alert">
                      {errors.fullName}
                    </div>
                  )}
                  {touched.fullName && !errors.fullName && (
                    <div className="valid-feedback">✓ Correcto</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="lead-email" className="form-label fw-semibold">
                    Correo electrónico <span aria-hidden="true" className="text-danger">*</span>
                  </label>
                  <input
                    id="lead-email"
                    name="email"
                    type="email"
                    className={getInputClass('email')}
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    autoComplete="email"
                    maxLength={255}
                    aria-required="true"
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                  {touched.email && errors.email && (
                    <div id="err-email" className="invalid-feedback" role="alert">
                      {errors.email}
                    </div>
                  )}
                  {touched.email && !errors.email && (
                    <div className="valid-feedback">✓ Correcto</div>
                  )}
                </div>

                {/* Interés / Rol */}
                <div className="mb-3">
                  <label htmlFor="lead-interestRole" className="form-label fw-semibold">
                    Tu rol de interés <span aria-hidden="true" className="text-danger">*</span>
                  </label>
                  <select
                    id="lead-interestRole"
                    name="interestRole"
                    className={getInputClass('interestRole')}
                    value={fields.interestRole}
                    onChange={handleChange}
                    onBlur={() => handleBlur('interestRole')}
                    aria-required="true"
                    aria-describedby={errors.interestRole ? 'err-interestRole' : undefined}
                  >
                    <option value="">— Selecciona una opción —</option>
                    <option value="DISTRIBUTOR">Distribuidor mayorista</option>
                    <option value="DESIGNER">Diseñador de moda</option>
                    <option value="BUYER">Comprador corporativo / minorista</option>
                  </select>
                  {touched.interestRole && errors.interestRole && (
                    <div id="err-interestRole" className="invalid-feedback" role="alert">
                      {errors.interestRole}
                    </div>
                  )}
                  {touched.interestRole && !errors.interestRole && (
                    <div className="valid-feedback">✓ Correcto</div>
                  )}
                </div>

                {/* Mensaje */}
                <div className="mb-3">
                  <label htmlFor="lead-message" className="form-label fw-semibold">
                    Mensaje / Consulta <span aria-hidden="true" className="text-danger">*</span>
                  </label>
                  <textarea
                    id="lead-message"
                    name="message"
                    rows={4}
                    className={getInputClass('message')}
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur('message')}
                    maxLength={MAX_MSG_CHARS}
                    aria-required="true"
                    aria-describedby={`lead-message-counter${errors.message ? ' err-message' : ''}`}
                  />
                  <div
                    id="lead-message-counter"
                    className={`form-text text-end ${charsLeft < 50 ? 'text-warning' : 'text-muted'}`}
                    aria-live="polite"
                  >
                    {charsLeft} caracteres restantes
                  </div>
                  {touched.message && errors.message && (
                    <div id="err-message" className="invalid-feedback d-block" role="alert">
                      {errors.message}
                    </div>
                  )}
                </div>

                {/* Consentimiento */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      id="lead-consentGiven"
                      name="consentGiven"
                      type="checkbox"
                      className={`form-check-input ${
                        touched.consentGiven
                          ? errors.consentGiven
                            ? 'is-invalid'
                            : 'is-valid'
                          : ''
                      }`}
                      checked={fields.consentGiven}
                      onChange={handleChange}
                      onBlur={() => handleBlur('consentGiven')}
                      aria-required="true"
                      aria-describedby={
                        errors.consentGiven ? 'err-consentGiven' : undefined
                      }
                    />
                    <label htmlFor="lead-consentGiven" className="form-check-label">
                      He leído y acepto la{' '}
                      <a href="/privacy" target="_blank" rel="noreferrer">
                        Política de Privacidad
                      </a>{' '}
                      de Textech y consiento el tratamiento de mis datos.{' '}
                      <span aria-hidden="true" className="text-danger">*</span>
                    </label>
                    {touched.consentGiven && errors.consentGiven && (
                      <div id="err-consentGiven" className="invalid-feedback" role="alert">
                        {errors.consentGiven}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-textech w-100 py-2 fs-6"
                  disabled={submitStatus === 'loading'}
                  aria-busy={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Enviando…
                    </>
                  ) : (
                    'Solicitar Catálogo Gratuito'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
