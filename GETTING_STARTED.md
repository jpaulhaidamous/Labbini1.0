# Labbini - Getting Started Guide

## What's Been Built

I've successfully set up the foundational infrastructure for Labbini, Lebanon's freelance marketplace. Here's what's ready:

### ✅ Project Foundation (Completed)

#### 1. Monorepo Structure
- **Tool**: pnpm workspaces
- **Structure**:
  - `apps/backend` - NestJS API
  - `apps/frontend` - Next.js 14 application
  - `packages/shared-types` - Shared TypeScript types
  - `docker/` - Database configuration

#### 2. Backend (NestJS)
- ✅ Complete project scaffolding
- ✅ Prisma ORM configuration
- ✅ PostgreSQL database schema (all 15+ models)
- ✅ Database seed file with:
  - Lebanese categories (Digital Services, Manual Trades, etc.)
  - Skills with Arabic translations
  - Lebanese governorates
  - 3 test freelancers + 1 test client
  - Sample job posting
- ✅ Global Prisma service
- ✅ Environment configuration
- ✅ TypeScript setup with strict mode

#### 3. Frontend (Next.js 14)
- ✅ App Router setup
- ✅ Bilingual support (Arabic RTL + English)
  - next-intl configuration
  - Translation files ready
  - RTL middleware
- ✅ Tailwind CSS + Shadcn/ui foundation
- ✅ Global styles with RTL support
- ✅ TypeScript configuration
- ✅ Environment setup

#### 4. Database Schema
Complete Prisma schema with all models:
- Users & Profiles (with verification levels)
- Categories & Skills (hierarchical)
- Jobs (bilingual, location-aware)
- Proposals
- Contracts & Milestones
- Transactions & Wallets (escrow ready)
- MessageThreads & Messages
- Reviews
- Verification Documents
- Refresh Tokens

#### 5. Docker Services
- PostgreSQL 15 (main database)
- Redis 7 (caching/sessions)
- Health checks configured
- Network isolation

## Next Steps

### Immediate Development Tasks
1. **Install dependencies**: `pnpm install`
2. **Start databases**: `pnpm docker:up`
3. **Setup backend env**: Copy `apps/backend/.env.example` to `.env`
4. **Run migrations**: `pnpm db:migrate`
5. **Seed database**: `pnpm db:seed`
6. **Start development**: `pnpm dev`

### What Needs to Be Built Next

#### Phase 1: Authentication (Priority: CRITICAL)
- [ ] JWT authentication service
- [ ] Register endpoint
- [ ] Login endpoint
- [ ] Email/phone verification
- [ ] Refresh token rotation
- [ ] Password hashing

#### Phase 2: Core Modules
- [ ] Users & Profiles API
- [ ] Jobs API (create, list, filter)
- [ ] Proposals API
- [ ] Contracts API (simplified MVP)
- [ ] Wallet & Transactions
- [ ] Escrow service

#### Phase 3: Real-time Features
- [ ] Socket.io messaging gateway
- [ ] Message threading
- [ ] Pre-hire message limits

#### Phase 4: Frontend Pages
- [ ] Authentication pages (login, register)
- [ ] Home & job browsing
- [ ] Job details & proposal submission
- [ ] Profile pages
- [ ] Contract management
- [ ] Messaging interface
- [ ] Wallet dashboard

## How to Run

### Prerequisites
- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Start databases
pnpm docker:up

# 3. Setup backend environment
cd apps/backend
cp .env.example .env
# Edit .env - update DATABASE_URL, JWT secrets, etc.

# 4. Run database migrations
cd ../..
pnpm db:migrate

# 5. Seed database with test data
pnpm db:seed

# 6. Setup frontend environment
cd apps/frontend
cp .env.example .env

# 7. Start development servers
cd ../..
pnpm dev
```

### Access the Application

After running `pnpm dev`:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Prisma Studio**: Run `pnpm db:studio` to view database

### Test Accounts (After Seeding)

**Client:**
- Email: `client@labbini.com`
- Password: `password123`

**Freelancers:**
- Email: `freelancer1@labbini.com` (Web Developer - Sara Mansour)
- Email: `freelancer2@labbini.com` (Plumber - Mahmoud Harb)
- Email: `freelancer3@labbini.com` (Graphic Designer - Lina Farah)
- Password: `password123` (all accounts)

## Project Structure

```
labbini/
├── apps/
│   ├── backend/                 # NestJS API
│   │   ├── src/
│   │   │   ├── prisma/         # Prisma service
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # 📊 Database schema
│   │   │   └── seed.ts         # 🌱 Seed data
│   │   └── package.json
│   │
│   └── frontend/                # Next.js 14
│       ├── app/                 # App Router pages
│       ├── components/          # React components
│       ├── lib/                 # Utilities, stores, API client
│       ├── messages/            # i18n translations
│       │   ├── en.json         # English
│       │   └── ar.json         # Arabic
│       ├── styles/
│       │   └── globals.css     # Global styles + RTL
│       ├── middleware.ts        # i18n middleware
│       └── package.json
│
├── docker/
│   └── docker-compose.yml       # PostgreSQL + Redis
│
├── package.json                 # Root workspace
├── pnpm-workspace.yaml
└── README.md
```

## Database Schema Highlights

### User Verification Levels
- **LEVEL_0**: Email verified only (can browse)
- **LEVEL_1**: Phone verified (can submit proposals)
- **LEVEL_2**: ID verified (full access)
- **LEVEL_3**: Premium verified (badge)

### Lebanese-Specific Features
- **Governorates**: Beirut, Mount Lebanon, North Lebanon, South Lebanon, Bekaa, Nabatieh, Akkar, Baalbek-Hermel
- **Payment Methods**: OMT, Whish, Bank Transfer, Cash, Wallet
- **Phone Format**: +961 (Lebanese country code)

### Bilingual Support
All user-facing content has both English and Arabic fields:
- Job titles, descriptions
- Category names
- Skill names
- Profile bios

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://labbini:labbini_dev_pass@localhost:5432/labbini_dev"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me-in-production"
JWT_REFRESH_SECRET="change-me-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

## Available Commands

### Root Commands
```bash
pnpm dev              # Start both frontend and backend
pnpm build            # Build both applications
pnpm test             # Run all tests
pnpm docker:up        # Start databases
pnpm docker:down      # Stop databases
pnpm db:migrate       # Run Prisma migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```

### Backend-Specific
```bash
pnpm dev:backend      # Start backend only
pnpm build:backend    # Build backend
pnpm test:backend     # Run backend tests
```

### Frontend-Specific
```bash
pnpm dev:frontend     # Start frontend only
pnpm build:frontend   # Build frontend
pnpm lint             # Run ESLint
```

## Key Features Ready

### ✅ Implemented
- Monorepo architecture
- Database schema (all models)
- Bilingual i18n infrastructure
- RTL support for Arabic
- Docker development environment
- Test data seeding
- TypeScript throughout

### 🚧 In Progress
- Authentication module
- API endpoints
- Frontend pages

### 📋 Todo
- Payment integration (OMT, Whish)
- Real-time messaging
- File uploads
- Email notifications
- SMS verification
- Job search/filtering
- Reviews system
- Admin panel

## Development Workflow

1. **Start Docker services** (first time only):
   ```bash
   pnpm docker:up
   ```

2. **Run migrations** (first time or after schema changes):
   ```bash
   pnpm db:migrate
   ```

3. **Seed database** (first time or to reset data):
   ```bash
   pnpm db:seed
   ```

4. **Start development**:
   ```bash
   pnpm dev
   ```
   This starts both frontend (port 3000) and backend (port 3001)

5. **Make changes**:
   - Backend code auto-reloads with Nest's watch mode
   - Frontend auto-reloads with Next.js Fast Refresh

6. **View database**:
   ```bash
   pnpm db:studio
   ```
   Opens Prisma Studio at http://localhost:5555

## Troubleshooting

### Port Already in Use
If you see "Port 3000/3001/5432/6379 is already in use":
```bash
# Stop Docker services
pnpm docker:down

# Find and kill processes using ports
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# View logs
pnpm docker:logs

# Restart services
pnpm docker:down && pnpm docker:up
```

### Prisma Errors
```bash
# Regenerate Prisma Client
cd apps/backend
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Next Development Session

When you're ready to continue building, start with:

1. **Authentication Module** ([apps/backend/src/auth](apps/backend/src/auth))
   - Implement JWT strategy
   - Create register/login endpoints
   - Add email/phone verification

2. **API Client** ([apps/frontend/lib/api](apps/frontend/lib/api))
   - Axios instance with interceptors
   - Authentication helpers

3. **First Pages**
   - Login page
   - Register page
   - Home page with job listings

The foundation is solid - everything is configured and ready for rapid development! 🚀
