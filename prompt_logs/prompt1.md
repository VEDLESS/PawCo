# Build PetCo — Cross-Platform Pet Care Marketplace

Build a complete, modern, production-ready application called **PetCo**.

PetCo is a **hyperlocal pet-care marketplace** connecting pet owners with nearby verified pet-care helpers. The product must be available as:

1. **Web application** — works on Chrome, Edge, Firefox, Safari and other modern browsers.
2. **Mobile application** — works on Android and iOS.
3. Both platforms must use the **same backend, authentication system and PostgreSQL database**, so data stays synchronized across devices.

This is a **new project/repository**. Do not modify or depend on my old PetCo repository. However, the old project can be used conceptually as inspiration for the original idea.

---

# 1. Core Product

PetCo connects:

### Pet Owners
People who need help taking care of their pets.

They can:
- Create an account
- Add/manage pets
- Create pet-care service requests
- Select service type
- Specify date and time
- Specify location
- Add instructions
- Upload pet photos
- Browse suitable helpers
- Receive offers/acceptance
- Track bookings
- Chat with helpers
- Cancel bookings
- Complete bookings
- Rate/review helpers
- View booking history
- Receive notifications

### Pet Helpers
People who provide pet-care services.

They can:
- Create an account
- Build a helper profile
- Specify services they provide
- Set availability
- Set service radius
- View nearby service requests
- Accept/decline requests
- Manage bookings
- Chat with owners
- Navigate to the owner's location
- Mark jobs as started/completed
- View earnings
- View completed jobs
- Receive ratings/reviews
- Receive notifications

---

# 2. Platforms

## Web

Build the website using:

- Next.js
- TypeScript
- Tailwind CSS
- Responsive design
- Modern component architecture

The website should be fully responsive and work properly on:

- Desktop
- Laptop
- Tablet
- Mobile browser

The web application should NOT simply look like a stretched mobile app.

Use responsive layouts appropriate for desktop.

## Mobile

Build a proper mobile application using:

- React Native
- Expo
- TypeScript

Target:

- Android
- iOS

Do NOT simply wrap the website inside a WebView.

The mobile app should use native UI patterns and native capabilities where appropriate.

---

# 3. Backend

Build a centralized backend using:

- Node.js
- Express.js
- TypeScript

The backend must expose REST APIs for both:

- Web
- Mobile

Architecture:

Web ────────┐
            │
Mobile ─────┼──→ Express API ──→ Prisma ──→ PostgreSQL
            │
Admin ──────┘

Do NOT allow the mobile or web clients to directly access PostgreSQL.

All database operations must go through the backend.

---

# 4. Database

Use:

**PostgreSQL**

Use:

**Prisma ORM**

Do NOT use MongoDB or Mongoose.

Create a properly normalized relational database.

Initial entities should include:

### User
- id
- name
- email
- phone
- passwordHash
- role
- profileImage
- location
- createdAt
- updatedAt

Roles:

- OWNER
- HELPER
- ADMIN

### Pet
- id
- ownerId
- name
- species
- breed
- age
- gender
- weight
- description
- medicalNotes
- image
- createdAt
- updatedAt

### HelperProfile
- id
- userId
- bio
- experience
- hourlyRate
- serviceRadius
- verificationStatus
- rating
- totalReviews
- createdAt
- updatedAt

### Service
Support:

- Dog Walking
- Pet Sitting
- Feeding
- Grooming
- Pet Boarding
- Medication Assistance
- Emergency Check-in
- Other

### ServiceRequest
- id
- ownerId
- petId
- serviceType
- title
- description
- location
- latitude
- longitude
- scheduledDate
- startTime
- endTime
- budget
- status
- createdAt
- updatedAt

Statuses:

OPEN
ACCEPTED
IN_PROGRESS
COMPLETED
CANCELLED

### Booking
- id
- requestId
- ownerId
- helperId
- agreedPrice
- status
- startedAt
- completedAt
- createdAt
- updatedAt

### Review
- id
- bookingId
- reviewerId
- reviewedUserId
- rating
- comment
- createdAt

### Message
- id
- senderId
- receiverId
- bookingId
- message
- readAt
- createdAt

### Notification
- id
- userId
- type
- title
- message
- read
- createdAt

Design proper foreign keys, indexes and constraints.

Use Prisma migrations.

---

# 5. Authentication

Implement secure authentication.

Requirements:

- Email/password registration
- Login
- Logout
- Password hashing using bcrypt
- JWT authentication
- Access tokens
- Refresh tokens
- Protected API routes
- Role-based authorization
- Persistent sessions
- Secure token storage on mobile
- Proper authentication handling on web

Users should be able to use the same account on:

- Chrome
- Android
- iPhone

Example:

User creates an account on Android → logs into Chrome → sees the same profile, pets, requests and bookings.

---

# 6. Location / Hyperlocal Matching

PetCo is a **hyperlocal marketplace**, so location is important.

Allow users to provide their location.

For mobile:

- Request location permission properly
- Use device GPS
- Allow manual location selection as fallback

For web:

- Use browser geolocation where permission is granted
- Provide manual location selection fallback

Store:

- latitude
- longitude

Helpers should be able to specify a service radius.

Example:

Helper:
> Available within 5 km

Owner:
> Service request located at coordinates X,Y

Backend should be able to find nearby helpers.

Do not expose unnecessary precise location information to other users.

---

# 7. Maps

Integrate a mapping solution using an abstraction so the provider can be changed later.

The UI should support:

- Selecting a location
- Showing service location
- Showing approximate helper/owner location where appropriate
- Directions/navigation
- Nearby helper discovery

Keep API keys in environment variables.

Never hardcode API keys.

---

# 8. Real-Time Features

Use:

**Socket.IO**

for real-time functionality.

Implement:

- New booking notification
- Booking status updates
- Chat messages
- Request acceptance
- Helper arrival/status updates
- Read receipts where appropriate

Example:

Owner creates request:

OPEN

Helper accepts:

ACCEPTED

Owner's mobile app should update without requiring a manual refresh.

---

# 9. Chat

Create a proper one-to-one chat system between owner and helper.

Chat should support:

- Text messages
- Message timestamps
- Read/unread status
- Real-time delivery
- Conversation history

Only allow users involved in the booking/request to access that conversation.

---

# 10. Notifications

Create a centralized notification system.

Notifications should be generated for:

- New request
- Request accepted
- Booking confirmed
- Booking cancelled
- Booking starting soon
- Booking completed
- New message
- New review
- Important account updates

Mobile:

Use push notifications where possible.

Web:

Support browser notifications where possible.

---

# 11. Owner Mobile App

Create a polished owner experience.

Main navigation:

Home
Requests
Bookings
Messages
Profile

Owner Home should show:

- Welcome message
- Active bookings
- Quick "Request a Service" button
- Nearby/available helpers
- Recent activity

Request flow:

1. Select pet
2. Select service
3. Choose date/time
4. Select location
5. Add instructions
6. Set budget
7. Review request
8. Submit

Make this a smooth multi-step mobile experience.

---

# 12. Helper Mobile App

Main navigation:

Home
Nearby Jobs
Bookings
Messages
Profile

Helper Home:

- Availability toggle
- Nearby requests
- Upcoming booking
- Earnings summary
- Rating

Nearby jobs should show:

- Service type
- Approximate distance
- Date/time
- Pet type
- Budget
- Description

Helper can:

Accept
Decline
View Details

---

# 13. Web Owner Dashboard

Create a full desktop dashboard.

Include:

- Overview
- My Pets
- Create Request
- Active Requests
- Bookings
- Messages
- Reviews
- Profile
- Settings

Use cards, tables and charts where appropriate.

---

# 14. Web Helper Dashboard

Include:

- Overview
- Availability
- Nearby Jobs
- Active Bookings
- Completed Jobs
- Earnings
- Messages
- Reviews
- Profile
- Settings

---

# 15. Admin Panel

Create an admin dashboard.

Admin should be able to:

- View users
- View owners
- View helpers
- Verify helpers
- View service requests
- View bookings
- Handle reported users
- Manage reviews
- View platform statistics
- Suspend users
- View basic revenue/transaction statistics

Use proper role-based access.

---

# 16. UI / UX

PetCo should look like a **real modern startup product**, not a college CRUD project.

Design direction:

- Clean
- Modern
- Friendly
- Premium
- Pet-focused
- Trustworthy
- Minimal but visually engaging

Use:

- Good typography
- Consistent spacing
- Rounded cards
- Subtle shadows
- Good animations
- Clear hierarchy
- Empty states
- Loading states
- Skeleton loaders
- Toast notifications
- Error states
- Confirmation dialogs

Avoid excessive animations.

Prioritize usability.

Use accessible components.

---

# 17. Design System

Create reusable components.

Web:

- Button
- Input
- Select
- Modal
- Dropdown
- Card
- Badge
- Avatar
- Navbar
- Sidebar
- Table
- Tabs
- Toast
- Dialog
- Loading/Skeleton

Mobile:

- Button
- Input
- Card
- Bottom navigation
- Header
- Modal
- Bottom sheet
- Avatar
- Badge
- Toast/Alert
- Loading states

Maintain consistent PetCo branding across web and mobile.

---

# 18. Shared Types

Because web and mobile communicate with the same API, create shared TypeScript types where practical.

For example:

User
Pet
ServiceRequest
Booking
Review
Message
Notification

Avoid duplicating types unnecessarily.

Use a shared package if using a monorepo.

---

# 19. Project Structure

Prefer a clean monorepo structure:

PetCo/

apps/
  web/
  mobile/

server/

packages/
  shared/

prisma/

docs/

The exact structure can be adjusted if a better architecture is justified, but keep the separation between web, mobile, backend and shared code clear.

---

# 20. API Architecture

Create clean REST APIs.

Examples:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout

GET /api/users/me

GET /api/pets
POST /api/pets
GET /api/pets/:id
PUT /api/pets/:id
DELETE /api/pets/:id

GET /api/requests
POST /api/requests
GET /api/requests/:id
PUT /api/requests/:id
DELETE /api/requests/:id

GET /api/helpers
GET /api/helpers/nearby

GET /api/bookings
POST /api/bookings
PUT /api/bookings/:id

GET /api/messages
POST /api/messages

GET /api/notifications
PUT /api/notifications/:id/read

Use proper HTTP status codes and consistent API response formats.

---

# 21. Security

Implement:

- Password hashing
- JWT security
- Refresh token rotation where appropriate
- Input validation
- Rate limiting
- CORS configuration
- Helmet/security headers
- Environment variables
- Authorization middleware
- Request sanitization
- Proper error handling

Never expose:

- Password hashes
- JWT secrets
- Database credentials
- API keys

to the frontend.

---

# 22. Validation

Use a schema validation library such as:

**Zod**

Validate:

- Authentication input
- User profiles
- Pet information
- Service requests
- Bookings
- Messages

Validate on the backend even if frontend validation exists.

---

# 23. Error Handling

Create centralized backend error handling.

The frontend/mobile application should show useful user-friendly errors.

Examples:

"Unable to create request. Please try again."

rather than:

"PrismaClientValidationError..."

Log technical errors on the server.

---

# 24. Environment Variables

Create proper `.env.example` files.

Example:

DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
PORT=

NEXT_PUBLIC_API_URL=

MAPS_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PUSH_NOTIFICATION_CONFIG=

Never commit `.env` files.

---

# 25. Development Experience

Provide:

- README
- Setup instructions
- Database setup instructions
- Prisma migration commands
- Environment variable documentation
- Web development commands
- Mobile development commands
- Backend development commands

The project should be easy to clone and run.

---

# 26. Seed Data

Create Prisma seed data for development.

Include:

- Admin account
- Several owners
- Several helpers
- Multiple pets
- Service requests
- Bookings
- Reviews

This should allow the application to look populated immediately during development.

Do NOT use real personal information.

---

# 27. Testing

Add basic tests for critical backend functionality:

- Registration
- Login
- Authorization
- Creating requests
- Accepting requests
- Booking lifecycle
- Review creation

Also add frontend/mobile validation where appropriate.

---

# 28. Deployment

Prepare the project for deployment.

Web:
Next.js → Vercel or equivalent

Backend:
Node.js/Express → Railway/Render/AWS/etc.

Database:
PostgreSQL → Supabase/Neon/Railway/etc.

Mobile:
Expo/EAS → Android + iOS

The production architecture must use environment variables for all deployment-specific configuration.

---

# 29. Important Product Principle

The web and mobile applications are NOT separate products.

They are two clients of the same PetCo platform.

For example:

A user creates a booking on Android.

Immediately:

PostgreSQL
    ↓
Backend
    ↓
Web dashboard + Mobile app

The same booking must appear everywhere.

Similarly:

User logs into Chrome
→ sees same account

User opens Android
→ sees same account

User opens iPhone
→ sees same account

All data must remain synchronized.

---

# 30. Build Quality

Do not build a superficial demo.

Build the foundation so the project can realistically be extended into a production application.

Avoid:

- Hardcoded fake data in the actual application logic
- Fake authentication
- Direct database access from frontend
- Duplicate backend implementations
- MongoDB
- Mongoose
- WebView-based mobile app
- Hardcoded API keys
- Huge monolithic components
- Unnecessary complexity

Use clean, maintainable, modular code.

---

# 31. Development Strategy

Do NOT attempt to implement everything blindly in one huge step.

First create the architecture and foundation.

Then implement in this order:

### Phase 1
Project setup
- Monorepo
- Next.js
- Expo
- Express
- PostgreSQL
- Prisma
- Shared types
- Environment configuration

### Phase 2
Authentication
- Registration
- Login
- JWT
- Refresh tokens
- Roles
- Protected routes

### Phase 3
Core data
- Users
- Pets
- Helper profiles

### Phase 4
Marketplace
- Service requests
- Nearby helpers
- Booking lifecycle

### Phase 5
Web application

### Phase 6
Mobile application

### Phase 7
Real-time
- Socket.IO
- Chat
- Notifications

### Phase 8
Location/maps

### Phase 9
Admin panel

### Phase 10
Testing, security, optimization and deployment

After each phase, ensure the application still runs correctly before moving forward.

---

# 32. Final Requirement

The final product should feel like a **real cross-platform PetCo startup application**, not merely a conversion of an existing website.

The most important requirement is:

**ONE backend + ONE PostgreSQL database + WEB CLIENT + NATIVE MOBILE CLIENTS.**

The web and mobile applications must remain synchronized through the backend.

Start by creating the project architecture and database schema. Then implement the application phase by phase.

Before making major architectural decisions, inspect the existing requirements in this prompt and choose the simplest scalable solution.

Do not ask me to manually create every file one by one. Create the required project structure and implementation yourself, and keep the code runnable after each phase.
