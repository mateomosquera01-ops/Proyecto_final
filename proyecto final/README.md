# Textech — Plataforma Web Full-Stack Textil

> Plataforma digital B2B/B2C para comercialización, visualización, búsqueda y administración de un catálogo textil, con captación automatizada de clientes mediante integración n8n.

[![Deploy Status](https://img.shields.io/badge/GitHub%20Pages-Live-green?style=flat-square)](https://mateomosquera01-ops.github.io/Proyecto_final/)
[![License](https://img.shields.io/badge/License-Educational-blue?style=flat-square)](#)

---

## 📋 Tabla de Contenidos

- [Demo](#-demo)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Desarrollo](#-instalación-y-desarrollo)
- [Variables de Entorno](#-variables-de-entorno)
- [API REST](#-api-rest)
- [Base de Datos](#-base-de-datos)
- [Integración n8n](#-integración-n8n)
- [Despliegue](#-despliegue)
- [Equipo](#-equipo)

---

## 🌐 Demo

| Entorno | URL |
|---------|-----|
| GitHub Pages (Frontend) | https://mateomosquera01-ops.github.io/Proyecto_final/ |

---

## 🏗 Arquitectura

```
Cliente (Browser)
      │
      ▼
Frontend (React + TypeScript + Vite + Bootstrap 5)
      │  HTTPS API Calls → /api/v1/...
      ▼
Backend (Node.js + Express + TypeScript)
 ├── Middlewares: Helmet, CORS, Rate Limit, JWT Auth, Zod Validation
 ├── Módulos: auth, leads, products, categories, catalogs, inquiries
 └── Integración: n8n Webhook (envío automático de catálogo por email)
      │
      ▼
Supabase (PostgreSQL + RLS)
 └── 18 tablas con Row Level Security activado
      │
      ▼
n8n (Automatización de correos con catálogo digital)
```

> **Blindaje de seguridad:** El frontend NUNCA se conecta directamente a Supabase ni expone credenciales. Toda comunicación pasa por la API REST del backend que devuelve DTOs limpios.

---

## ⚙️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18, TypeScript, Vite 5, Bootstrap 5.3, React Router v6 |
| **Backend** | Node.js 20, Express 4, TypeScript, Zod, JWT (jsonwebtoken), bcryptjs |
| **ORM / BD** | Prisma 5, Supabase (PostgreSQL 15) con RLS |
| **Automatización** | n8n (Webhook + Email) |
| **CI/CD** | GitHub Actions (Build + Deploy a GitHub Pages) |
| **Seguridad** | Helmet, CORS whitelisting, Rate Limiting, JWT Bearer Token, RBAC |
| **Accesibilidad** | WCAG 2.1 AA (HTML5 semántico, aria-*, foco visible, contraste) |

---

## 📁 Estructura del Proyecto

```
plataforma-textil/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # common/, forms/, catalog/, layout/
│   │   ├── pages/         # public/ (Home, Catalog), auth/ (Login), admin/ (Dashboard, Products, Leads)
│   │   ├── services/      # api.ts, authService, leadService, productService, categoryService
│   │   ├── context/       # AuthContext.tsx
│   │   ├── routes/        # AppRouter.tsx, ProtectedRoute.tsx
│   │   ├── types/         # lead.ts, product.ts, catalog.ts, user.ts
│   │   └── utils/         # validators.ts, formatters.ts
│   ├── vite.config.ts     # Base: '/' (dev) | '/Proyecto_final/' (GitHub Pages)
│   └── netlify.toml
├── backend/               # Node.js + Express + TypeScript + Prisma
│   ├── src/
│   │   ├── config/        # environment.ts, database.ts, cors.ts
│   │   ├── modules/       # auth, leads, products, categories, catalogs, inquiries
│   │   │   └── [módulo]/  # entity, validation, repository, service, controller, routes
│   │   ├── integrations/  # n8n/ (service + types)
│   │   ├── middlewares/   # auth, error, rateLimit, validation
│   │   ├── shared/        # ApiError, asyncHandler, sanitize
│   │   ├── app.ts
│   │   └── server.ts
│   └── prisma/
│       ├── schema.prisma  # 18 modelos, UUIDs, snake_case
│       └── seed.ts        # Datos iniciales textiles
├── docs/
│   ├── modelo-datos/      # supabase-init.sql (con ENABLE ROW LEVEL SECURITY)
│   └── reflexion-final.md
├── workflows/n8n/         # envio-catalogo.json (importable en n8n)
└── .github/
    ├── ISSUE_TEMPLATE/    # tarea-kanban.md, bug-report.md
    └── workflows/         # kanban-sync.yml, setup-kanban.yml, ci-deploy.yml
```

---

## 🚀 Instalación y Desarrollo

### Requisitos previos

- Node.js ≥ 20.x
- npm ≥ 10.x
- Cuenta en [Supabase](https://supabase.com) con proyecto PostgreSQL

### 1. Clonar el repositorio

```bash
git clone https://github.com/mateomosquera01-ops/Proyecto_final.git
cd "Proyecto_final/proyecto final"
```

### 2. Configurar el Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales de Supabase y JWT
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed    # Carga datos iniciales textiles
npm run dev            # Servidor en http://localhost:4000
```

### 3. Configurar el Frontend

```bash
cd frontend
cp .env.example .env
# Edita VITE_API_URL=http://localhost:4000/api/v1
npm install
npm run dev            # App en http://localhost:5173
```

---

## 🔐 Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | URL de Supabase con pgBouncer (Prisma pooled) |
| `DIRECT_URL` | URL directa de Supabase (migraciones) |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `JWT_EXPIRES_IN` | Expiración del token (ej. `8h`) |
| `CORS_ORIGIN` | Origen(es) permitidos (ej. `http://localhost:5173`) |
| `N8N_WEBHOOK_URL` | URL del webhook n8n para envío de catálogos |
| `N8N_WEBHOOK_SECRET` | Secreto opcional del webhook n8n |

### Frontend (`frontend/.env`)

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API REST (ej. `http://localhost:4000/api/v1`) |

---

## 📡 API REST

Base URL: `/api/v1`

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| `GET` | `/health` | Público | Estado del servicio |
| `POST` | `/auth/login` | Público | Inicio de sesión |
| `POST` | `/auth/register` | Público | Registro de usuario |
| `GET` | `/auth/me` | JWT | Perfil del usuario autenticado |
| `POST` | `/leads` | Público (rate limit) | Crear lead + disparar n8n |
| `GET` | `/leads` | ADMIN | Listar todos los leads |
| `PATCH` | `/leads/:id/status` | ADMIN | Actualizar estado del lead |
| `DELETE` | `/leads/:id` | ADMIN | Eliminar lead |
| `GET` | `/products` | Público | Listar productos (search, categoryId, status) |
| `GET` | `/products/:id` | Público | Detalle de producto |
| `POST` | `/products` | ADMIN | Crear producto |
| `PUT` | `/products/:id` | ADMIN | Actualizar producto |
| `DELETE` | `/products/:id` | ADMIN | Eliminar producto |
| `GET` | `/categories` | Público | Listar categorías |
| `POST` | `/categories` | ADMIN | Crear categoría |
| `GET` | `/catalogs` | Público | Listar catálogos activos |
| `POST` | `/catalogs` | ADMIN | Crear catálogo |
| `POST` | `/inquiries` | Público | Crear consulta de cotización |
| `GET` | `/inquiries` | ADMIN | Listar consultas |
| `PATCH` | `/inquiries/:id/status` | ADMIN | Actualizar estado |

---

## 🗄 Base de Datos

El modelo ER tiene **18 tablas** organizadas en 4 módulos:

- **Seguridad:** `users`, `roles`, `user_roles`, `permissions`, `role_permissions`
- **Captación:** `leads`, `consent_logs`, `email_logs`
- **Catálogo:** `categories`, `products`, `product_images`, `attributes`, `product_attributes`, `catalogs`, `catalog_products`
- **Interacción:** `favorites`, `inquiries`, `inquiry_history`

> Ejecuta `docs/modelo-datos/supabase-init.sql` en el SQL Editor de Supabase para inicializar el esquema con RLS habilitado.

---

## 🔄 Integración n8n

Importa `workflows/n8n/envio-catalogo.json` en tu instancia de n8n:

1. Abre n8n → **Workflows** → **Import from File**
2. Selecciona `workflows/n8n/envio-catalogo.json`
3. Activa el workflow y copia la URL del webhook
4. Configura `N8N_WEBHOOK_URL` en el `.env` del backend

**Flujo:** `POST /api/v1/leads` → Registra lead + consent_log → Webhook n8n → Envía catálogo por email → Registra resultado en `email_logs`

---

## 🌍 Despliegue

### GitHub Pages (Frontend automático)

El workflow `.github/workflows/ci-deploy.yml` hace build y deploy automáticamente en cada push a `main`.

Configura en **Settings → Secrets and variables → Actions**:
- `VITE_API_URL`: URL pública de tu backend desplegado

### Netlify (alternativa)

```bash
cd frontend
npm run build   # genera dist/
# Publica la carpeta dist/ en Netlify
# La redirección SPA ya está configurada en netlify.toml
```

---

## 👤 Equipo

| Nombre | Rol |
|--------|-----|
| Mateo Mosquera | Full-Stack Developer & Tech Lead |

---

*Proyecto académico desarrollado como evaluación final. Textech — Innovación Textil Digital.*
