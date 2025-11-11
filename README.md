# oRPC Multiservice Monorepo Playground

A full-stack TypeScript monorepo demonstrating **microservices architecture** with [oRPC](https://orpc.unnoq.com), TanStack Query, and end-to-end type safety.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 24+ recommended
- **pnpm**: 10.21.0+ (project uses `pnpm` workspaces)

### Installation

```bash
# Install dependencies
pnpm install

# Start development (runs API + Web in parallel)
pnpm dev
```

The API server starts at `http://localhost:3000` and the web app at `http://localhost:5173`.

### Available Scripts

```bash
pnpm dev              # Start all services in development mode
pnpm build            # Build all packages and apps
pnpm preview          # Preview production builds
pnpm type:check       # TypeScript type checking
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
```

## 📐 Architecture

### Monorepo Structure

```
orpc-multiservice-monorepo-playground/
├── apps/
│   ├── api/          → HTTP server aggregating all services
│   └── web/          → React frontend with TanStack Query
├── packages/
│   ├── auth-contract/     → Auth API contract
│   ├── auth-service/      → Auth implementation
│   ├── chat-contract/     → Chat API contract
│   ├── chat-service/      → Chat implementation (real-time)
│   ├── planet-contract/   → Planet CRUD contract
│   └── planet-service/    → Planet CRUD implementation
└── package.json      → Monorepo root
```

### Service Architecture

Each microservice follows the **contract-first** pattern:

```
┌──────────────────────────────────────────┐
│          API Aggregator (apps/api)       │
│  - Routes requests to services           │
│  - Provides shared context (auth, etc.)  │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│           Service Layer                  │
│  - Implements business logic             │
│  - Uses middleware (auth, retry, etc.)   │
│  - Handles errors with type safety       │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│          Contract Layer                  │
│  - Defines API shape with Zod schemas    │
│  - OpenAPI metadata (routes, tags)       │
│  - Shared types (TypeScript inference)   │
└──────────────────────────────────────────┘
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/unnoq/unnoq/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/unnoq/unnoq/sponsors.svg'/>
  </a>
</p>
