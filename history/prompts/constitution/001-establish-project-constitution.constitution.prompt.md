---
id: 001
title: Establish project constitution
stage: constitution
date: 2026-02-04
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: anzis
command: /sp.constitution
labels: ["constitution", "governance", "principles", "security", "architecture"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

Project: Full-Stack Multi-User Todo Web Application (Phase II – Hackathon)

Objective:
Transform an existing console-based Todo application into a secure, scalable, full-stack web application using a spec-driven, agentic development workflow.

Core Principles:
- Spec-Driven Development: Every implementation must strictly follow approved specs
- Security First: User data isolation and authentication enforcement at every layer
- Separation of Concerns: Backend logic lives only in /backend, frontend logic only in /frontend
- API-Centric Design: Frontend communicates exclusively via REST APIs
- Reproducibility: All decisions, prompts, and iterations must be traceable and reviewable

Development Standards:
- No manual coding; all implementation via Claude Code + Spec-Kit Plus
- Follow Agentic Dev Stack workflow:
  Write spec → Generate plan → Break into tasks → Implement
- Backend and frontend must be independently runnable services
- Environment variables must be used for secrets and configuration

Architecture Constraints:
- Frontend:
  - Framework: Next.js 16+ with App Router
  - Authentication: Better Auth (JWT enabled)
  - API communication via fetch with Authorization headers
  - Responsive UI required
  - All frontend code inside /frontend folder

- Backend:
  - Framework: Python FastAPI
  - ORM: SQLModel
  - Database: Neon Serverless PostgreSQL
  - JWT verification middleware required
  - RESTful API design
  - All backend code inside /backend folder

Authentication & Security Rules:
- Better Auth must issue JWT tokens on login
- JWT must be attached to every API request as:
  Authorization: Bearer <token>
- FastAPI must:
  - Verify JWT using shared secret
  - Extract authenticated user ID
  - Enforce task ownership on every endpoint
- Shared secret:
  - Environment variable: BETTER_AUTH_SECRET
  - Must be identical in frontend and backend
- All endpoints require authentication
- Unauthorized requests must return HTTP 401

API Standards:
- RESTful endpoints only
- All task operations must be scoped to authenticated user
- Backend must never trust user_id from request without JWT validation

Persistence Rules:
- All data must be stored in Neon PostgreSQL
- No in-memory or temporary storage allowed
- Database schema must support multi-user task isolation

Quality & Validation Standards:
- Each endpoint must have:
  - Clear request/response schema
  - Error handling for auth, validation, and ownership
- Task ownership must be enforced on:
  - List
  - Create
  - Read
  - Update
  - Delete
  - Completion toggle
- JWT expiry must be respected
- API behavior must match specification exactly

Success Criteria:
- Multi-user Todo web app with persistent storage
- Users can only see and modify their own tasks
- Frontend and backend authenticate independently via JWT
- All backend logic resides in /backend
- All frontend logic resides in /frontend
- All endpoints reject unauthenticated access
- Project passes hackathon review for spec-driven rigor

## Response snapshot

Created constitution v1.0.0 for Full-Stack Multi-User Todo Web Application with 5 core principles:

1. **Spec-Driven Development (NON-NEGOTIABLE)**: Mandatory workflow through /sp.specify → /sp.plan → /sp.tasks → /sp.implement
2. **Security First**: JWT authentication on all endpoints, user data isolation, ownership enforcement
3. **Separation of Concerns**: Strict /backend and /frontend boundaries with independent services
4. **API-Centric Design**: REST APIs as exclusive integration boundary
5. **Reproducibility & Traceability**: PHRs and ADRs for all decisions

Established architecture constraints:
- Frontend: Next.js 16+ with Better Auth (JWT), responsive UI
- Backend: Python FastAPI with SQLModel, Neon PostgreSQL
- Authentication: JWT flow with BETTER_AUTH_SECRET shared between services

Defined API standards with ownership enforcement on all CRUD operations, error handling requirements (401/403/404/422/500), and persistence rules requiring Neon PostgreSQL for all data.

Template consistency verified:
✅ plan-template.md - Constitution Check section aligned
✅ spec-template.md - User story prioritization aligned
✅ tasks-template.md - Task organization aligned

## Outcome

- ✅ Impact: Established foundational governance for hackathon project with security-first, spec-driven approach
- 🧪 Tests: No tests (governance document)
- 📁 Files: Created .specify/memory/constitution.md (v1.0.0)
- 🔁 Next prompts: /sp.specify to create feature specification for multi-user todo application
- 🧠 Reflection: Constitution provides clear guardrails for JWT authentication, data isolation, and separation of concerns. All principles are testable and enforceable.

## Evaluation notes (flywheel)

- Failure modes observed: None - constitution successfully created with all placeholders filled
- Graders run and results (PASS/FAIL): Manual validation PASS - no unresolved placeholders, version semantics correct, templates aligned
- Prompt variant (if applicable): Standard constitution creation from detailed user requirements
- Next experiment (smallest change to try): Proceed with /sp.specify to test spec-driven workflow compliance
