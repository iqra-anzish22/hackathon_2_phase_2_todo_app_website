---
id: 002
title: todo-robustness-implementation-plan
stage: plan
date: 2026-02-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: 002-todo-robustness
branch: 002-todo-robustness
user: anzis
command: /sp.plan
labels: ["planning", "production-readiness", "error-handling", "validation", "security", "architecture"]
links:
  spec: specs/002-todo-robustness/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-todo-robustness/plan.md
  - specs/002-todo-robustness/research.md
  - specs/002-todo-robustness/data-model.md
  - specs/002-todo-robustness/contracts/error-responses.md
  - specs/002-todo-robustness/contracts/api-endpoints-updated.md
  - specs/002-todo-robustness/quickstart.md
tests:
  - Constitution check passed (all 5 principles)
  - Post-design constitution re-check passed
---

## Prompt

Project: Full-Stack Multi-User Todo Web Application (Phase II – Spec 2)

Goal of This Plan:
Translate Spec 2 enhancements into a clear execution plan focused on robustness, UX clarity, and backend correctness.

Planning Approach:
- Extend Spec 1 implementation without breaking existing behavior
- Improve reliability before adding any new features
- Maintain strict frontend/backend separation
- Validate assumptions while planning (research-concurrent)

Architecture Refinement:
- Frontend:
  - Introduce API client abstraction
  - Centralize error and auth handling
  - Improve UI state management
- Backend:
  - Normalize error handling
  - Strengthen validation and authorization layers

Implementation Phases:

Phase 1: Backend Hardening
- Define standard error response schema
- Refactor endpoints to use shared validation logic
- Add strict ownership checks at service layer
- Ensure consistent status codes

Phase 2: JWT & Authorization Validation
- Add route-level checks for user_id mismatch
- Test expired and malformed JWT scenarios
- Ensure backend rejects all unauthorized access paths

Phase 3: Frontend API Client Layer
- Create centralized fetch wrapper
- Automatically attach JWT
- Handle common error responses
- Redirect on auth failure

Phase 4: UX & UI Improvements
- Add loading indicators
- Add empty state messaging
- Add visual completion indicators
- Improve form validation feedback

Phase 5: Data Consistency Checks
- Prevent task ownership mutation
- Ensure delete and update operations are final
- Validate completion toggle behavior

Phase 6: Testing & Validation
- Test invalid input cases
- Test API behavior with forged requests
- Validate frontend response to backend failures
- Multi-user isolation regression testing

Decisions Needing Documentation:
- Error response format
- Where validation logic resides
- API client abstraction boundaries
- Frontend state management strategy

Testing Strategy:
- Backend validation tests
- Authorization edge case testing
- Frontend UX testing for failure states
- Manual JWT tampering tests

Deliverables:
- Hardened API behavior
- Improved frontend UX clarity
- Stable and predictable error handling
- Spec-aligned plan ready for execution

Success Criteria:
- Spec 2 requirements fully satisfied
- No regressions from Spec 1
- Application demonstrates production-quality behavior
- Ready to proceed to Spec 3

## Response snapshot

Successfully completed implementation planning for Todo Application Production Readiness enhancements.

**Planning Summary**:

**Phase 0: Research & Technical Decisions** ✅
Generated research.md with 7 technical decisions:
1. Error Response Standardization: Custom HTTPException + Pydantic models for consistent structure
2. Race Condition Prevention: SELECT FOR UPDATE with row locking for idempotent completion toggle
3. Frontend Error Handling: Centralized API client wrapper with component-level error state
4. JWT Validation Edge Cases: Enhanced dependency with specific error codes (MISSING_TOKEN, TOKEN_EXPIRED, INVALID_TOKEN)
5. Validation Patterns: Pydantic validators with custom exception handler for structured 422 responses
6. Ownership Enforcement: Reusable authorization utility functions (get_user_task_or_404)
7. Loading States: React useState for loading/error/empty patterns

All decisions documented with rationale, alternatives considered, and implementation approach.

**Phase 1: Design Artifacts** ✅
Generated 4 design documents:

1. **data-model.md**: Defined ErrorResponse and ErrorDetail entities, error code taxonomy (13 error codes across 401/403/404/422/500), validation rules for Task entity
2. **contracts/error-responses.md**: Standard error response format, detailed error scenarios for each HTTP status code, frontend error handling guidelines, testing checklist
3. **contracts/api-endpoints-updated.md**: Updated all 6 API endpoints with comprehensive error specifications, idempotency documentation, concurrency handling details
4. **quickstart.md**: Complete testing guide with 8 test suites (60+ test cases), manual testing procedures, troubleshooting guide

**Constitution Check**: ✅ ALL GATES PASSED (initial and post-design)
- Spec-Driven Development: Following mandatory workflow
- Security First: Enhancements strengthen security (JWT verification, ownership enforcement)
- Separation of Concerns: Maintains strict backend/frontend separation
- API-Centric Design: Improves API contracts with standardized errors
- Reproducibility & Traceability: All decisions documented with rationale

**Technical Context**:
- Language: Python 3.11+ (backend), TypeScript/Next.js 15+ (frontend)
- Dependencies: FastAPI, SQLModel, python-jose, Better Auth, React 18
- Storage: Neon PostgreSQL (no schema changes)
- Performance: Error responses <200ms, validation overhead <50ms
- Constraints: No breaking changes, maintain API compatibility

**Project Structure**:
- Backend enhancements: core/errors.py, schemas/errors.py, enhanced dependencies.py and routes/tasks.py
- Frontend enhancements: lib/errors.ts, types/errors.ts, ErrorMessage.tsx component, enhanced API client
- No database migrations required

**Implementation Strategy**:
- Non-breaking enhancement approach
- Backend hardening first, then frontend error handling, then UI polish
- Manual testing focus per specification
- Risk mitigation: test independently, maintain existing functionality

## Outcome

- ✅ Impact: Complete implementation plan ready for task breakdown via /sp.tasks
- 🧪 Tests: Constitution check passed (5/5 principles), post-design re-check passed
- 📁 Files: 6 files created (plan.md, research.md, data-model.md, 2 contracts, quickstart.md)
- 🔁 Next prompts: /sp.tasks to generate task breakdown organized by user story
- 🧠 Reflection: Planning phase completed successfully with comprehensive research and design artifacts. All technical decisions documented with rationale and alternatives. Error handling strategy is consistent across backend and frontend. No constitution violations. Ready for task-level breakdown with clear implementation guidance.

## Evaluation notes (flywheel)

- Failure modes observed: None - all planning phases completed successfully
- Graders run and results (PASS/FAIL): Constitution check PASS (5/5 initial, 5/5 post-design)
- Prompt variant (if applicable): Standard planning workflow with Phase 0 research and Phase 1 design artifacts
- Next experiment (smallest change to try): Execute /sp.tasks to generate task breakdown, organize tasks by user story (P1: Error Feedback, P2: Backend Validation, P3: Security Enforcement) for independent implementation
