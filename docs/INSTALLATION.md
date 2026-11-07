# GRANTLY — Installation & Setup Guide

This document provides clear, reproducible, step-by-step instructions for installing, configuring, and running **GRANTLY – Unified Scholarship Discovery & Management Platform** on local development workstations and production environments.

---

## 📋 Table of Contents

- [1. System Prerequisites](#1-system-prerequisites)
- [2. Technology Stack](#2-technology-stack)
- [3. Detailed Dependencies Reference](#3-detailed-dependencies-reference)
- [4. Step-by-Step Installation](#4-step-by-step-installation)
- [5. Environment Variables Configuration](#5-environment-variables-configuration)
- [6. Database & Persistence Setup](#6-database--persistence-setup)
- [7. Available Execution Scripts](#7-available-execution-scripts)
- [8. Production Deployment](#8-production-deployment)
- [9. Troubleshooting & FAQ](#9-troubleshooting--faq)

---

## 1. System Prerequisites

Before installing GRANTLY, ensure your development environment satisfies the following baseline requirements:

| Component | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.18.0` | `v20.x` or `v22.x` (LTS) | `node -v` |
| **npm** | `v9.0.0` | `v10.x` | `npm -v` |
| **Operating System** | Windows 10/11, macOS 12+, Ubuntu 20.04+ | Any modern 64-bit OS | - |
| **Web Browser** | Chromium 100+, Firefox 100+, Safari 15+ | Latest Google Chrome / Edge | - |
| **Git** | `v2.30.0` | Latest | `git -v` |

> [!NOTE]
> This workspace's lint, type-check, and production build were run on 2026-11-07. Use the commands above to check versions in your environment.

---

## 2. Technology Stack

GRANTLY is built on modern web foundations:

- **Framework**: Next.js 16.4.5 (App Router with Turbopack)
- **UI Runtime**: React 19.3.0 & React DOM 19.3.0
- **Language**: TypeScript 5 (Strict Mode enabled)
- **CSS Styling**: Tailwind CSS v4 with `@tailwindcss/turbopack`
- **Animation Suite**: GSAP 3.15.1, `@gsap/react` 2.1.2, Framer Motion 14.10.1, Canvas Confetti 1.9.4
- **Data Visualization**: Recharts 3.10.1
- **Icons**: Lucide React 1.70.0
- **Code Quality**: ESLint 9 with `eslint-config-next` 16.4.5

---

## 3. Detailed Dependencies Reference

All dependencies are recorded in `package.json`. Below is the complete manifest with installed versions and their exact roles:

### Runtime Dependencies (`dependencies`)

| Package | Installed Version | Purpose in GRANTLY |
| :--- | :--- | :--- |
| **`next`** | `16.4.5` | Modern App Router framework providing static site generation (`generateStaticParams`), Turbopack compiler, partial prefetching, and client routing. |
| **`react`** | `19.3.0` | Core UI component library powering client-side interactive components and hooks. |
| **`react-dom`** | `19.3.0` | React DOM renderer for browser mounting and portal rendering. |
| **`gsap`** | `^3.15.1` | GreenSock Animation Platform. Drives advanced scroll storytelling, card stacking, physical card drop transitions, and gradient reveals. |
| **`@gsap/react`** | `^2.1.2` | Official GSAP React integration hook (`useGSAP`) managing lifecycle-safe animation contexts and automatic garbage collection. |
| **`framer-motion`** | `^14.10.1` | Declarative UI animations, modal dialog transitions, drawer slides, accordion toggles, and layout animations. |
| **`lucide-react`** | `^1.70.0` | Accessible, tree-shakeable SVG icon collection used across navigation, dashboard KPIs, badges, and status pills. |
| **`recharts`** | `^3.10.1` | Declarative SVG charting library powering the interactive match distribution and application analytics charts in the Dashboard. |
| **`canvas-confetti`** | `^1.9.4` | Particle celebration micro-interaction triggered upon saving applications, completing onboarding, and profile milestones. |

### Development Dependencies (`devDependencies`)

| Package | Installed Version | Purpose in GRANTLY |
| :--- | :--- | :--- |
| **`typescript`** | `^5` | Strict static type checking across models, calculation utilities, and React components. |
| **`tailwindcss`** | `^4` | Next-generation utility-first CSS engine with CSS variables, fluid typography, and design tokens. |
| **`@tailwindcss/turbopack`** | `^4` | Official Turbopack plugin binding Tailwind v4 directly to Next.js Turbopack compiler. |
| **`eslint`** | `^9` | Code analysis and linting engine identifying potential defects and syntax violations. |
| **`eslint-config-next`** | `16.4.5` | Standard Next.js linting configuration enforcing React Hooks and accessibility rules. |
| **`@types/node`** | `^20` | TypeScript type declarations for Node.js runtime APIs. |
| **`@types/react`** | `^19` | TypeScript type declarations for React 19. |
| **`@types/react-dom`** | `^19` | TypeScript type declarations for React DOM. |
| **`@types/canvas-confetti`** | `^1.9.0` | TypeScript type definitions for the canvas-confetti library. |

---

## 4. Step-by-Step Installation

Follow these steps to set up the codebase locally:

### Step 1: Clone or Navigate to the Workspace

Open your terminal or PowerShell and navigate to the project directory:

```bash
cd e:/grantly
```

If cloning from a remote Git repository:

```bash
git clone <repository-url> grantly
cd grantly
```

### Step 2: Verify Node.js and npm Versions

Confirm that your installed Node.js version is compatible:

```bash
node -v
# Output should be >= v18.18.0 (e.g. v22.13.1)

npm -v
# Output should be >= v9.0.0 (e.g. 10.9.2)
```

### Step 3: Clean Install Dependencies

Install all required runtime and development packages using npm:

```bash
npm install
```

> [!TIP]
> If you encounter lockfile mismatches or want a clean reproducible build from `package-lock.json`, run:
> ```bash
> npm ci
> ```

---

## 5. Environment Variables Configuration

GRANTLY is a **browser-side prototype**; its local scholarship catalog and demo state do not require a database or configured API service.

All scholarship datasets, rule engines, match algorithms, and persistence mechanisms run directly inside the browser using React Context and `LocalStorage`. Consequently, **no mandatory environment variables are required** to run GRANTLY in development or production.

### Optional Configuration (`.env.local`)

If you wish to configure optional metadata or prepare for future API services, create a `.env.local` file in the root directory:

```bash
# Optional: Base canonical URL for OpenGraph metadata and SEO sitemaps
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Environment flag
NODE_ENV=development

# Future Roadmap (Optional external integrations)
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 6. Database & Persistence Setup

GRANTLY does **not require a running database server** (such as PostgreSQL, MySQL, or MongoDB) to function.

- **Data Source**: 18 seeded scholarship records are loaded in-memory from [`src/data/scholarships.ts`](file:///e:/grantly/src/data/scholarships.ts). They are not a live or independently verified feed; confirm current details with providers.
- **Client Persistence**: User profile, saved scholarships, document vault records, notifications, and application pipelines are managed via [`src/context/AppContext.tsx`](file:///e:/grantly/src/context/AppContext.tsx) and synchronized to the browser's `LocalStorage` using keys prefixed with `grantly_v1_`.
- **Pre-Seeded Demo Student**: The platform seeds a demo profile (**Priya Sharma**) on first launch. Login is simulated and does not provide production authentication or route authorization.
- **Document Records**: The vault stores file metadata in browser storage; selected file contents are not retained by this prototype.

> To learn more about data schemas and future SQL migration plans, see [`docs/database/DATABASE_DOCUMENTATION.md`](./database/DATABASE_DOCUMENTATION.md).

---

## 7. Available Execution Scripts

The following npm scripts are defined in `package.json`:

### 1. Launch Development Server
```bash
npm run dev
```
Starts the Next.js development server with **Turbopack** enabled on `http://localhost:3000`. Hot-reloading and fast refresh are active.

### 2. Static Production Build
```bash
npm run build
```
Executes TypeScript type checking and compiles the application into an optimized production build (`.next/`). All 36 static pages (including dynamic scholarship routes `/scholarships/[id]`) are pre-rendered into static HTML.

### 3. Run Production Server
```bash
npm run start
```
Starts the Next.js production server serving the compiled production assets from `.next/`. Requires `npm run build` to have run first.

### 4. Code Quality & Linting
```bash
npm run lint
```
Runs ESLint across all `.ts` and `.tsx` files in `src/` to verify compliance with React Hooks, TypeScript guidelines, and accessibility standards.

### 5. Type Safety Check (Direct TypeScript)
```bash
npx tsc --noEmit
```
Performs a comprehensive TypeScript compilation check without emitting files, ensuring zero type errors or interface discrepancies across the workspace.

---

## 8. Production Deployment

### Deploying to Vercel (Recommended)

Because GRANTLY is a standard Next.js App Router project:

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import the repository into [Vercel](https://vercel.com).
3. Vercel automatically detects Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. Click **Deploy**. All 36 static pages are pre-rendered and deployed to Vercel's global Edge Network.

### Deploying to Static Hosting / Node.js Server

To deploy to any Node.js hosting platform (AWS EC2, DigitalOcean, Render, Railway):

```bash
# 1. Install dependencies
npm ci

# 2. Build production assets
npm run build

# 3. Start Node.js server
PORT=3000 npm run start
```

---

## 9. Troubleshooting & FAQ

### Issue 1: Port 3000 is Already in Use
**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`  
**Solution**: Run Next.js on an alternate port:
```bash
npm run dev -- -p 3001
```

### Issue 2: Corrupted Next.js or Turbopack Build Cache
**Symptom**: Unexplained build compilation errors or stale CSS styles.  
**Solution**: Remove the `.next` compilation folder and rebuild:
```powershell
# Windows PowerShell
Remove-Item -Recurse -Force .next
npm run dev
```
```bash
# macOS / Linux
rm -rf .next
npm run dev
```

### Issue 3: PowerShell Script Execution Policy (Windows)
**Symptom**: `File ...\npm.ps1 cannot be loaded because running scripts is disabled on this system.`  
**Solution**: Set the process execution policy:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Issue 4: LocalStorage Corrupted or Stale Prototype State
**Symptom**: Application displays conflicting state or missing profile properties after testing.  
**Solution**: 
1. Navigate to **Settings** (`/settings`) inside GRANTLY and click **Reset to Demo Data**.
2. Or clear browser storage via DevTools: `Application > Local Storage > Clear All`, then refresh the page.

---

## 🔗 Next Steps

- Explore the system architecture in [`docs/architecture/SYSTEM_ARCHITECTURE.md`](./architecture/SYSTEM_ARCHITECTURE.md).
- Review requirements and use cases in [`docs/requirements/SRS.md`](./requirements/SRS.md).
- Follow student workflows in [`docs/user-guide/USER_GUIDE.md`](./user-guide/USER_GUIDE.md).

