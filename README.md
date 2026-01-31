# Labbini (لبّيني) - Lebanon's Freelance & Services Marketplace

A full-featured freelance and services marketplace tailored for the Lebanese market, connecting clients with service providers across all industries.

## Features

- **Bilingual Support**: Arabic (RTL) + English
- **All Skills Welcome**: Digital services and manual trades
- **Trust-Centric**: Phone verification + ID upload
- **Lebanon-Specific**: OMT, Whish payments, local governorates
- **Real-time Messaging**: WebSocket-based chat
- **Escrow System**: Secure payment protection

## Tech Stack

### Backend
- NestJS + TypeScript
- Prisma ORM + PostgreSQL 15
- JWT Authentication
- Socket.io for real-time features
- Redis for caching

### Frontend
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Shadcn/ui components
- Zustand + React Query
- next-intl (i18n with RTL support)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Start databases (PostgreSQL + Redis)
pnpm docker:up

# Setup backend environment
cd apps/backend
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm db:migrate

# Seed database with initial data
pnpm db:seed

# Setup frontend environment
cd ../frontend
cp .env.example .env
# Edit .env with API URL

# Return to root and start development servers
cd ../..
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api

### Development Commands

```bash
# Start both frontend and backend
pnpm dev

# Start individually
pnpm dev:backend
pnpm dev:frontend

# Build for production
pnpm build

# Run tests
pnpm test

# Database management
pnpm db:migrate    # Run migrations
pnpm db:seed       # Seed data
pnpm db:studio     # Open Prisma Studio

# Docker
pnpm docker:up     # Start databases
pnpm docker:down   # Stop databases
pnpm docker:logs   # View logs
```

## Project Structure

```
labbini/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js application
├── packages/
│   └── shared-types/     # Shared TypeScript types
├── docker/               # Docker configuration
└── scripts/              # Utility scripts
```

## MVP Features (Phase 1)

- [x] User registration + phone verification
- [x] Basic profiles (freelancer & client)
- [x] Job posting (fixed-price)
- [x] Proposals system
- [x] Simple contracts
- [x] OMT + Whish payments
- [x] Real-time messaging
- [x] Reviews & ratings

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact: support@labbini.com
