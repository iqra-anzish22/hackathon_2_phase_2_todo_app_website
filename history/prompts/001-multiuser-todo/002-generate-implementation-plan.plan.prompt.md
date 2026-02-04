---
id: 002
title: Generate implementation plan
stage: plan
date: 2026-02-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-multiuser-todo
branch: 001-multiuser-todo
user: anzis
command: /sp.plan
labels: ["plan", "architecture", "research", "data-model", "api-contracts", "jwt", "security"]
links:
  spec: specs/001-multiuser-todo/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-multiuser-todo/plan.md
  - specs/001-multiuser-todo/research.md
  - specs/001-multiuser-todo/data-model.md
  - specs/001-multiuser-todo/contracts/api-endpoints.md
  - specs/001-multiuser-todo/contracts/jwt-payload.md
  - specs/001-multiuser-todo/quickstart.md
tests:
  - none
---

## Prompt

Project: Full-Stack Multi-User Todo Web Application (Phase II – Spec 1)

Goal of This Plan:
Produce a step-by-step, spec-aligned implementation plan that transforms the approved specification into executable tasks using Claude Code, without manual coding.

Planning Approach:
- Follow Agentic Dev Stack workflow
- Plan must be detailed enough for task-level execution
- Frontend and backend plans must be explicitly separated
- Security and authentication must be addressed before feature logic
- Research-concurrent approach: verify technical assumptions while planning

System Architecture Sketch:
- Frontend (/frontend): Next.js 16+ App Router, Better Auth for authentication and JWT issuance, API client layer attaching JWT to all requests, Pages/components for task CRUD operations
- Backend (/backend): FastAPI application, JWT verification middleware, SQLModel ORM models, Neon PostgreSQL database, REST API endpoints scoped by authenticated user

Implementation Phases:
Phase 1: Environment & Project Setup
Phase 2: Authentication Infrastructure
Phase 3: Database & Models (Backend)
Phase 4: Core API Endpoints (Backend)
Phase 5: Frontend Task Interface
Phase 6: Security & Validation
Phase 7: Testing & Quality Checks

Decisions Needing Documentation:
- JWT payload fields required by backend
- Where JWT verification logic resides (middleware vs dependency)
- Task ownership enforcement strategy
- Error response formats
- API versioning strategy (if any)

Testing Strategy:
- Authentication tests (valid/invalid/expired JWT)
- API contract tests for each endpoint
- User isolation tests
- Frontend integration tests for CRUD flows
- Manual security validation via token tampering

## Response snapshot

Created comprehensive implementation plan with complete Phase 0 (Research) and Phase 1 (Design) artifacts.

**Plan Structure**:
- Technical Context: TypeScript/Next.js frontend, Python/FastAPI backend, Neon PostgreSQL
- Constitution Check: All 5 principles validated (✅ PASS)
- Project Structure: Web application with /frontend and /backend separation
- No complexity violations

**Phase 0: Research (research.md)**:
Resolved all technical clarifications with 7 key decisions:
1. Frontend Testing: Vitest + Playwright (modern, fast, Next.js compatible)
2. Better Auth JWT: HTTP-only cookies for security, server-side token extraction
3. FastAPI JWT Verification: python-jose with dependency injection pattern
4. SQLModel + Neon: Async engine with asyncpg driver, Alembic migrations
5. Next.js Auth Patterns: Middleware-based route protection, server components
6. API Design: RESTful with ownership validation on all endpoints
7. Environment Config: .env files with shared BETTER_AUTH_SECRET

**Phase 1: Design Artifacts**:

1. **data-model.md**:
   - 2 entities (User managed by Better Auth, Task managed by backend)
   - Task model with 7 fields (id, user_id, title, description, completed, timestamps)
   - SQLModel implementation with indexes on user_id
   - Pydantic schemas for request/response validation
   - Query patterns with ownership enforcement

2. **contracts/api-endpoints.md**:
   - 6 REST endpoints documented (List, Create, Get, Update, Delete, Toggle)
   - Complete request/response examples with all HTTP status codes
   - Authentication requirements and JWT validation flow
   - Error response formats and security considerations
   - Testing checklist for all endpoints

3. **contracts/jwt-payload.md**:
   - JWT structure with HS256 algorithm
   - Required claims: sub (user_id), email, iat, exp
   - Token lifecycle (issuance, usage, expiration, revocation)
   - Security considerations (shared secret, HTTP-only cookies, HTTPS)
   - Backend verification implementation with python-jose
   - Frontend token access patterns for Next.js App Router

4. **quickstart.md**:
   - Complete setup guide for local development
   - Database setup (Neon PostgreSQL)
   - Backend setup (Python venv, dependencies, environment, migrations)
   - Frontend setup (npm install, environment, dev server)
   - End-to-end testing procedures
   - Troubleshooting guide for common issues
   - Production deployment checklist

**Agent Context Update**:
- Updated CLAUDE.md with Neon PostgreSQL database information
- Technology stack preserved for task generation

**Key Architectural Decisions**:
- JWT authentication with shared secret (BETTER_AUTH_SECRET)
- Async SQLAlchemy with asyncpg for non-blocking database operations
- Dependency injection for JWT verification (testable, reusable)
- HTTP-only cookies for token storage (XSS protection)
- Middleware-based route protection in Next.js
- RESTful API with ownership checks on every operation

## Outcome

- ✅ Impact: Complete implementation plan ready for task breakdown via /sp.tasks
- 🧪 Tests: Constitution Check passed (5/5 principles), all clarifications resolved
- 📁 Files: plan.md, research.md, data-model.md, contracts/ (2 files), quickstart.md
- 🔁 Next prompts: /sp.tasks to generate executable task list organized by user story
- 🧠 Reflection: Plan provides clear separation between frontend and backend with security-first design. All technical decisions documented with rationale. Ready for task-level implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all clarifications resolved through research
- Graders run and results (PASS/FAIL): Constitution Check PASS (5/5 principles)
- Prompt variant (if applicable): Detailed user input with implementation phases and decision points
- Next experiment (smallest change to try): Proceed with /sp.tasks to validate plan completeness through task generation
