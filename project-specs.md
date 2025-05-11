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
/heallink-provider # Next.js provider portal
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

- Registration & profile management
- Appointment search & booking
- Secure messaging with providers
- Billing & payments integration (Stripe)
- Medical records viewer (PDF render)
- Notifications (email, SMS, push)

### 8.3 Provider Portal

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

**_End of Specification_**
