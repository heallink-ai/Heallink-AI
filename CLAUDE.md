# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Heallink Project Guide for Claude

## Project Overview

Heallink is a comprehensive healthcare platform built as a monorepo with multiple interconnected applications:

- **Main User App** (`apps/heallink`): Patient-facing portal for appointments, medical records, and telehealth
- **Admin Panel** (`apps/heallink-admin`): Internal tool for administrators to manage users, providers, and system settings
- **Provider App** (`apps/heallink-providers`): Clinician portal for managing schedules, patient records, and telehealth sessions
- **API** (`apps/api`): NestJS backend providing authentication, user management, and core services
- **AI Engine** (`apps/ai-engine`): FastAPI service for AI-powered voice assistant using LiveKit
- **Avatar Engine** (`apps/avatar-engine`): Real-time 2D avatar lip-sync engine powered by MuseTalk

## Tech Stack

### Frontend (All Next.js Apps)
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+ with custom Neumorphic design system
- **UI Components**: shadcn/ui, lucide-react icons
- **State Management**: React Query (server state), Zustand (global state)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js v5 beta with multiple providers
- **Real-time**: LiveKit for video/audio, WebSocket for messaging
- **Testing**: Vitest (unit tests), Cypress (integration/E2E tests)
- **Data Fetching**: React Query (TanStack Query) - MANDATORY for all API calls

### Backend
- **API (NestJS)**: TypeScript, Mongoose ODM, Passport.js auth, Winston logging
- **AI Engine (FastAPI)**: Python 3.10+, LiveKit Agents, OpenAI, Deepgram, Cartesia
- **Avatar Engine**: Python 3.10+, MuseTalk, PyTorch, LiveKit streaming
- **Database**: MongoDB (primary), Redis (caching/sessions), pgAI (vector embeddings)
- **Infrastructure**: Docker, LocalStack (AWS services), optional Kubernetes

### Key Technologies
- **AI/ML**: LangChain, LangGraph, OpenAI GPT, Deepgram STT, Cartesia TTS
- **Real-time Communication**: LiveKit for WebRTC, Redis pub/sub
- **File Storage**: AWS S3 (LocalStack in dev)
- **Email**: Resend API with Handlebars templates
- **SMS**: Twilio (configured but implementation pending)

## Development Commands

### Root Level (Monorepo)
```bash
# Install dependencies for all workspaces
npm install

# Run all apps in development
npm run dev

# Build all apps
npm run build

# Lint all apps
npm run lint

# Run tests across all apps
npm run test

# Docker development environment
docker-compose up        # Start all services
docker-compose up api    # Start specific service
docker-compose down      # Stop all services
```

### Individual Apps

#### Frontend Apps (heallink, heallink-admin, heallink-providers)
```bash
cd apps/[app-name]
npm run dev              # Start development server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint
npm run test             # Run Vitest unit tests
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Run tests with coverage
npm run cypress:open     # Open Cypress for integration tests
npm run cypress:run      # Run Cypress tests headlessly
```

#### API (NestJS)
```bash
cd apps/api
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start with debugging
npm run build            # Build for production
npm run start:prod       # Start production server
npm run test             # Run unit tests
npm run test:watch       # Run unit tests in watch mode
npm run test:e2e         # Run integration tests
npm run test:cov         # Run tests with coverage
```

#### AI Engine (Python/FastAPI)
```bash
cd apps/ai-engine
python -m venv .venv     # Create virtual environment
source .venv/bin/activate # Activate venv
pip install -r requirements.txt # Install dependencies
uvicorn app:app --reload # Start development server
```

#### Avatar Engine
```bash
cd apps/avatar-engine
uv venv                  # Create virtual environment with uv
source .venv/bin/activate
uv pip install -e .      # Install with dependencies
avatar-engine --dev      # Start development server
```

## Project Structure

```
heallink/
├── apps/                    # Application workspaces
│   ├── api/                # NestJS backend API
│   ├── ai-engine/          # Python AI voice assistant
│   ├── avatar-engine/      # Python 2D avatar engine
│   ├── heallink/           # Main user Next.js app
│   ├── heallink-admin/     # Admin Next.js app
│   └── heallink-providers/ # Provider Next.js app
├── packages/               # Shared packages (future use)
├── scripts/                # Utility scripts
│   └── localstack/        # AWS LocalStack setup
├── logs/                   # Application logs
├── data/                   # MongoDB data (gitignored)
├── docker-compose.yml      # Docker development setup
├── package.json           # Root monorepo configuration
└── tsconfig.json          # Root TypeScript config
```

## Key Architecture Patterns

### 1. Monorepo with npm Workspaces
- Shared dependencies managed at root level
- Individual apps have their own package.json
- TypeScript project references for type safety across packages

### 2. Environment Variables
- Frontend public vars: `NEXT_PUBLIC_*` prefix
- Server-side vars: No prefix, loaded via `.env` files
- Docker networking: Internal service names (e.g., `http://api:3003`)

### 3. Authentication Flow
- NextAuth.js handles frontend auth with multiple providers
- NestJS API validates JWT tokens
- Separate auth flows for users, providers, and admins
- Phone OTP authentication partially implemented

### 4. API Design
- RESTful endpoints with `/api/v1` prefix
- Consistent error responses following RFC7807
- Swagger documentation at `/api/v1/docs`
- Request tracking with UUID headers

### 5. Real-time Features
- LiveKit for video/audio consultations
- AI voice assistant via LiveKit Agents
- Avatar lip-sync streaming to LiveKit rooms
- WebSocket for real-time messaging

## Coding Conventions

### TypeScript/JavaScript
- **Files**: `kebab-case.ts` / `.tsx`
- **React Components**: PascalCase
- **Hooks**: `useCamelCase`
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces/Types**: PascalCase (no `I` prefix)
- **Imports**: Prefer absolute imports with `@` alias

### Python
- **Files**: `snake_case.py`
- **Classes**: PascalCase
- **Functions/Variables**: snake_case
- **Constants**: UPPER_SNAKE_CASE
- **Type hints**: Required for all public APIs

### Git Conventions
- **Branches**: `type/feature-description`
- **Commits**: Conventional Commits format
  - Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`
- **PRs**: Link issues, include description and screenshots

## Testing Requirements

### Backend (NestJS API)
**MANDATORY**: Every new functionality MUST include:
- **Unit Tests**: Test individual services, controllers, guards, etc.
  - Use Jest with NestJS testing utilities
  - Mock external dependencies
  - Test file naming: `*.spec.ts`
  - Minimum coverage: 80%
- **Integration Tests**: Test full request/response cycles
  - Use Supertest for HTTP testing
  - Test with real database connections (test DB)
  - Test file naming: `*.e2e-spec.ts`
  - Location: `test/` directory

Example test structure for a new feature:
```typescript
// user.service.spec.ts (Unit test)
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<Repository<User>>;
  
  beforeEach(() => {
    // Setup mocks and test module
  });
  
  it('should create a user', async () => {
    // Test implementation
  });
});

// users.e2e-spec.ts (Integration test)
describe('Users API (e2e)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    // Setup test app with real DB
  });
  
  it('/users (POST)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);
  });
});
```

### Frontend (Next.js Apps)
**MANDATORY**: Every new feature MUST include:
- **Unit Tests**: Use Vitest for component and hook testing
  - Test file naming: `*.test.ts(x)` or `*.spec.ts(x)`
  - Test React components with React Testing Library
  - Mock API calls and external dependencies
  - Minimum coverage: 80%
- **Integration Tests**: Use Cypress for E2E testing
  - Test user flows and interactions
  - Test file location: `cypress/e2e/`
  - Use data-testid attributes for reliable element selection

## Frontend Architecture Pattern

### Feature Folder Structure
**MANDATORY**: All features in client apps MUST follow this structure:

```
apps/[app-name]/
└── app/
    └── features/
        └── [feature-name]/
            ├── components/           # Presentational components
            │   ├── FeatureForm.tsx
            │   ├── FeatureList.tsx
            │   └── FeatureCard.tsx
            ├── containers/           # Container components
            │   ├── FeatureContainer.tsx
            │   └── FeatureEditContainer.tsx
            ├── hooks/                # Custom React hooks
            │   ├── useFeatureData.ts
            │   └── useFeatureActions.ts
            ├── services/             # API calls and data services
            │   ├── feature.service.ts
            │   └── feature.types.ts
            ├── utils/                # Feature-specific utilities
            │   └── feature.utils.ts
            ├── types/                # TypeScript types/interfaces
            │   └── feature.types.ts
            └── index.ts              # Public exports
```

### Component Pattern Rules:

1. **Presentation Components** (`components/`):
   - Pure, stateless components
   - Receive all data via props
   - No direct API calls
   - Focus on UI rendering
   - Include Storybook stories when applicable

2. **Container Components** (`containers/`):
   - Manage state and data fetching
   - Use React Query hooks
   - Handle business logic
   - Pass data to presentation components
   - Connect to global state if needed

3. **Custom Hooks** (`hooks/`):
   - Extract reusable logic
   - MUST use React Query for all API calls
   - Handle loading, error, and success states
   - Example:
   ```typescript
   export const usePatients = () => {
     return useQuery({
       queryKey: ['patients'],
       queryFn: patientService.getAll,
       staleTime: 5 * 60 * 1000, // 5 minutes
     });
   };
   ```

4. **Services** (`services/`):
   - Define API endpoints
   - Return promises for React Query
   - Handle request/response transformation
   - NEVER use fetch or axios directly in components
   - Example:
   ```typescript
   export const patientService = {
     getAll: async (): Promise<Patient[]> => {
       const response = await apiClient.get('/patients');
       return response.data;
     },
     getById: async (id: string): Promise<Patient> => {
       const response = await apiClient.get(`/patients/${id}`);
       return response.data;
     },
   };
   ```

### React Query Requirements:
**MANDATORY**: All data fetching MUST use React Query:
- Use `useQuery` for GET requests
- Use `useMutation` for POST/PUT/DELETE
- Configure proper cache keys
- Set appropriate `staleTime` and `cacheTime`
- Handle loading and error states
- Example:
```typescript
// In a container component
const { data, isLoading, error } = usePatients();
const createPatientMutation = useMutation({
  mutationFn: patientService.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['patients']);
  },
});
```

### Page Implementation:
Pages should be thin and only import containers:
```typescript
// app/patients/page.tsx
import { PatientListContainer } from '@/features/patients';

export default function PatientsPage() {
  return <PatientListContainer />;
}
```

## Docker Development

### Services Available
- **heallink**: http://localhost:3000
- **heallink-admin**: http://localhost:3001 (commented out)
- **heallink-providers**: http://localhost:3002 (commented out)
- **api**: http://localhost:3003
- **ai-engine**: http://localhost:8000 (commented out)
- **avatar-engine**: http://localhost:8080
- **ai-agent**: http://localhost:8001
- **mongodb**: mongodb://localhost:27018
- **localstack**: http://localhost:4566 (AWS services)

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose build [service-name]

# Clean everything
docker-compose down -v --rmi all --remove-orphans
```

## Current Implementation Status

### ✅ Implemented
- Basic authentication with NextAuth.js
- User registration and login (email/phone)
- MongoDB integration with Mongoose
- Docker development environment
- AI voice assistant with LiveKit
- Avatar engine with MuseTalk integration
- Admin user management
- Provider authentication system
- Email service with templates
- LocalStack for AWS services
- Logging and monitoring

### 🚧 In Progress
- Phone OTP verification
- Social login providers
- Complete provider dashboard
- Patient appointment scheduling
- Medical records management
- Video consultations
- Real-time messaging

### 📋 TODO
- Pharmacy integration service
- Payment processing (Stripe)
- Advanced search with Elasticsearch
- Comprehensive testing coverage
- Production deployment configs
- HIPAA compliance features
- Internationalization (i18n)

## Important Notes

1. **Security**: JWT secrets and API keys must be properly configured in `.env` files
2. **Database**: MongoDB runs on port 27018 (not default 27017) in Docker
3. **CORS**: Configure allowed origins in API for production
4. **Rate Limiting**: API has 100 req/min limit per IP
5. **File Uploads**: Avatar uploads stored in `uploads/avatars/`
6. **Logs**: Centralized logging in `logs/` directory
7. **Models**: AI/ML models cached in Docker volumes

## Quick Start for New Features

### Adding a New API Endpoint (NestJS):
1. Create module in `apps/api/src/modules/[module-name]/`
2. Add controller, service, and DTOs
3. **Write unit tests** for service methods (`*.spec.ts`)
4. **Write integration tests** for endpoints (`*.e2e-spec.ts`)
5. Update app.module.ts imports
6. Document with Swagger decorators
7. Run tests: `npm run test` and `npm run test:e2e`

### Adding a New Frontend Feature:
1. Create feature folder: `apps/[app-name]/app/features/[feature-name]/`
2. Structure components following the pattern:
   ```
   features/[feature-name]/
   ├── components/     # Presentational components
   ├── containers/     # Container components with data fetching
   ├── hooks/          # Custom hooks using React Query
   ├── services/       # API service functions
   ├── types/          # TypeScript interfaces
   └── index.ts        # Public exports
   ```
3. **Use React Query** for all data fetching (no direct fetch/axios)
4. **Write Vitest tests** for components and hooks
5. **Write Cypress tests** for user flows
6. Import container in the page file
7. Run tests: `npm run test` and `npm run cypress:open`

### Adding Shared Components:
- Future: Create in `packages/ui/`
- Currently: Add to specific app's `components/` folder
- Follow the established design system
- Include unit tests and Storybook stories

## Troubleshooting

1. **Port conflicts**: Check if ports 3000-3003, 8000-8001, 8080, 27018 are free
2. **Docker issues**: Run `docker-compose down -v` and rebuild
3. **Module not found**: Check npm workspaces are properly linked
4. **MongoDB connection**: Ensure MongoDB is running and accessible
5. **Environment variables**: Verify `.env` files exist and are properly formatted

## Design System

- **Colors**: Purple Heart (#5a2dcf), Royal Blue (#2066e4), and gradients
- **Typography**: "Mona Sans" font family with system fallbacks
- **Style**: Neumorphic design with soft shadows and gradients
- **Icons**: Lucide React icon set
- **Spacing**: Tailwind CSS default scale
- **Animations**: Framer Motion for complex animations

This guide should help you understand the project structure and get productive quickly. Always refer to individual README files in each app directory for specific details.