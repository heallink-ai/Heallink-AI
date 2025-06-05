# Heallink Project Specification

## 1. Project Overview

**Heallink** is a comprehensive healthcare platform comprising three main interfaces:

- **Admin Panel**: Internal tool for administrators to manage users, providers, system settings, and analytics.
- **User App**: Patient-facing portal for appointment booking, medical records, billing, and communication.
- **Provider App**: Clinician portal for managing schedules, patient records, telehealth sessions, and documentation.

This document defines the architecture, technologies, libraries, conventions, and feature requirements to guide development and facilitate Cursor AI–powered code generation.

---

## 2. Goals & Objectives

1. **Scalability**: Architect for high availability and horizontal scaling.
2. **Maintainability**: Clean codebase with strict conventions, modular design, and comprehensive tests.
3. **Security & Compliance**: OWASP best practices, HIPAA/GDPR readiness, secure authentication.
4. **Developer Experience**: TypeScript-first, VS Code/Cursor AI ergonomics, automated linting, and CI/CD.
5. **User Experience**: Responsive, accessible (WCAG AA), internationalized.

---

## 3. System Architecture

```
                          +----------------+           +----------------+
                          |  FastAPI SRV   |           |   NestJS API   |
                          | (Python, 3.10+)|           | (Node.js, TS)  |
                          +--------+-------+           +--------+-------+
                                   |                            |
         +-------------+    API GW/Proxy    +-------------+      |
         |  Admin App  | <-----------------> |  Auth SRV   |      |
         | Next.js/TS  |                      +-------------+      |
         +-------------+                                          |
                                                                   v
       +-------------+    +-------------+    +-------------+    +-----------+    +--------------------+
       |  User App   |    | Provider App|    | MongoDB     |    |  Redis    |    | pgAI Vector DB      |
       | Next.js/TS  |    | Next.js/TS  |    +-------------+    +-----------+    | (Vector Store)      |
       +-------------+    +-------------+                                            +--------------------+
```

- **API Gateway / Proxy**: NGINX or NestJS gateway for routing and rate-limiting.
- **Authentication Service**: Dedicated microservice (NestJS) handling JWT issuance, refresh tokens, social OAuth.
- **Core API**: Business logic in NestJS (TypeScript).
- **Specialized Services**: FastAPI (Python) for AI/ML endpoints (e.g., chatbots, recommendations).
- **Datastore**: MongoDB primary DB; Redis for caching, sessions, and pub/sub
- **Vector Database**: pgAI extension for vector embeddings, integrated via LangChain & LangGraph.
- **Deployment**: Docker containers orchestrated by Kubernetes (EKS/GKE).
- **Pharmacy Integration Service**: Dedicated microservice communicating with third-party pharmacy APIs to fetch nearest locations, pricing, and stock levels.

---

## 4. Technical Stack

### 4.1 Frontend (All Apps)

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5+
- **UI Library**: Tailwind CSS, shadcn/ui components, lucide-react icons
- **State Management**: React Query for server state; Zustand for global state
- **Forms & Validation**: React Hook Form + Zod
- **i18n**: next-i18next
- **Accessibility**: headlessui/react, aria attributes, Lighthouse audits
- **HTTP Client**: Axios
- **Authentication (Frontend)**: NextAuth.js with providers for Google, Facebook, Apple, Email, and Phone
- **Testing**:

  - Unit: Jest + React Testing Library
  - E2E: Cypress

- **Linting & Formatting**: ESLint (airbnb + plugin\:react-hooks), Prettier
- **Bundler**: Webpack (built-in with Next.js)
- **Dev Tools**: VS Code, Cursor AI extension, Storybook for components

#### 4.1.1 Directory Structure (Monorepo)

Monorepo managed via npm Workspaces with TypeScript project references. The root `package.json` includes:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

And the root `tsconfig.json` uses `references` to each package for fast, isolated builds and consistent type-checking.

```

```

/apps
/heallink-admin # Next.js admin panel
/heallink # Next.js user portal
/heallink-providers # Next.js provider portal
/libs
/ui # Shared React components
/hooks # Shared React hooks
/utils # Shared utilities
/config # Shared config (e.g., env schemas)

```

---

### 4.2 Backend

#### 4.2.1 Primary API (NestJS)

- **Framework**: NestJS v10+, using TypeScript
- **Architecture**: Modular with Domain-Driven Design
- **ORM**: Mongoose (MongoDB ODM)
- **Authentication**: Passport.js strategies (JWT, OAuth2)
- **Validation**: class-validator + class-transformer
- **Logging**: Winston + NestJS logger
- **Configuration**: @nestjs/config with Joi schema validation
- **API Docs**: Swagger (OpenAPI 3.0)
- **Testing**: Jest (unit + e2e)
- **Background Jobs**: BullMQ (Redis)
- **Rate Limiting & Throttling**: @nestjs/throttler
- **Caching**: Redis via cache-manager

##### 4.2.1.1 Directory Structure

```

/src
/modules
/auth
/users
/providers
/appointments
/billing
/notifications
/common
/filters
/guards
/interceptors
/pipes
/config
/main.ts

````

---

#### 4.2.2 Specialized Services (FastAPI)

- **Framework**: FastAPI (Python 3.10+)
- **Data Models**: Pydantic v2
- **Database**: MongoDB via Motor or MongoEngine
- **Auth**: OAuth2PasswordBearer + JWT
- **Async**: Uvicorn with Gunicorn workers
- **API Docs**: Automatic Swagger UI
- **Testing**: Pytest + HTTPX
- **Dependencies**: Poetry or pip-tools
- **Vector Store**: pgAI for embedding storage
- **AI Frameworks**: LangChain and LangGraph for chain orchestration and graph-based queries

---

### 4.3 Database & Persistence

- **Primary DB**: MongoDB (Atlas or self-hosted)
- **Vector DB**: pgAI (PostgreSQL AI extension) for vector embeddings
- **ODM**: Mongoose (Node.js) / Motor or MongoEngine (Python)
- **Caching**: Redis 7+ for sessions, rate limits, pub/sub
- **Search**: Elasticsearch or MeiliSearch for full-text search
- **Storage**: AWS S3 for media/documents

---

### 4.4 Infrastructure & DevOps

### 4.5 Pharmacy Integration Service

- **Framework**: NestJS (or FastAPI for supplement) microservice, TypeScript/Python
- **Responsibilities**:
  - Connect to pharmacy networks (e.g., SureScripts, 1mg, local chains) via REST/SOAP APIs
  - Retrieve geolocation-based pharmacy data
  - Aggregate and normalize medication price and availability
  - Cache frequent queries in Redis, fallback to on-demand
  - Authenticate with partner APIs and manage rate limits
- **Database**: MongoDB or PostgreSQL for partner metadata; Redis for real-time cache
- **Security**: OAuth2 or API Key management for each partner
- **Testing**: Contract tests against sandbox APIs
- **Monitoring**: Track API latency, error rates, partner SLA compliance

---

- **Containerization**: Docker, Docker Compose for local dev
- **Orchestration**: Kubernetes (EKS/GKE) with Helm charts
- **CI/CD**: GitHub Actions pipelines
  - Lint → Test → Build → Deploy
- **Monitoring**: Prometheus + Grafana, Sentry for error tracking
- **Secrets Management**: AWS Secrets Manager or Vault
- **Load Balancing**: AWS ALB / NGINX Ingress
- **CDN**: CloudFront / Vercel edge

---

## 5. API Design & Contracts

- **Style**: RESTful, JSON API
- **Versioning**: URI versioning (`/api/v1/...`)
- **Error Handling**: Problem Details RFC7807
- **Example OpenAPI YAML snippet**:
  ```yaml
  /appointments:
    get:
      summary: List appointments
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Appointment'
````

---

## 6. Coding Conventions & Quality

A unified style across all codebases ensures readability, maintainability, and seamless collaboration. Below are detailed conventions covering naming, formatting, structure, and workflows.

### 6.1 General Editor & Formatting

- **EditorConfig**: Include a `.editorconfig` at repo root:

  ```ini
  root = true
  [*]
  indent_style = space
  indent_size = 2
  charset = utf-8
  end_of_line = lf
  insert_final_newline = true
  trim_trailing_whitespace = true
  max_line_length = 100
  ```

- **Line Length**: 100 characters. Break before operators.
- **Indentation**: 2 spaces for JS/TS/Python; 2 spaces for JSON/YAML.
- **Encoding & EOL**: UTF-8 and LF everywhere.
- **Trailing Whitespace**: Disallowed.
- **Newline at EOF**: Required.

### 6.2 TypeScript (Frontend & NestJS)

#### 6.2.1 File & Directory Naming

- **Files**: `kebab-case.ts` / `.tsx` (e.g., `user-profile.tsx`).
- **Directories**: `kebab-case` (e.g., `/user-settings/`).
- **Barrel Files**: Use `index.ts` to re-export module API.

#### 6.2.2 Identifiers

| Entity           | Naming Pattern                                                      |
| ---------------- | ------------------------------------------------------------------- |
| React Components | PascalCase                                                          |
| Hooks            | `useCamelCase`                                                      |
| Variables/Funcs  | camelCase                                                           |
| Constants        | UPPER_SNAKE_CASE                                                    |
| Enums            | PascalCase                                                          |
| Interfaces/Types | PascalCase (_no_ `I` prefix; suffix `Props`/`Params` when relevant) |
| Generics         | Single uppercase: `T`, `U`                                          |

#### 6.2.3 Code Style

- **Strict Mode**: `strict: true` in `tsconfig.json`.
- **No `any`**: Disallow except for well-documented edge cases.
- **Explicit Returns**: All public functions/methods must have explicit return types.
- **Imports**: Absolute imports using `@` alias configured in `tsconfig.json` `paths` over relative when deeper than two levels.
- **Semicolons**: Required.
- **Trailing Commas**: Always in multiline literals.
- **Spacing**: One space inside braces: `{ foo }`.

#### 6.2.4 Next.js Specific

- **Version**: Next.js 15+ (App Router and Route Handlers)
- **App Router**: File and folder structure under `/app` maps directly to URL segments. Avoid dynamic routing conflicts.
- **API Routes**: Use the `/app/api` directory with `route.ts` (or `.js`) files exporting HTTP method handlers and middleware.
- **Data Fetching**: Leverage React Server Components and Client Components; use `fetch` with `next/cache` options for optimized caching.
- **Layout Files**: Place `layout.tsx` in each route segment for nested layouts.
- **Env Variables**: Client-exposed variables must start with `NEXT_PUBLIC_`; all other env vars are server-side only and should not use the `NEXT_PUBLIC_` prefix.

### 6.2.5 NestJS Specific NestJS Specific

- **Modules**: One module per domain (`AuthModule`, `UsersModule`).
- **Controllers/Services**: Suffix class names `Controller` / `Service`.
- **DTOs**: Use `CreateUserDto`, `UpdateProfileDto` and validate via `class-validator`.
- **Guards/Interceptors**: Suffix `Guard`, `Interceptor`.
- **Exception Filters**: Suffix `ExceptionFilter`.

### 6.3 Python (FastAPI & Services)

- **Formatter**: Black (line length 100).
- **Linter**: Flake8 + isort for imports.
- **File Names**: `snake_case.py`.
- **Variables & Functions**: `snake_case`.
- **Classes**: PascalCase.
- **Constants**: UPPER_SNAKE_CASE.
- **Type Hints**: Mandatory on all public APIs.
- **Docstrings**: Google style with `Args`, `Returns`, `Raises`.
- **Pydantic Models**: PascalCase with field aliases in `snake_case`.

### 6.4 Git & Version Control

- **Branches**: `type/feature-description` (e.g., `feat/auth-oauth-facebook`).
- **Commit Messages**: Conventional Commits v1.0.0:

  ```
  <type>(<scope>): <short description>

  <optional body>

  <optional footer>
  ```

  - **Types**: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`

- **Pull Requests**:

  - Title follows commit style.
  - Link related issue(s).
  - Include a description, testing instructions, and screenshots if UI.

- **Tagging & Releases**: Semantic versioning (`vMAJOR.MINOR.PATCH`).

### 6.5 Testing & Test Naming

- **Unit Tests**: Filename `*.spec.ts` / `test_*.py`.
- **Integration Tests**: Directory `/tests/integration/`.
- **E2E**: `/tests/e2e/` or Cypress conventions.
- **Describe/Context Blocks**: Use clear, domain language.
- **Mocking**: Use test doubles strategically; avoid integration tests for pure functions.
- **Coverage**: >80% per service; review uncovered lines weekly.

### 6.6 Documentation & Comments

- **Inline Comments**: Only to explain _why_, not _what_.
- **JSDoc/TSDoc**: All exported functions, classes, and public methods:

  ```ts
  /**
   * Fetches user profile.
   * @param userId - Unique identifier for the user
   * @returns Promise<UserProfile>
   */
  ```

- **Doc Generation**: Keep `docs/` folder with generated API specs and architecture diagrams.
- **README.md**: Each package must include setup, usage, and environment variable references.

### 6.7 Environment Variables

- **Naming**: UPPER_SNAKE_CASE (e.g., `DATABASE_URL`, `REDIS_HOST`).
- **Frontend Public**: Prefix with `NEXT_PUBLIC_`.
- **Secrets**: Never commit; use `.env.local` and secret managers.
- **Validation**: Joi/Zod schemas at startup.

### 6.8 Logging & Error Handling

- **Logging**: Structured logs with JSON payloads; include `timestamp`, `level`, `service`, and `requestId`.
- **Error Messages**: User-facing vs internal. Internal errors include stack traces; external sanitize messages.
- **Exception Flow**: Catch at controller boundary; wrap unknown errors in generic 500 response.

---

## 7. Security & Compliance

Security & Compliance

- **Authentication**: OAuth2, JWT, optional 2FA
- **Authorization**: RBAC roles (Admin, Provider, User)
- **Data Encryption**: TLS in transit, AES-256 at rest
- **Vulnerability Scans**: Snyk or GitHub Security Alerts
- **Audit Logging**: Immutable logs in DynamoDB or CloudWatch
- **Compliance**: GDPR data deletion, HIPAA audit trails

---

## 8. Key Features

### 8.1 Admin Panel

- User & provider management
- System metrics & analytics (Chart.js or recharts)
- Configuration & feature flags
- Audit logs viewer

### 8.2 User Portal

To ensure a seamless patient experience, the User Portal is organized into the following Epics and associated User Stories & Tasks. Each Epic encapsulates a major area of functionality.

#### Epic 8.2.1: User Onboarding & Profile Management

- **Story 8.2.1.1**: As a new user, I want to register via email/phone or social login so I can access the portal.

  - Task: Design registration form with fields for name, contact, password
  - Task: Integrate NextAuth.js Email, Phone, Google, Facebook, Apple providers
  - Task: Implement email/phone verification workflow

- **Story 8.2.1.2**: As a user, I want to complete my profile (personal details, insurance) so providers have my information.

  - Task: Create Profile component with form (React Hook Form + Zod)
  - Task: Persist profile data to MongoDB via API
  - Task: Add avatar upload (AWS S3 integration)

- **Story 8.2.1.3**: As a user, I want to manage account settings (password reset, 2FA) so I can secure my account.

  - Task: Build Settings page with sections for password, 2FA toggles
  - Task: Integrate Auth service endpoints for password reset and 2FA
  - Task: Add UI feedback and error handling

#### Epic 8.2.2: Appointment Scheduling & Calendar

- **Story 8.2.2.1**: As a user, I want to search for providers by specialty, location, and availability.

  - Task: Design search filters component
  - Task: Integrate search API with Elastic/MeiliSearch
  - Task: Display provider list with pagination and map view

- **Story 8.2.2.2**: As a user, I want to view provider calendars and select available slots.

  - Task: Build interactive calendar component using React-Calendar or custom UI
  - Task: Fetch and render availability from API
  - Task: Implement slot selection and validation

- **Story 8.2.2.3**: As a user, I want to confirm and reschedule appointments.

  - Task: Create confirmation modal with details summary
  - Task: Integrate appointment creation and update endpoints
  - Task: Send email/SMS confirmation via Notifications service

#### Epic 8.2.3: Medical Records & Documents

- **Story 8.2.3.1**: As a user, I want to view my medical records (lab results, prescriptions).

  - Task: Build Records dashboard with filtering and pagination
  - Task: Render PDFs inline using `<object>` or PDF.js
  - Task: Fetch records from Core API

- **Story 8.2.3.2**: As a user, I want to download or share my records securely.

  - Task: Add download buttons to each record
  - Task: Generate signed S3 URLs
  - Task: Audit access in logs

#### Epic 8.2.4: Billing & Payments

- **Story 8.2.4.1**: As a user, I want to view my invoices and payment history.

  - Task: Design Invoices list UI
  - Task: Integrate with Billing API (Stripe)
  - Task: Display status, amount, date, download links

- **Story 8.2.4.2**: As a user, I want to pay my bills using card or saved payment method.

  - Task: Implement Stripe Checkout or Elements flow
  - Task: Securely store payment methods (PCI compliance)
  - Task: Handle success/failure callbacks

#### Epic 8.2.5: Communication & Notifications

- **Story 8.2.5.1**: As a user, I want to chat securely with my provider.

  - Task: Build messaging UI (React Query + WebSocket)
  - Task: Integrate with Notifications microservice for real-time updates
  - Task: Persist chat history in MongoDB

- **Story 8.2.5.2**: As a user, I want to receive email, SMS, or push notifications for appointments and messages.

  - Task: Create Notification Preferences page
  - Task: Integrate with Redis pub/sub and Notifications API
  - Task: Implement push notifications via service worker

#### Epic 8.2.6: Telehealth & Video Visits

- **Story 8.2.6.1**: As a user, I want to start a video consultation with my provider.

  - Task: Integrate Daily.co or WebRTC SDK
  - Task: Build VideoCall component with mute/camera controls
  - Task: Securely generate meeting tokens via API

- **Story 8.2.6.2**: As a user, I want to view upcoming telehealth session details.

  - Task: Add Telehealth tab in Appointments section
  - Task: Show join links, instructions, pre-call checklist

#### Epic 8.2.7: Health & Wellness Tracking

- **Story 8.2.7.1**: As a user, I want to log vitals (blood pressure, glucose) daily.

  - Task: Create Vitals Log form (Recharts for trends)
  - Task: Store logs in vector DB via pgAI for analytics
  - Task: Visualize trends in Dashboard widget

- **Story 8.2.7.2**: As a user, I want AI-driven insights from my health data.

  - Task: Implement LangChain pipeline to analyze vitals
  - Task: Display suggestions in a chat-like interface
  - Task: Enable follow-up actions (schedule appointment)

#### Epic 8.2.8: Administer Emergency Access

- **Story 8.2.8.1**: As a user, I want to designate emergency contacts.

  - Task: Build Emergency Contacts UI
  - Task: Manage contact permissions for record access

- **Story 8.2.8.2**: As a user, I want to share my emergency key for urgent access.

  - Task: Generate one-time access tokens
  - Task: Audit token usage

### 8.3 Provider Portal

- Schedule management calendar
- Patient record updates & notes
- Video consultations (WebRTC via Daily-co)
- Prescription & treatment plans
- Invoices & payout dashboard

### 8.4 Pharmacy Integration

- **Pharmacy Discovery**: Users can search for and view nearest pharmacies based on GPS or entered address

- **Price Comparison**: Real-time comparison of medication prices across partnered pharmacies

- **Stock Availability**: Display current inventory status for prescribed medications

- **Ordering & Fulfillment**: Initiate refill or new prescription orders; choose pickup or delivery

- **Prescription Sync**: Automatic sync of new prescriptions from Provider App to Pharmacy Integration Service

- **Notifications**: Notify users when orders are ready for pickup, out for delivery, or if substitutions are needed

- **Admin Oversight**: In Admin Panel, manage pharmacy partnerships, view performance metrics, and SLA dashboards

- Schedule management calendar

- Patient record updates & notes

- Video consultations (WebRTC via Daily.co)

- Prescription & treatment plans

- Invoices & payout dashboard

---

## 9. Testing Strategy

- **Unit Tests**: Jest (TS), Pytest (Python)
- **Integration**: Supertest with NestJS, HTTPX for FastAPI
- **E2E**: Cypress across frontends
- **Coverage**: ≥ 80% per service

---

## 10. Cursor AI Integration Guidelines

To enable Cursor AI to generate consistent code:

- **Doc Comments**: JSDoc/TSDoc for all public functions, classes, and methods
- **API Contracts**: Keep `openapi.json` in repo root for schema-driven development
- **Schema-first**: Use Zod/Pydantic schemas as single source of truth
- **Examples**: Include `examples/` folder with sample payloads
- **Templates**: Standard Next.js and NestJS templates in `/tools/templates`
- **Naming**: CamelCase for TS, snake_case for Python variables
- **Issue Tags**: Use `cursor:` prefix for tasks intended for AI code generation

---

Color codes:
/_ CSS HEX _/
--biloba-flower: #bda8e5; (https://imagecolorpicker.com/color-code/bda8e5)
--purple-heart: #5a2dcf; (https://imagecolorpicker.com/color-code/5a2dcf)
--royal-blue: #2066e4; (https://imagecolorpicker.com/color-code/2066e4)
--royal-blue: #2c5cde; (https://imagecolorpicker.com/color-code/2c5cde)
--royal-blue: #3253dc; (https://imagecolorpicker.com/color-code/3253dc)
--purple-heart: #7730ca; (https://imagecolorpicker.com/color-code/7730ca)
--royal-blue: #3c4cdb; (https://imagecolorpicker.com/color-code/3c4cdb)
--royal-blue: #4144dc;(https://imagecolorpicker.com/color-code/4144dc)
--portage: #9aa5ec; (https://imagecolorpicker.com/color-code/9aa5ec)
--havelock-blue: #6578e4; (https://imagecolorpicker.com/color-code/6578e4)

/_ SCSS HEX _/
$biloba-flower: #bda8e5;
$purple-heart: #5a2dcf;
$royal-blue: #2066e4;
$royal-blue: #2c5cde;
$royal-blue: #3253dc;
$purple-heart: #7730ca;
$royal-blue: #3c4cdb;
$royal-blue: #4144dc;
$portage: #9aa5ec;
$havelock-blue: #6578e4;

/_ SCSS RGB _/
--biloba-flower: rgba(189,168,229,1);
--purple-heart: rgba(90,45,207,1);
--royal-blue: rgba(32,102,228,1);
--royal-blue: rgba(44,92,222,1);
--royal-blue: rgba(50,83,220,1);
--purple-heart: rgba(119,48,202,1);
--royal-blue: rgba(60,76,219,1);
--royal-blue: rgba(65,68,220,1);
--portage: rgba(154,165,236,1);
--havelock-blue: rgba(101,120,228,1);

Font Family:

font-family: "Mona Sans", MonaSansFallback, -apple-system, "system-ui", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
Source:

**_End of Specification_**
