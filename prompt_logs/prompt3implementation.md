# Prompt 3 Implementation Summary — Role Mismatch & Endpoint Routing Fix

**Date:** 2026-10-10  
**Scope:** Fix Customer (`CUSTOMER` / `OWNER`) role authorization mismatch on service request creation, repair Admin Safety Report status resolution endpoint, implement strict pet ownership validation, and add automated test coverage.

---

## 1. Root Cause Analysis

### A. Customer Request Access Denied (`403 Access denied. Requires one of roles: [OWNER]`)
1. **The Role Duality**:
   - The platform supports two synonym role values representing pet parents: `CUSTOMER` (used by customer onboarding, frontend UI, and seed accounts) and `OWNER` (legacy schema enum).
   - In `Role` enum (`@petco/shared`), both `CUSTOMER = 'CUSTOMER'` and `OWNER = 'OWNER'` exist.
   - Sarah Jenkins was logged in with a valid JWT token carrying `role: 'CUSTOMER'`.
2. **The Middleware Check**:
   - In `server/src/routes/request.routes.ts`, the route was defined as:
     ```typescript
     router.post('/', authMiddleware, requireRole(Role.OWNER), ...);
     ```
   - In `server/src/middlewares/role.middleware.ts`, `requireRole` strictly checked:
     ```typescript
     if (!allowedRoles.includes(req.user.role)) { ... }
     ```
   - Since `allowedRoles` only contained `['OWNER']`, legitimate customers with `role: 'CUSTOMER'` were denied access with `403 Access denied. Requires one of roles: [OWNER]`.

### B. Admin Safety Reports 404 (`Endpoint not found: PATCH /api/reports/:id/status`)
- The Next.js Admin dashboard calls `PATCH /api/reports/:id/status` to change status to `RESOLVED` or `DISMISSED`.
- In `server/src/routes/report.routes.ts`, only `PATCH /:id/resolve` was declared, causing a 404 Route Not Found error when clicking "Mark as Resolved" or "Dismiss Report".

---

## 2. Solutions Implemented

### A. Role Middleware Normalization (`server/src/middlewares/role.middleware.ts`)
- Updated `requireRole` to recognize `CUSTOMER` and `OWNER` as equivalent roles.
- If `allowedRoles` requires `CUSTOMER` or `OWNER`, both roles are permitted.
- Preserved strict role security:
  - Users with role `HELPER` remain denied (`403`).
  - Users with role `ADMIN` remain denied (`403`).
  - Unauthenticated requests remain rejected (`401`).

### B. Request Route Definition (`server/src/routes/request.routes.ts`)
- Explicitly declared allowed roles on `POST /requests`:
  ```typescript
  router.post(
    '/',
    authMiddleware,
    requireRole(Role.CUSTOMER, Role.OWNER),
    validate(serviceRequestSchema),
    RequestController.createRequest
  );
  ```

### C. Server-Side Token Security & Pet Ownership Validation (`server/src/services/request.service.ts`)
- `ownerId` is strictly extracted from `req.user.userId` (from the cryptographically verified JWT token), not trusted from request body.
- Verified pet ownership check:
  ```typescript
  const pet = await prisma.pet.findFirst({
    where: { id: data.petId, ownerId },
  });
  if (!pet) {
    throw new Error('Pet not found or does not belong to you');
  }
  ```
  Prevents any user from posting service requests for pets belonging to others.

### D. Admin Safety Report Endpoint Route (`server/src/routes/report.routes.ts`)
- Added `PATCH /:id/status` mapping to `ReportController.resolveReport`:
  ```typescript
  router.patch('/:id/status', authMiddleware, requireRole(Role.ADMIN), ReportController.resolveReport);
  ```

---

## 3. Automated Test Suite (`server/src/__tests__/request-auth.test.ts`)
Created automated test cases verifying:
1. `requireRole` denies unauthenticated requests (`401`).
2. `requireRole` allows `CUSTOMER` when `OWNER` is required.
3. `requireRole` allows `OWNER` when `CUSTOMER` is required.
4. `requireRole` denies `HELPER` when `CUSTOMER`/`OWNER` is required (`403`).
5. `requireRole` denies `ADMIN` when `HELPER` is required (`403`).
6. `RequestService.createRequest` rejects attempts to use another user's pet (`404`).
7. `RequestService.createRequest` succeeds when pet belongs to authenticated owner.

**Test Results:**
```
PASS src/__tests__/request-auth.test.ts
PASS src/__tests__/auth.test.ts
PASS src/__tests__/geo.test.ts
Test Suites: 3 passed, 3 total
Tests:       11 passed, 11 total
```

---

## 4. Live Verification Against Supabase PostgreSQL
- Authenticated as `sarah@petco.com` (Customer).
- Successfully submitted a service request for her pet.
- Response verified:
  - `status: 201 Created`
  - Created request ID: `153ffc28-69aa-4aeb-b699-a2dbf1cf3cef`
  - Persisted in Supabase PostgreSQL database.
- Authenticated as `admin@petco.com` (Admin) and resolved safety report `47cb6e6b-5645-4fac-b2a3-41b5c57095a5` via `PATCH /api/reports/:id/status` with `status: 200 OK`.
