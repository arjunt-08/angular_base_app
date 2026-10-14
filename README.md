# Angular Enterprise Starter Kit (ApexCore)

A production-oriented, scalable foundation for enterprise web applications built on **Angular 22**, **TypeScript (Strict Mode)**, **Standalone Components**, **Angular Signals**, **RxJS**, and **Feature-Based Clean Architecture**.

---

## Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Folder Structure](#folder-structure)
3. [Key Architectural Pillars](#key-architectural-pillars)
4. [Dependency Inversion & Flow](#dependency-inversion--flow)
5. [State Management with Signals](#state-management-with-signals)
6. [Design System & Theming](#design-system--theming)
7. [Getting Started & Development](#getting-started--development)
8. [Guide: Adding a New Feature](#guide-adding-a-new-feature)
9. [Guide: Registering Repositories & Replacing Mock Data](#guide-registering-repositories--replacing-mock-data)
10. [Guide: Security Responsibilities](#guide-security-responsibilities)
11. [Available Scripts](#available-scripts)

---

## Architectural Overview

This starter kit implements **Feature-Based Clean Architecture**, decoupling domain logic from UI presentation, HTTP networking, and infrastructure details.

```
UI (Presentation)
  └──> State Management (Angular Signals)
        └──> Use Cases (Application Layer)
              └──> Abstract Repositories (Domain Layer)
                    └──> Repository Implementations (Data Layer)
                          └──> Data Sources (Mock or HttpClient)
                                └──> Backend API
```

- **Domain Layer**: Contains pure business models, domain errors, and abstract repository contracts. It has **zero dependencies** on Angular, HTTP clients, or UI components.
- **Application Layer**: Contains business use cases and feature state management. It depends solely on abstract domain contracts.
- **Data Layer**: Contains API DTOs, pure mappers, concrete repository implementations, and data sources (isolated mock and HTTP-backed).
- **Presentation Layer**: Standalone components, reactive forms, and UI states. **Never calls APIs directly**.
- **Core Layer**: Application configuration, HTTP interceptors (auth, timeout, error normalization, logging), structured logger, route guards, and error handling.
- **Shared Layer**: Reusable standalone UI components, directives, pipes, validators, and async state helpers.
- **Design System**: Centralized SCSS tokens and CSS custom properties supporting dark/light mode without hardcoded colors.

---

## Folder Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/                        # User models, token storage, auth service
│   │   ├── config/                      # AppConfig, injection tokens, ConfigService
│   │   ├── guards/                      # authGuard, roleGuard, canDeactivateGuard
│   │   ├── http/
│   │   │   ├── error-handling/          # AppHttpError, typed ErrorCode, GlobalErrorHandler
│   │   │   └── interceptors/            # apiPrefix, auth, logging, timeout, error interceptors
│   │   ├── logging/                     # Structured logger with sensitive data redaction
│   │   ├── monitoring/                  # APM & telemetry abstraction (Sentry/Datadog hooks)
│   │   ├── notification/                # Signal-based toast notification bus
│   │   └── providers/                   # provideCore() master provider
│   │
│   ├── shared/
│   │   ├── directives/                  # auto-focus, click-outside
│   │   ├── pipes/                       # truncate, relative-time, status-badge
│   │   ├── types/                       # api-response, async-state, pagination
│   │   ├── ui/                          # Button, TextInput, Select, Checkbox, Card, Table,
│   │   │                                # Pagination, Modal, ConfirmDialog, Toast, Skeleton,
│   │   │                                # LoadingIndicator, EmptyState, ErrorState, Breadcrumbs
│   │   ├── utils/                       # http-params, async-state helpers
│   │   └── validators/                  # noWhitespace, positiveNumber, url validators
│   │
│   ├── design-system/
│   │   ├── styles/                      # _reset.scss, _utilities.scss, _index.scss
│   │   ├── themes/                      # _light.scss, _dark.scss, ThemeService
│   │   └── tokens/                      # _colors, _typography, _spacing, _radii, _shadows, _breakpoints, _transitions
│   │
│   ├── layout/
│   │   ├── footer/                      # App footer with metadata
│   │   ├── header/                      # Top bar with theme toggle, user info, breadcrumbs
│   │   ├── navigation/                  # NavItem interfaces and permissions
│   │   ├── shell/                       # Main responsive shell layout
│   │   └── sidebar/                     # Collapsible drawer with active routing
│   │
│   ├── features/
│   │   ├── auth/                        # Public authentication routes & login.component.ts
│   │   ├── dashboard/                   # Landing dashboard with architecture metrics
│   │   └── demo/                        # Complete 7-layer portfolio management feature
│   │       ├── application/
│   │       │   ├── state/               # Signal-based ProjectStateService
│   │       │   └── use-cases/           # get-projects, create-project, delete-project use cases
│   │       ├── domain/
│   │       │   ├── errors/              # ProjectNotFoundError, DuplicateProjectError
│   │       │   ├── models/              # Project, ProjectFilterCriteria
│   │       │   └── repositories/        # Abstract ProjectRepository class
│   │       ├── data/
│   │       │   ├── datasources/         # IProjectDatasource, MockDatasource, RemoteDatasource
│   │       │   ├── dto/                 # ProjectDto, request/response DTOs
│   │       │   ├── mappers/             # ProjectMapper (pure functions)
│   │       │   └── repositories/        # ProjectRepositoryImpl
│   │       ├── presentation/
│   │       │   ├── demo-list.component.ts
│   │       │   └── demo-form-modal/
│   │       ├── demo.providers.ts        # Feature provider binding
│   │       └── demo.routes.ts           # Lazy loaded feature routes
│   │
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
│
├── environments/
│   ├── environment.model.ts
│   ├── environment.prod.ts
│   └── environment.ts
└── styles.scss
```

---

## Key Architectural Pillars

### 1. Zero Backend Required at Launch
The starter kit includes a fully isolated in-memory mock datasource (`ProjectMockDatasource`) with 10+ pre-seeded enterprise records, simulated network latency, search filtering, pagination, and CRUD capabilities. The app can be launched immediately without backend dependencies or credentials.

### 2. Five-State Asynchronous Lifecycle
Features expose 5 explicit, mutually exclusive states via Angular Signals:
- `initial`: Before data loading begins.
- `loading`: Request in flight (displays shimmer skeleton loaders).
- `success`: Data loaded (displays responsive data tables and pagination).
- `empty`: Zero matching records (displays graphic empty state with filter reset action).
- `error`: Communication or server failure (displays error alert with retry button).

An interactive **"Simulate API Failure"** toggle button is built into the Demo screen so you can immediately verify error recovery, retry actions, and toast alerts.

---

## Dependency Inversion & Flow

In strict compliance with Clean Architecture:
- UI components inject `ProjectStateService`.
- `ProjectStateService` invokes application Use Cases (`GetProjectsUseCase`, `CreateProjectUseCase`, etc.).
- Use Cases depend **only** on the abstract class `ProjectRepository`.
- `ProjectRepositoryImpl` implements `ProjectRepository`, injecting `IProjectDatasource` via `PROJECT_DATASOURCE`.
- `ProjectMockDatasource` and `ProjectRemoteDatasource` implement `IProjectDatasource`.

### Provider Registration
In `src/app/features/demo/demo.providers.ts`:
```typescript
export function provideDemoFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ProjectRepository,
      useClass: ProjectRepositoryImpl,
    },
    {
      provide: PROJECT_DATASOURCE,
      useFactory: (config: ConfigService) =>
        config.isMockDataEnabled ? new ProjectMockDatasource() : new ProjectRemoteDatasource(),
      deps: [ConfigService],
    },
    ProjectStateService,
    GetProjectsUseCase,
    CreateProjectUseCase,
    DeleteProjectUseCase,
  ]);
}
```

---

## State Management with Signals

Instead of heavy external store libraries, this starter uses **Angular Signals**:
- `state = signal<FeatureStateModel>(...)`
- Selectors as `computed(() => ...)` (e.g., `isLoading`, `projects`, `totalPages`)
- RxJS operators (`switchMap`, `debounceTime`, `takeUntilDestroyed`) for asynchronous HTTP query orchestration.

---

## Design System & Theming

- **Tokens**: SCSS variables for colors, typography scale, spacing (4px scale), border radii, elevation shadows, and breakpoints.
- **CSS Custom Properties**: `:root` and `[data-theme='dark']` define all UI colors at runtime.
- **ThemeService**: Detects system color preference (`prefers-color-scheme`), persists choice to `localStorage`, and updates `data-theme` attribute on `<html>`.

---

## Getting Started & Development

### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation
```bash
npm install
```

### Run Locally
```bash
npm start
```
Navigate to `http://localhost:4200/`.

---

## Guide: Adding a New Feature

When creating a new business module (e.g., `invoices`):

1. **Create Feature Directory**:
   ```text
   src/app/features/invoices/
   ├── domain/
   │   ├── models/invoice.model.ts
   │   └── repositories/invoice.repository.ts
   ├── application/
   │   ├── use-cases/get-invoices.use-case.ts
   │   └── state/invoice-state.service.ts
   ├── data/
   │   ├── dto/invoice.dto.ts
   │   ├── mappers/invoice.mapper.ts
   │   ├── datasources/invoice-datasource.interface.ts
   │   ├── datasources/invoice-mock.datasource.ts
   │   ├── datasources/invoice-remote.datasource.ts
   │   └── repositories/invoice-repository.impl.ts
   ├── presentation/
   │   └── invoice-list.component.ts
   ├── invoices.providers.ts
   └── invoices.routes.ts
   ```

2. **Define Pure Domain Entity** in `domain/models/invoice.model.ts`:
   ```typescript
   export interface Invoice {
     readonly id: string;
     readonly invoiceNumber: string;
     readonly amount: number;
     readonly status: 'pending' | 'paid' | 'overdue';
   }
   ```

3. **Declare Repository Contract** in `domain/repositories/invoice.repository.ts`:
   ```typescript
   export abstract class InvoiceRepository {
     abstract list(): Observable<Invoice[]>;
   }
   ```

4. **Implement Datasource & Repository** in `data/`:
   Create DTOs, implement `InvoiceRepositoryImpl` with `InvoiceMapper`.

5. **Expose Providers & Routes**:
   In `invoices.providers.ts`, register `provideInvoicesFeature()`.
   In `app.routes.ts`, add the lazy-loaded feature route:
   ```typescript
   {
     path: 'invoices',
     loadChildren: () => import('./features/invoices/invoices.routes').then(m => m.INVOICES_ROUTES),
   }
   ```

---

## Guide: Registering Repositories & Replacing Mock Data

To point any feature to a real backend:

1. Update `src/environments/environment.ts`:
   ```typescript
   export const environment: Environment = {
     production: false,
     enableMockData: false, // <-- Set to false to use real HTTP endpoints
     apiBaseUrl: 'https://api.yourdomain.com/v1',
     // ...
   };
   ```

2. Ensure the remote datasource URL paths match your backend API contracts.
3. Because the domain layer and UI depend only on `ProjectRepository`, **zero UI components or use cases need to be edited**.

---

## Guide: Security Responsibilities

While the starter kit includes foundational client-side security:
- Bearer token injection via `authInterceptor`
- Sensitive data masking in `LoggerService`
- Client route protection via `authGuard` and `roleGuard`

**Production Security Requires Backend Enforcement**:
1. **Never Store Secrets in Frontend Code**: Frontend environment files are visible in client bundles.
2. **Backend Authentication & JWT Validation**: Client route guards are a UX convenience. Backend endpoints must independently validate and authorize every incoming request.
3. **CORS & CSP**: Configure Content-Security-Policy (CSP) headers and Cross-Origin Resource Sharing (CORS) on the production web server or reverse proxy.
4. **Token Storage**: For high-risk financial or healthcare applications, prefer HttpOnly, Secure, SameSite cookies managed by the backend server over localStorage to prevent XSS exfiltration.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Launches development server on `http://localhost:4200` |
| `npm run build` | Builds optimized application bundle |
| `npm run build -- --configuration production` | Produces production build with hashed assets |
| `npm test` | Runs unit tests once via Vitest |
| `npm run test:watch` | Runs unit tests in interactive watch mode |
| `npm run lint` | Runs TypeScript strict type checking across codebase |
| `npm run format` | Automatically formats all files using Prettier |
| `npm run format:check` | Verifies code format compliance |
