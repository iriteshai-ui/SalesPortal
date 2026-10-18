# Sales Portal - Technical Documentation & Handover

## Project Overview
The Sales Portal is a premium assisted-sales application designed for sales agents to manage leads and guide customers through multi-stage loan journeys (Business, Personal, Education, and Home Loans).

## Architecture: Next.js App Router Structure
The project has been migrated and restructured using Next.js 14/15 **App Router Architecture**, prioritizing Server and Client Component separation for superior scalability and performance.

### Directory Structure
```text
src/
├── app/                 # Next.js File-system Routing Core
│   ├── (auth)/          # Unauthenticated routes (Login boundaries)
│   ├── (protected)/     # Authenticated routes (Dashboards & Journeys)
│   ├── layout.tsx       # Root layout configuration
│   └── providers.tsx    # Context bridges (Toasters, Auth)
├── core/                # Global contexts and state machines 
├── models/              # Datatype models and TypeScript interfaces
├── services/            # Data Access Layer 
├── controllers/         # Business Logic Layer (Hooks / Controllers)
├── utils/               # Shared utility functions and mock data
├── views/               # Presentation Layer
│   ├── components/      # UI primitives and shared components
│   └── features/        # High-complexity interactive modular features
└── assets/              # Static assets and graphical objects
```

## Key Layers

### 1. Application Core (`/src/app`)
Utilizes Next.js App Router functionalities:
- `layout.tsx`: Houses the core HTML and body structure.
- `providers.tsx`: Acts as an intermediary `"use client";` boundary, encapsulating `AuthContext` and UI Toasters without forcing the entire layout into client-side rendering.
- `(protected)/layout.tsx`: Employs route guards, automatically redirecting non-authenticated users seamlessly via `router.push("/login")`.

### 2. Views & Features (`/src/views`)
Responsible strictly for executing the design system and interactions:
- **Features**: Highly complex journey screens (e.g., `el-journey`) which have been insulated as strictly client-interactive components. They are imported dynamically into clean `page.tsx` routes within `/src/app/(protected)/leads/*`.

### 3. Services & Controllers
- Services (`/services`): Handles mock data simulation schemas (ready to be swapped with direct fetch commands or server actions in the future).
- Controllers (`/controllers`): Abstract custom hooks that segregate business logic states from the view layer.

## Development Standards

### Next.js Guidelines
- **Strict Separation**: Only attach `"use client";` on files relying on interactivity, `useState`, `useEffect`, or `next/navigation` hooks (like `useRouter` and `usePathname`).
- Server components should be used wherever static rendering or direct database querying occurs.

### Naming Conventions
- **Routing Pages**: Must be strictly named `page.tsx` or `layout.tsx` corresponding to the route folder structure.
- **Files**: `kebab-case.tsx` or `kebab-case.ts`.
- **Components**: `PascalCase` bindings.
- **Hooks/Controllers**: `camelCase` starting with `use`.

### Routing & Navigation
- All programmatic navigation must use `useRouter` from `next/navigation`.
- All declarative links must use `<Link href="...">...</Link>` from `next/link`.

## Deployment & Environment
- **Local Dev:** `npm run dev` (Runs optimally on Next.js default `http://localhost:3000`).
- **Build Verification:** `npm run build` evaluates all typings and generates the Turbopack production bundle inside `<rootDir>/.next/`.
- **Booting Prod:** `npm start` runs the optimized server block.

---
*Documented by PFL IT Team*
