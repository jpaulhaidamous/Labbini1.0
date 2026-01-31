# Labbini Codebase Guide for AI Agents

## Quick Overview

**Labbini** is a Lebanese freelance & services marketplace with a **monorepo architecture** (pnpm workspaces):
- **Backend**: NestJS + TypeScript + Prisma ORM + PostgreSQL 15
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui
- **i18n**: Full Arabic (RTL) + English bilingual support using `next-intl`
- **Real-time**: Socket.io + Redis caching
- **Authentication**: JWT + Passport strategies

## Architecture & Key Components

### Backend Layering (NestJS)
Each feature has a consistent 3-layer structure:
1. **Module** (`*.module.ts`): Imports dependencies, declares controllers/providers, exports services
2. **Controller** (`*.controller.ts`): HTTP endpoints using decorators (`@Post()`, `@Get()`, etc.)
3. **Service** (`*.service.ts`): Business logic, Prisma queries, validation

**Key Modules:**
- `auth/`: JWT strategy, guards (`JwtAuthGuard`, `RolesGuard`), decorators (`@Public()`, `@CurrentUser()`, `@Roles()`)
- `jobs/`: Job posting, filtering by category/type; includes budget validation (FIXED/RANGE/HOURLY)
- `proposals/`, `contracts/`, `payments/`: Linked by jobId and contractId relationships
- `reviews/`: Client/freelancer bidirectional ratings
- `profiles/`: User portfolio, skills, verification levels (LEVEL_0 through LEVEL_3)

**Example pattern** ([jobs.service.ts](apps/backend/src/jobs/jobs.service.ts)):
- Verify user role/status before mutations
- Validate DTOs with `class-validator` decorators (`@IsString()`, `@IsEmail()`, `@IsEnum()`, etc.)
- Return typed responses with related data via Prisma `include`
- Throw `ForbiddenException`, `BadRequestException`, `NotFoundException`

### Frontend Organization (Next.js)
- **App Router**: `app/[locale]/(auth|public)/` for locale-based routing
- **Components**: Shadcn/ui primitives in `components/ui/`, feature components in `components/auth/`, `components/layout/`
- **API Client**: Axios instance in [lib/api/client.ts](apps/frontend/lib/api/client.ts) with request/response interceptors for token refresh
- **State**: Zustand stores (`lib/stores/auth.store.ts`)
- **i18n**: Use `next-intl` hooks; layout sets `dir="rtl"` for Arabic

### Database Schema (Prisma)
Key enums define the domain model:
- **UserRole**: `CLIENT`, `FREELANCER`, `ADMIN`
- **JobType**: `FIXED`, `HOURLY`, `QUICK` (pricing models)
- **JobStatus**: `DRAFT` → `OPEN` → `IN_PROGRESS` → `COMPLETED` | `CANCELLED`
- **ProposalStatus**: `PENDING` → `SHORTLISTED`/`REJECTED`/`WITHDRAWN` → `ACCEPTED`
- **ContractStatus**: `PENDING`, `ACTIVE`, `COMPLETED`, `DISPUTED`, `CANCELLED`
- **VerificationLevel**: Escalating trust tiers (email → phone → ID → premium)

Database runs in Docker: PostgreSQL 15 + Redis 7 (see [docker-compose.yml](docker/docker-compose.yml)).

## Developer Workflows

### Startup (First Time)
```bash
pnpm install
pnpm docker:up           # Start PostgreSQL + Redis
cd apps/backend && cp .env.example .env  # Configure DB_URL, JWT_SECRET, etc.
pnpm db:migrate
pnpm db:seed
cd ../frontend && cp .env.example .env   # Set NEXT_PUBLIC_API_URL=http://localhost:3001/api
cd ../..
pnpm dev                 # Runs both apps concurrently
```

### Development
- **Both**: `pnpm dev` (concurrent)
- **Backend only**: `pnpm dev:backend` (watch mode with `nest start --watch`)
- **Frontend only**: `pnpm dev:frontend` (Next.js dev server)
- **Database**:
  - `pnpm db:migrate` – Run pending Prisma migrations
  - `pnpm db:seed` – Load seed data ([seed.ts](apps/backend/prisma/seed.ts))
  - `pnpm db:studio` – Open Prisma Studio GUI

### Testing & Linting
- `pnpm test` (backend Jest + frontend tests)
- `pnpm test:backend` / `pnpm test:frontend`
- `pnpm lint` (ESLint fixes both apps)
- `pnpm test:cov` – Coverage report

### Building
- `pnpm build` (both)
- `pnpm build:backend` / `pnpm build:frontend` (individual)
- **Backend**: `nest build` outputs to `dist/`
- **Frontend**: `next build` outputs to `.next/`

## Conventions & Patterns

### Backend: NestJS Module Structure
When adding a new feature (e.g., `messaging`):
1. Create `src/messaging/` folder with `*.module.ts`, `*.controller.ts`, `*.service.ts`
2. Add `dto/` subfolder with `create-message.dto.ts`, `update-message.dto.ts`
3. Use DTOs with `class-validator` decorators for auto-validation
4. Export service from module; import module in [app.module.ts](apps/backend/src/app.module.ts)
5. Controllers use `@UseGuards(JwtAuthGuard)` by default; mark public routes with `@Public()`
6. Use `@Roles('CLIENT')` or `@Roles('FREELANCER')` to restrict endpoints
7. Inject `PrismaService` into services for all DB queries

**Example** (jobs module flow):
```typescript
// jobs.controller.ts
@Post()
@Roles('CLIENT')
async create(@CurrentUser('userId') userId: string, @Body() dto: CreateJobDto) {
  return this.jobsService.create(userId, dto);
}

// jobs.service.ts
async create(clientId: string, dto: CreateJobDto) {
  const user = await this.prisma.user.findUnique({ where: { id: clientId } });
  if (user.role !== 'CLIENT') throw new ForbiddenException('...');
  return this.prisma.job.create({ data: { ...dto, clientId } });
}

// dto/create-job.dto.ts
export class CreateJobDto {
  @IsString() title: string;
  @IsEnum(JobType) jobType: JobType;
  @IsNumber() budgetMin?: number;
}
```

### Frontend: Component & Page Patterns
- **Server Components** (default in App Router): Fetch at build/request time
- **Client Components**: Use `'use client'` directive for Zustand stores, hooks
- **API Calls**: Use axios instance from [lib/api/client.ts](apps/frontend/lib/api/client.ts); token automatically injected
- **Forms**: React Hook Form + Zod/class-validator for validation
- **i18n**: Wrap strings in `useTranslations()` hook; layout handles RTL

### Authentication Flow
1. **Backend** ([auth.service.ts](apps/backend/src/auth/auth.service.ts)):
   - Sign up: Hash password with bcryptjs, store user, return tokens
   - Login: Verify credentials, sign JWT (15m expiry default)
   - Refresh: Issue new token if valid refresh token provided
   
2. **Frontend** ([lib/api/client.ts](apps/frontend/lib/api/client.ts)):
   - Request interceptor: Attach `Authorization: Bearer <token>` header
   - Response interceptor: On 401, call refresh endpoint; retry original request
   - Store token in `localStorage.accessToken`

### Validation & Error Handling
- **DTOs**: Use `class-validator` (`@IsString()`, `@IsEmail()`, `@IsOptional()`, `@IsEnum()`)
- **Services**: Throw `ForbiddenException` (role/ownership), `BadRequestException` (invalid data), `NotFoundException` (missing resource)
- **Controllers**: NestJS auto-catches exceptions, returns proper HTTP status codes

### Prisma Patterns
- Always define **relations** with `@relation(name: '...')` for bidirectional queries
- Use **`include`** to fetch related data: `prisma.job.create({ data: {...}, include: { category: true, client: {...} } })`
- Use **transactions** for multi-step operations: `prisma.$transaction([...])`
- Enums in schema mirror TypeScript enums for type safety

## Integration Points & External Dependencies

### Real-time (Socket.io, Redis)
- Backend registers WebSocket handlers in modules
- Redis caches session/messaging state
- Frontend connects via Socket.io client (initialized in App Router layout if needed)

### Third-party Integrations (Lebanon-specific)
- **Phone Verification**: OMT API (referenced in payment flows)
- **Payments**: Whish (Lebanese payment gateway)
- **Localization**: Governorate list stored in Prisma seed

### Environment Variables
**Backend** (`.env`):
- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET`, `JWT_EXPIRES_IN` – Auth tokens
- `REDIS_URL` – Redis connection
- `NODE_ENV` – `development` | `production`

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` – Backend API URL (e.g., `http://localhost:3001/api`)

## Common Tasks for AI Agents

| Task | Command/Path |
|------|-------|
| Add new API endpoint | Create controller method + DTO in `src/<feature>/` following [jobs.controller.ts](apps/backend/src/jobs/jobs.controller.ts) pattern |
| Add database field | Edit [schema.prisma](apps/backend/prisma/schema.prisma), run `pnpm db:migrate` |
| Create new feature module | Copy `src/jobs/` structure; register in [app.module.ts](apps/backend/src/app.module.ts) imports |
| Add i18n strings | Update `messages/en.json`, `messages/ar.json`; use `useTranslations()` in components |
| Debug database | Run `pnpm db:studio` to explore live data |
| Check test coverage | `pnpm test:cov` (outputs to `coverage/`) |
| Deploy backend | Build with `pnpm build:backend`, run `nest start:prod` with prod `.env` |
| Check API docs | Visit `http://localhost:3001/api` (Swagger auto-generated from controller decorators) |

## Key Files Reference

- **Architecture**: [app.module.ts](apps/backend/src/app.module.ts) (imports all modules)
- **Database**: [schema.prisma](apps/backend/prisma/schema.prisma) (data model + enums)
- **Auth**: [auth.module.ts](apps/backend/src/auth/auth.module.ts), [jwt-auth.guard.ts](apps/backend/src/auth/guards/jwt-auth.guard.ts)
- **Sample module**: [jobs/](apps/backend/src/jobs/) (complete feature example)
- **Frontend setup**: [app/[locale]/layout.tsx](apps/frontend/app/[locale]/layout.tsx) (i18n provider)
- **API client**: [lib/api/client.ts](apps/frontend/lib/api/client.ts) (axios + interceptors)
- **Monorepo config**: [pnpm-workspace.yaml](pnpm-workspace.yaml), root [package.json](package.json)
- **Docker**: [docker-compose.yml](docker/docker-compose.yml) (PostgreSQL + Redis)
