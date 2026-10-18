# Pulse Agent Assist - Sales Portal

## Overview
Pulse Agent Assist is a premium assisted sales portal designed for PFL IT. It enables sales agents to manage lead journeys for various financial products (BL, PL, EL, HL) with a unified, high-impact user interface.

## Tech Stack
- **Framework**: Next.js 14/15 (App Router paradigm)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, lucide-react (Icons), framer-motion (Animations)
- **Components**: Radix UI (Shadcn-based)
- **Routing**: Next.js File-system Routing (`next/navigation` and `next/link`)
- **Data Fetching**: Next.js Server & Client Component Hybrid + React Query
- **Form Management**: React Hook Form, Zod

## Key Features
- **Unified Branding**: Standardized "Pulse Agent Assist" branding across the portal.
- **Dynamic Loaders**: Custom `PFLStageLoader` for seamless transitions between user journey stages.
- **Product Journeys**: Specialized lead flows seamlessly implemented via Route Groups:
  - **BL (Business Loan)**: `/leads/bl`
  - **PL (Personal Loan)**: `/leads/pl`
  - **EL (Education Loan)**: `/leads/el`
  - **HL (Healthcare Finance)**: `/leads/hl`
- **Mock Data Layer**: Pre-supplied `MOCK_LEADS` state for development and testing without requiring live backend endpoints.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The application will start on `http://localhost:3000`.

## Project Structure
- `/src/app`: Next.js App Router core containing layout wrappings and nested routes.
- `/src/app/(auth)`: Unauthenticated routes (like Login).
- `/src/app/(protected)`: Authenticated routes demanding valid sessions (like Dashboard and Lead Journeys). 
- `/src/views/components/ui`: Reusable UI components (buttons, cards, loaders).
- `/src/views/components/common`: Common navigation structures and layouts.
- `/src/core/contexts`: Session states, Toast contexts, and global context providers.
- `/src/views/features`: Heavily interactive legacy components integrated dynamically via Next.js wrappers.

## Handover Notes for Dev Team
- Ensure all Client Components utilize the `"use client";` directive at the top of the file to retain browser interactivity and hook access (`usePathname`, `useRouter`).
- **Loaders**: Always use the `PFLStageLoader` component for any intermediate processing states to maintain visual consistency.
- **Branding**: The project uses "Pulse Agent Assist" as the primary product name. Ensure any new pages follow this naming convention.
- **Simulations**: The backend logic currently simulates server transactions using local client timeouts.

---
*Developed by PFL IT Team*
