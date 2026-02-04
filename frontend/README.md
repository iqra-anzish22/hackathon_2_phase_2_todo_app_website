# Multi-User Todo Frontend

Next.js frontend for the Multi-User Todo Web Application with Better Auth authentication.

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:8000

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

3. Run development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/         # Authentication pages (signin, signup)
│   │   ├── (protected)/    # Protected routes (tasks)
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   ├── lib/                # Utilities (auth, api client)
│   └── types/              # TypeScript type definitions
├── tests/                  # Test files
├── package.json            # Node dependencies
└── .env.local.example     # Environment variable template
```

## Environment Variables

- `BETTER_AUTH_SECRET`: JWT signing secret (must match backend)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `BETTER_AUTH_URL`: Frontend URL for Better Auth

## Features

- User authentication (sign up, sign in)
- Session persistence with JWT tokens
- Task management (create, read, update, delete)
- Task completion toggle
- Responsive design for desktop and mobile
- Protected routes with automatic redirect

## Development

Build for production:
```bash
npm run build
npm start
```

Run linter:
```bash
npm run lint
```

## Authentication Flow

1. User signs up or signs in via Better Auth
2. Better Auth issues JWT token stored in HTTP-only cookie
3. Frontend middleware protects routes and redirects unauthenticated users
4. API client automatically includes JWT token in all requests
5. Backend verifies token and enforces task ownership

## API Integration

All API calls go through `src/lib/api.ts` which:
- Adds Authorization header with JWT token
- Handles 401 errors (expired token)
- Provides consistent error handling
- Supports all CRUD operations for tasks
