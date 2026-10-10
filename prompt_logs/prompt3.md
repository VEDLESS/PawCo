# Prompt 3 — Fix Customer Request Creation Role Mismatch & Endpoint Routing

The customer request creation flow is failing at the final step with this error:

`Access denied. Requires one of roles: [OWNER]`

The logged-in user is Sarah Jenkins, whose account is displayed as `Customer`. She can complete the entire request wizard, but posting the request fails.

Please investigate and fix the root cause across the frontend, backend, authentication, and database.

Requirements:

1. Trace the complete request creation flow from the frontend submit handler through the API route, authentication middleware, role authorization middleware, controller, Prisma schema, and database.
2. Inspect the actual role values used throughout the project. The frontend uses Customer, while the backend appears to require OWNER. Determine the intended canonical roles and implement a consistent role mapping.
3. Ensure a legitimate customer/pet owner can create a service request for their own pet.
4. Verify that the authenticated user ID is taken from the verified server-side token/session, not trusted from request body data.
5. Preserve strict authorization: helpers must not create owner requests unless explicitly permitted, and admins must retain their intended permissions.
6. Check ownership validation so customers cannot create requests for pets belonging to other users.
7. Inspect JWT claims, role enums, database user records, demo seed accounts, and frontend role guards. Fix the underlying mismatch rather than hiding the error or bypassing middleware.
8. Ensure the request is saved in Supabase PostgreSQL and that the response includes the created request.
9. Add or update tests for customer success, helper denial, unauthenticated requests, and attempts to use another user's pet.
10. Verify the full flow using the existing demo customer account, from selecting a pet through successfully posting a request.

Do not weaken authorization, hardcode a user ID, disable authentication, or replace the database with mock data. Preserve existing functionality for all three roles: Customer/Owner, Helper, and Admin.

After implementing the fix, explain the root cause, list the files changed, and report which tests passed. Restart the backend if needed and confirm the request can be posted successfully.
