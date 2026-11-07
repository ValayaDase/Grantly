# GRANTLY — System Architecture Documentation

This document describes the architectural design, component hierarchy, state flow, deterministic rule engine, and data persistence models of **GRANTLY – Unified Scholarship Discovery & Management Platform**.

---

## 📋 Table of Contents

- [1. Executive Summary & Design Principles](#1-executive-summary--design-principles)
- [2. High-Level System Architecture](#2-high-level-system-architecture)
- [3. Frontend Architecture](#3-frontend-architecture)
- [4. Component Architecture](#4-component-architecture)
- [5. Domain Logic & Algorithmic Engines](#5-domain-logic--algorithmic-engines)
  - [5.1 Explainable Match Score Algorithm (100 Pts)](#51-explainable-match-score-algorithm-100-pts)
  - [5.2 Deterministic Eligibility Rule Engine](#52-deterministic-eligibility-rule-engine)
  - [5.3 Application Readiness Index](#53-application-readiness-index)
  - [5.4 Deadline Intelligence & Countdown Calculations](#54-deadline-intelligence--countdown-calculations)
- [6. Data Flow & Sequence Diagrams](#6-data-flow--sequence-diagrams)
  - [6.1 Discovery & Personalized Matching Flow](#61-discovery--personalized-matching-flow)
  - [6.2 Eligibility Evaluation Flow](#62-eligibility-evaluation-flow)
  - [6.3 7-Stage Application Lifecycle Flow](#63-7-stage-application-lifecycle-flow)
  - [6.4 Document Vault & Readiness Flow](#64-document-vault--readiness-flow)
- [7. Authentication & Session Architecture](#7-authentication--session-architecture)
- [8. Persistence & Storage Architecture](#8-persistence--storage-architecture)
- [9. Security & Privacy Considerations](#9-security--privacy-considerations)
- [10. Scalability & Future Backend Migration Path](#10-scalability--future-backend-migration-path)

---

## 1. Executive Summary & Design Principles

Indian students frequently forfeit millions of rupees in academic funding due to fragmented state and central portals, convoluted qualifying guidelines, missed deadlines, and disorganized paperwork.

**GRANTLY** solves this through a unified digital workspace designed around five core principles:

1. **Deterministic Transparency (Zero Black-Box Scoring)**: Rather than using opaque neural predictions, eligibility is evaluated through an explainable multi-condition rule engine that breaks down exactly which condition passed, failed, or requires attention.
2. **Offline-First Data Privacy**: Sensitive student personal information, academic marks, and caste/income documents are stored and processed entirely in the student's browser sandbox, minimizing data exposure.
3. **Zero-Latency Static Pre-rendering**: Every scholarship detail view (`/scholarships/[id]`) is pre-rendered at build time via Next.js 16 static site generation (`generateStaticParams`), ensuring instant load times and optimal SEO.
4. **Synchronized Reactive State**: A centralized React Context (`AppContext`) coordinates profile updates, bookmark toggles, application pipeline shifts, and document uploads with automatic `LocalStorage` serialization.
5. **Modern SaaS Aesthetic**: An off-white fintech visual design (`#F8F9FC`), Deep Navy typography (`#171B2D`), Royal Purple primary highlights (`#5B4BDB`), Vibrant Teal progress indicators (`#18B6A4`), and GSAP scroll storytelling.

---

## 2. High-Level System Architecture

GRANTLY operates as a high-performance, client-orchestrated Next.js 16 application with static dataset preloading and browser storage synchronization.

```mermaid
graph TD
    subgraph UserSpace ["Client Browser Environment"]
        subgraph Presentation ["Presentation Layer (React 19 & Next.js 16 App Router)"]
            Landing["Landing Page (Hero, GSAP Cards, Metrics)"]
            Catalog["Scholarship Discovery Catalog (/scholarships)"]
            Detail["Dynamic Scholarship Details (/scholarships/[id])"]
            Dash["Student Dashboard (/dashboard)"]
            Tracker["7-Stage Application Tracker (/applications)"]
            Vault["Document Vault & Readiness (/documents)"]
            Checker["Smart Eligibility Checker (/eligibility)"]
            Profile["Profile & Onboarding (/profile, /onboarding)"]
        end

        subgraph CoreContext ["State & Domain Logic Layer (src/context & src/lib)"]
            AppContext["AppContext Provider\n(Central State & Action Dispatcher)"]
            
            subgraph Engines ["Algorithmic Evaluation Engines"]
                MatchEngine["Match Score Engine\n(0-100 Weighted Score)"]
                EligEngine["Eligibility Rule Engine\n(Multi-Condition Logic)"]
                ReadyEngine["Readiness Index Engine\n(Document Cross-Referencing)"]
                DeadlineEngine["Deadline Intelligence\n(Countdown & Classification)"]
                RecomEngine["Recommendation Engine\n(Multi-Criteria Sorting)"]
            end
        end

        subgraph ClientStorage ["Persistence Layer (Browser Sandbox)"]
            LS_Profile["LocalStorage: grantly_v1_profile"]
            LS_Saved["LocalStorage: grantly_v1_saved"]
            LS_Apps["LocalStorage: grantly_v1_applications"]
            LS_Docs["LocalStorage: grantly_v1_documents"]
            LS_Notifs["LocalStorage: grantly_v1_notifications"]
            LS_Auth["LocalStorage: grantly_v1_auth"]
        end
    end

    subgraph StaticAssets ["Static Build Artifacts (Server / CDN)"]
        Dataset["In-Memory Scholarship Dataset\n(18 Verified Indian Schemes)"]
        DemoSeed["Priya Sharma Demo Profile\n(Sample Data Seed)"]
        StaticHTML["Pre-rendered HTML / Turbopack Chunks\n(36 Static Routes)"]
    end

    StaticAssets --> StaticHTML
    Dataset --> AppContext
    DemoSeed --> AppContext

    Presentation <--> AppContext
    AppContext <--> Engines
    AppContext <--> ClientStorage
```

---

## 3. Frontend Architecture

GRANTLY leverages the **Next.js 16 App Router** with React 19 server and client components:

### App Router Route Tree

```
src/app/
├── layout.tsx                    # Root HTML layout with AppProvider & metadata
├── globals.css                   # Tailwind v4 directives, custom gradient tokens
├── page.tsx                      # Landing page with GSAP scroll storytelling
├── login/page.tsx                # Authentication screen with demo autofill
├── signup/page.tsx               # Account creation wizard
├── forgot-password/page.tsx      # Password recovery simulation
├── onboarding/page.tsx           # 4-step student profile onboarding
├── dashboard/page.tsx            # Analytics KPIs, recommendations, application pipeline
├── scholarships/
│   ├── page.tsx                  # Search, faceted filters, and sorting catalog
│   └── [id]/
│       ├── page.tsx              # Static route wrapper with generateStaticParams()
│       └── ScholarshipDetailClient.tsx # Interactive scholarship detail view
├── applications/page.tsx         # 7-stage Kanban application pipeline
├── documents/page.tsx            # Document Vault with local upload simulation
├── eligibility/page.tsx          # Standalone explainable rule engine evaluator
├── notifications/page.tsx        # System alerts & deadline notifications
├── profile/page.tsx              # Comprehensive student profile editor
└── settings/page.tsx             # Preferences, theme toggles, and data reset
```

### Static Pre-rendering (`generateStaticParams`)

The dynamic route `/scholarships/[id]` leverages Next.js 16 `generateStaticParams()` to pre-render all 18 scholarship schemes into static HTML at build time:

```typescript
export async function generateStaticParams() {
  return SCHOLARSHIPS_DATA.map((scholarship) => ({
    id: scholarship.id,
  }));
}
```

This guarantees:
- Sub-50ms Time to First Byte (TTFB) when visiting any scholarship scheme.
- Full search engine crawlability and OpenGraph indexing.
- Zero server database latency during navigation.

---

## 4. Component Architecture

The component hierarchy is structured for maximum modularity and reusability:

```mermaid
graph TD
    AppProvider["AppProvider (src/context/AppContext.tsx)"]
    
    subgraph LayoutWrappers ["Layout & Shell Components"]
        DashLayout["DashboardLayout (src/components/layout/DashboardLayout.tsx)"]
        Sidebar["Sidebar (src/components/layout/Sidebar.tsx)"]
        TopNav["TopNav (src/components/layout/TopNav.tsx)"]
        Navbar["Navbar (src/components/layout/Navbar.tsx)"]
        Footer["Footer (src/components/layout/Footer.tsx)"]
        Drawer["ComparisonDrawer (src/components/layout/ComparisonDrawer.tsx)"]
    end

    subgraph FeatureComponents ["Domain Feature Components"]
        Filters["ScholarshipFilters (src/components/scholarships/ScholarshipFilters.tsx)"]
        SchCard["ScholarshipCard (src/components/scholarships/ScholarshipCard.tsx)"]
        Chart["AnalyticsChart (src/components/dashboard/AnalyticsChart.tsx)"]
        Connected["ConnectedCardExperience (src/components/landing/ConnectedCardExperience.tsx)"]
        Hero["HeroSection (src/components/landing/HeroSection.tsx)"]
    end

    subgraph CommonPrimitives ["Common UI Primitives"]
        Badge["Badge (src/components/common/Badge.tsx)"]
        Modal["Modal (src/components/common/Modal.tsx)"]
        ProgressBar["ProgressBar (src/components/common/ProgressBar.tsx)"]
        EmptyState["EmptyState (src/components/common/EmptyState.tsx)"]
        Logo["Logo (src/components/common/Logo.tsx)"]
    end

    AppProvider --> DashLayout
    AppProvider --> Drawer
    DashLayout --> Sidebar
    DashLayout --> TopNav
    
    DashLayout --> FeatureComponents
    FeatureComponents --> CommonPrimitives
```

---

## 5. Domain Logic & Algorithmic Engines

All business logic is isolated in pure, deterministic TypeScript modules under `src/lib/`.

### 5.1 Explainable Match Score Algorithm (100 Pts)

Implemented in [`src/lib/matchScore.ts`](file:///e:/grantly/src/lib/matchScore.ts), this algorithm calculates a 0–100% compatibility rating based on five weighted dimensions:

| Dimension | Max Points | Weight | Criteria Logic |
| :--- | :--- | :--- | :--- |
| **Education Level** | 20 pts | 20% | Direct level match (e.g. Undergraduate matches Undergraduate) or open to all. |
| **Academic Performance** | 25 pts | 25% | Marks >= required + 15% (25 pts), marks >= required (20 pts), borderline within 5% (8 pts), below (0 pts). |
| **Financial Need** | 25 pts | 25% | Income <= 50% of ceiling (25 pts), income <= ceiling (20 pts), exceeding ceiling (0 pts). |
| **Category & Gender** | 15 pts | 15% | Matching targeted social category (SC/ST/OBC/EWS/Minority) and gender benefits (e.g. Pragati for girls). |
| **State Domicile** | 15 pts | 15% | All-India schemes (15 pts), direct state domicile match (15 pts), other states (0 pts). |

### 5.2 Deterministic Eligibility Rule Engine

Implemented in [`src/lib/eligibility.ts`](file:///e:/grantly/src/lib/eligibility.ts), this engine evaluates declared requirements against the student's profile:

- **Input**: `Scholarship` object + `StudentProfile` object.
- **Output**: `EligibilityReport` with:
  - `status`: `'ELIGIBLE' | 'POTENTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'PROFILE_INCOMPLETE'`
  - `overallScore`: Percentage of mandatory criteria satisfied.
  - `rules`: Array of `RuleEvaluation` entries containing name, student value, required benchmark, and status (`satisfied`, `failed`, or `missing_info`).
  - `actionItems`: Remediation steps for the student.

### 5.3 Application Readiness Index

Implemented in [`src/lib/readiness.ts`](file:///e:/grantly/src/lib/readiness.ts):
- Compares `scholarship.requiredDocuments` against `documents` uploaded in the student's **Document Vault**.
- Confirms whether student onboarding is complete.
- Confirms eligibility verification.
- Calculates an aggregate `readinessScore` (0–100%) and returns an itemized checklist.

### 5.4 Deadline Intelligence & Countdown Calculations

Implemented in [`src/lib/deadline.ts`](file:///e:/grantly/src/lib/deadline.ts):
- Computes difference between `Date.now()` and ISO deadline.
- Classifies urgency:
  - `isClosingSoon`: 7 days or fewer remaining (Red alert).
  - `isDueThisMonth`: 30 days or fewer remaining (Amber notice).
  - `isOpen`: More than 30 days remaining (Normal blue/green badge).
  - `isPassed`: Deadline elapsed (Gray badge).

---

## 6. Data Flow & Sequence Diagrams

### 6.1 Discovery & Personalized Matching Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Catalog as /scholarships Page
    participant AppCtx as AppContext Provider
    participant MatchEng as matchScore.ts
    participant Data as SCHOLARSHIPS_DATA

    Student->>Catalog: Opens Discovery Catalog
    Catalog->>AppCtx: Request profile, filters, and scholarship list
    AppCtx->>Data: Read 18 in-memory scholarships
    loop For Each Scholarship
        Catalog->>MatchEng: calculateMatchScore(scholarship, profile)
        MatchEng-->>Catalog: Return MatchScoreBreakdown (0-100 pts + reasons)
    end
    Catalog->>Catalog: Apply faceted filters (State, Level, Category, Amount)
    Catalog->>Catalog: Sort by recommended match score
    Catalog-->>Student: Display ranked cards with Match badges & Deadline urgency
```

### 6.2 Eligibility Evaluation Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Page as /scholarships/[id]
    participant EligEng as eligibility.ts
    participant AppCtx as AppContext

    Student->>Page: Navigates to Scholarship Detail
    Page->>AppCtx: Read current profile
    Page->>EligEng: evaluateScholarshipEligibility(scholarship, profile)
    Note over EligEng: Evaluates Education, Percentage, Income, Gender, State, Category
    EligEng-->>Page: Return EligibilityReport (Status: ELIGIBLE / FAILED, Rules[])
    Page-->>Student: Renders interactive Breakdown Card with green/red status pills
```

### 6.3 7-Stage Application Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Tracker as /applications Page
    participant AppCtx as AppContext
    participant LS as Browser LocalStorage

    Student->>Tracker: Drags / Transitions card from "Planning to Apply" to "Applied"
    Tracker->>AppCtx: updateApplicationStatus(appId, "Applied")
    AppCtx->>AppCtx: Update application state with updatedDate = now()
    AppCtx->>LS: Serialize to grantly_v1_applications
    AppCtx->>AppCtx: Trigger addNotification("Application status changed to Applied")
    AppCtx->>LS: Serialize to grantly_v1_notifications
    AppCtx-->>Tracker: Re-render Kanban columns with updated KPI counts
```

### 6.4 Document Vault & Readiness Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Vault as /documents Page
    participant AppCtx as AppContext
    participant ReadyEng as readiness.ts
    participant LS as Browser LocalStorage

    Student->>Vault: Uploads "Income Certificate" (PDF file)
    Vault->>AppCtx: uploadDocument({ documentType: "Income Certificate", fileName, fileSize })
    AppCtx->>AppCtx: Generate UUID, set verified = true, timestamp = now()
    AppCtx->>LS: Serialize to grantly_v1_documents
    Student->>Vault: Views Readiness Matrix
    Vault->>ReadyEng: calculateApplicationReadiness(scholarship, profile, documents)
    ReadyEng-->>Vault: Return readinessScore (e.g. 100% Ready)
    Vault-->>Student: Updates progress bar to 100% & enables direct apply button
```

---

## 7. Authentication & Session Architecture

GRANTLY's current implementation uses an **offline-first, client-side session management model**:

1. **Pre-Seeded Demo Profile**: By default, the application runs with an authenticated session initialized to **Priya Sharma** (`student-demo-priya`), allowing immediate evaluation of all matching, scoring, and tracking features.
2. **One-Click Demo Switcher**: The Login screen (`/login`) allows one-click demo login or custom login.
3. **Custom Registration Flow**: The Signup wizard (`/signup`) captures student credentials and passes them to `login(customProfile)` in `AppContext`, which creates an active session.
4. **Session Persistence**: Session state is persisted in `LocalStorage` (`grantly_v1_profile` and `grantly_v1_auth`). Logging out resets session state without destroying public catalog browsing capabilities.

---

## 8. Persistence & Storage Architecture

GRANTLY stores all mutable state in the browser's `LocalStorage` with resilient fallback handling:

| Storage Key | Data Model | Description | Default Fallback |
| :--- | :--- | :--- | :--- |
| `grantly_v1_profile` | `StudentProfile` | Current student profile, marks, income, categories | `DEMO_STUDENT_PROFILE` |
| `grantly_v1_saved` | `string[]` | Array of bookmarked scholarship IDs | `INITIAL_SAVED_IDS` (3 items) |
| `grantly_v1_applications` | `Application[]` | Application pipeline instances with status, notes | `INITIAL_APPLICATIONS` (4 items) |
| `grantly_v1_documents` | `DocumentItem[]` | Document Vault files metadata and verification status | `INITIAL_DOCUMENTS` (5 items) |
| `grantly_v1_notifications` | `NotificationItem[]` | System and deadline notifications | `INITIAL_NOTIFICATIONS` (4 items) |

### Error Resiliency & Safe Initialization

To prevent React 19 hydration mismatches and handle browser storage exceptions (such as private browsing mode):
- State hooks in `AppContext.tsx` use lazy initializer functions (`useState(() => { try { ... } catch { ... } })`).
- If `localStorage` is inaccessible or JSON parsing fails, the system safely falls back to demo data without throwing unhandled exceptions.

---

## 9. Security & Privacy Considerations

- **Client Data Isolation**: All student personal data, income declarations, and document records remain completely within the client's browser local storage. No Personally Identifiable Information (PII) is transmitted across third-party networks.
- **XSS Mitigation**: React 19's virtual DOM escapes all dynamic values rendered in JSX by default, preventing reflected or stored Cross-Site Scripting.
- **Document Safety**: Document uploads are handled as metadata representations with mock file handles in the prototype phase, preventing local file system compromise or unauthorized execution.
- **Content Security**: No dynamic `eval()` or unvalidated `dangerouslySetInnerHTML` is used anywhere in the codebase.

---

## 10. Scalability & Future Backend Migration Path

Because GRANTLY's domain logic in `src/lib/` is completely decoupled from the React presentation layer, migrating to an enterprise backend is straightforward:

```mermaid
graph LR
    subgraph CurrentFrontend ["Current Architecture (Phase 1)"]
        UI_Current["React UI Components"] --> AppContext_Current["AppContext (LocalStorage Sync)"]
        AppContext_Current --> PureEngines["Pure Algorithms (src/lib/)"]
    end

    subgraph FutureEnterprise ["Enterprise Migration (Phase 2)"]
        UI_Future["React UI Components"] --> TanStack["TanStack Query (React Query)"]
        TanStack --> REST_API["Next.js Route Handlers / REST API"]
        REST_API --> NodeService["NestJS / Node.js Microservices"]
        NodeService --> PureEnginesBackend["Same Pure Algorithms (src/lib/)"]
        NodeService --> Postgres["PostgreSQL + Prisma ORM"]
        NodeService --> S3["AWS S3 Encrypted Document Storage"]
    end
```

Key migration advantages:
1. `src/lib/matchScore.ts` and `src/lib/eligibility.ts` can run unmodified on Node.js backends or PostgreSQL stored procedures.
2. `src/types/index.ts` maps 1:1 to Prisma schemas or SQL tables (documented in [`docs/database/DATABASE_DOCUMENTATION.md`](../database/DATABASE_DOCUMENTATION.md)).
3. The UI components will only swap context hooks with standard API query hooks (`useQuery`, `useMutation`).

