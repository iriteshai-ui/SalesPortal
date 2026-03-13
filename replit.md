# SalesPortalPFL (SalesAssure)

## Overview
A full-stack sales portal application for NBFC enterprise teams. Features a secure login system with Sales Officer authentication and a pre-offer journey management dashboard. Supports Business Loan (BL), Personal Loan (PL), and Education Loan (EL) lead journeys.

## Architecture
- **Frontend**: React 19 with Vite, TailwindCSS v4, shadcn/ui components
- **Backend**: Express 5 (Node.js), serves both API and client on port 5000
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Passport.js with local strategy, express-session
- **Routing**: wouter (client-side)

## Project Structure
```
client/          - React frontend (Vite root)
  src/
    components/  - UI and feature components
    context/     - React context (auth)
    hooks/       - Custom hooks
    lib/         - Utilities, query client, mock data
    pages/       - Page components (dashboard, login, lead-journey, pl-lead-journey, el-lead-journey)
server/          - Express backend
  index.ts       - Server entry point (port 5000)
  routes.ts      - API routes
  storage.ts     - Data storage interface (MemStorage)
  vite.ts        - Vite dev middleware setup
  static.ts      - Production static file serving
shared/          - Shared types and schema (Drizzle)
  schema.ts      - Database schema (users table)
script/          - Build scripts
```

## Features
- **Dashboard**: Lead overview with tabs for BL Lead, PL Lead, EL Lead, HL Lead, and Link Generation
- **BL Lead Journey**: Business loan wizard (5 stages)
- **PL Lead Journey**: Personal loan wizard (4 stages)
- **EL Lead Journey**: Education loan wizard (4 stages: Student Basic Details, Academic Info, Co-Applicant Onboarding, Bank Connect)
- **HL Lead Journey** (Health Prime Lead): Healthcare finance wizard (4 stages: Email+OTP Login, Basic Details, Hospital Details with Journey Link generation, KYC & Document Upload)
- **Link Generation**: UTM link builder

## Key Commands
- `npm run dev` - Development server (Express + Vite middleware)
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Push Drizzle schema to database

## Environment
- Node.js 20
- PostgreSQL via DATABASE_URL
- Port 5000 (single server for API + frontend)
