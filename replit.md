# SalesPortalPFL (SalesAssure)

## Overview
A full-stack sales portal for NBFC enterprise teams. Features JWT-based RBAC authentication, role-based product access, and a full admin user management system. Supports Business Loan (BL), Personal Loan (PL), Education Loan (EL), and Health Prime Loan (HL) lead journeys.

## Architecture
- **Frontend**: React 19 with Vite, TailwindCSS v4, shadcn/ui components
- **Backend**: Express 5 (Node.js), serves both API and client on port 5000
- **Database**: PostgreSQL via Replit built-in DB, Drizzle ORM
- **Auth**: JWT (jsonwebtoken + bcryptjs), token stored in localStorage
- **Routing**: wouter (client-side)

## Project Structure
```
client/          - React frontend (Vite root)
  src/
    components/  - UI and feature components
      layout/    - AppLayout with role-aware nav
    context/     - auth-context (JWT auth + MOCK_USERS for quick select)
    hooks/       - Custom hooks
    lib/         - Utilities, query client, mock data
    pages/       - login, dashboard, lead journeys, user-management
server/          - Express backend
  index.ts       - Server entry point (port 5000)
  routes.ts      - Registers API routers + seeds DB on startup
  storage.ts     - Drizzle-based CRUD (users, roles)
  db.ts          - Drizzle + pg Pool connection
  seed.ts        - Seeds 5 roles and 5 users on startup
  auth-middleware.ts - JWT requireAuth / requireAdmin middleware
  api/
    auth.ts      - POST /api/auth/login, GET /api/auth/me
    users.ts     - CRUD /api/users (admin only)
    roles.ts     - CRUD /api/roles (auth required)
  vite.ts        - Vite dev middleware setup
  static.ts      - Production static file serving
shared/          - Shared types and Drizzle schema
  schema.ts      - roles + users tables, zod validation schemas
```

## RBAC System

### Roles
| Role | Products |
|------|----------|
| Admin | BL, PL, EL, HL (+ User Management) |
| BL Officer | BL |
| PL Officer | PL |
| EL Officer | EL |
| HL Officer | HL |

### Test Users (seeded on startup)
| Name | Email | Password | Role |
|------|-------|----------|------|
| Vikram Malhotra | admin@nbfc.com | Admin@1234 | Admin |
| Arjun Verma | arjun.verma@nbfc.com | BL@2024 | BL Officer |
| Priya Sharma | priya.sharma@nbfc.com | PL@2024 | PL Officer |
| Rohit Joshi | rohit.joshi@nbfc.com | EL@2024 | EL Officer |
| Ananya Mehta | ananya.mehta@nbfc.com | HL@2024 | HL Officer |

Management Key (all users): `NBFC-SEC-8472-9103-KM92-X`

## Features
- **Login**: JWT auth, quick-select dropdown + manual entry, management key validation
- **Dashboard**: Role-filtered tabs (only shows products the user can access)
- **User Management** (admin only): `/admin/users` — full CRUD, role assignment, status toggle
- **BL Lead Journey**: Business loan wizard (5 stages)
- **PL Lead Journey**: Personal loan wizard (4 stages)
- **EL Lead Journey**: Education loan wizard (4 stages)
- **HL Lead Journey**: Healthcare finance wizard (4 stages: OTP login, Basic Details, Hospital Details, KYC)
- **Link Generation**: UTM link builder

## Key Commands
- `npm run dev` — Development server (Express + Vite middleware)
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run db:push` — Push Drizzle schema to database

## Environment
- Node.js 20
- PostgreSQL via DATABASE_URL (Replit built-in)
- JWT_SECRET env var (defaults to fallback in dev)
- Port 5000 (single server for API + frontend)
