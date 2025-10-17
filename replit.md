# FitTrack - Workout & Nutrition Tracker

## Overview

FitTrack is a comprehensive full-stack fitness tracking application that enables users to log workouts, calculate weight plates for barbell exercises, monitor daily nutrition intake, and track heart rate during cardio sessions. The application features a clean, Linear-inspired design system with both light and dark mode support.

**Core Capabilities:**
- User authentication via Replit Auth (OAuth-based)
- Workout tracking with exercise logging and progress visualization
- Smart plate calculator for barbell exercises
- Nutrition tracking with barcode scanning support
- Heart rate monitoring via Web Bluetooth API
- Personalized user preferences (units, calorie goals, macro targets)
- Progress charts and statistics dashboard

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Recharts for data visualization

**Design System:**
- Linear-inspired utility-first approach prioritizing clarity and data density
- Custom color palette supporting light/dark themes via CSS variables
- Consistent interaction patterns with elevation states (hover-elevate, active-elevate-2)
- Typography: Inter for UI, JetBrains Mono for monospace data
- Border radius system: lg (9px), md (6px), sm (3px)

**State Management Strategy:**
- TanStack Query handles all server state (workouts, meals, preferences)
- Query invalidation patterns for optimistic updates
- Local component state for UI-only concerns (modals, form inputs)
- No global client state library needed due to server-centric data model

**Route Structure:**
- `/` - Landing page (unauthenticated) or Dashboard (authenticated)
- `/workouts` - Workout management and plate calculator
- `/nutrition` - Meal logging and macro tracking
- `/cardio` - Heart rate monitoring with zone guidance
- `/progress` - Historical charts and statistics
- `/settings` - User preferences configuration

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript throughout
- Drizzle ORM for database interactions
- PostgreSQL (Neon serverless) as primary database
- Passport.js with OpenID Connect strategy for Replit Auth

**Authentication Flow:**
- Replit Auth via OpenID Connect (blueprint:javascript_log_in_with_replit)
- Session-based authentication using express-session
- PostgreSQL-backed session store (connect-pg-simple)
- Session TTL: 7 days
- User profile stored in `users` table with OAuth claims

**API Design:**
- RESTful endpoints under `/api` prefix
- Authentication middleware (`isAuthenticated`) protects all data routes
- Consistent error handling with HTTP status codes
- JSON request/response format
- Request logging for API routes with duration tracking

**Database Schema (Drizzle):**
- `users` - OAuth user profiles (id, email, firstName, lastName, profileImageUrl)
- `user_preferences` - Per-user settings (weightUnit, barWeight, availablePlates, calorieGoal, proteinGoal, carbsGoal, fatGoal)
- `workouts` - Workout sessions (userId, name, date)
- `exercises` - Exercise entries within workouts (workoutId, name, sets as JSONB)
- `meals` - Nutrition entries (userId, name, date, time, calories, protein, carbs, fat)
- `heart_rate_sessions` - Cardio tracking (userId, startTime, endTime, avgHeartRate, maxHeartRate, zoneDistribution as JSONB)
- `sessions` - Express session storage for authentication

**Storage Layer Pattern:**
- `server/storage.ts` defines `IStorage` interface
- Abstracts database operations from route handlers
- All queries use Drizzle ORM with parameterized inputs
- Consistent user ownership validation (userId checks on all operations)

### External Dependencies

**Third-Party Services:**
- **Replit Auth** - OAuth authentication provider (OIDC)
  - Issuer URL: `https://replit.com/oidc` (configurable via REPLIT_DOMAINS env var)
  - Handles user identity, profile data, and session management

- **Open Food Facts API** - Nutrition database for barcode scanning
  - Endpoint: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`
  - Provides product names and nutritional information (calories, macros per 100g)
  - No authentication required

**Web Platform APIs:**
- **Web Bluetooth API** - Heart rate monitor connectivity
  - Service UUID: `0x180d` (Heart Rate Service)
  - Characteristic UUID: `0x2a37` (Heart Rate Measurement)
  - Browser support: Chrome, Edge, Opera (not Safari/Firefox)
  - Requires HTTPS and user permission grant

**Database:**
- **Neon Serverless PostgreSQL**
  - Connection pooling via `@neondatabase/serverless`
  - WebSocket-based protocol (requires `ws` package in Node.js)
  - Environment variable: `DATABASE_URL`
  - Migration tool: Drizzle Kit

**UI Component Libraries:**
- **Radix UI** - Headless accessible components (30+ primitives imported)
- **shadcn/ui** - Pre-styled component wrappers around Radix UI
- **Recharts** - Chart library for workout/nutrition progress visualization
- **html5-qrcode** - Barcode/QR code scanning for nutrition tracking

**Development Tools:**
- **Vite Plugins:**
  - `@replit/vite-plugin-runtime-error-modal` - Error overlay
  - `@replit/vite-plugin-cartographer` - Development tools (Replit-specific)
  - `@replit/vite-plugin-dev-banner` - Development banner

**Build & Runtime:**
- **esbuild** - Production server bundling
- **tsx** - TypeScript execution for development
- Monorepo structure: `client/`, `server/`, `shared/` directories
- Path aliases: `@/` → client/src, `@shared/` → shared, `@assets/` → attached_assets