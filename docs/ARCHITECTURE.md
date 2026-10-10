# PetCo Architecture & Technical Specification

## 1. Relational Database Schema (Prisma PostgreSQL)

- **User**: Core authentication, role (`OWNER`, `HELPER`, `ADMIN`), contact, GPS coordinates, suspension status.
- **HelperProfile**: 1-to-1 extension of User for helpers, bio, hourly rate, coverage radius in km, services array, verification status (`PENDING`, `VERIFIED`, `REJECTED`), rating, review count.
- **Pet**: Owner foreign key, species, breed, age, gender, medical/dietary notes, photo.
- **ServiceRequest**: Owner, Pet, ServiceType (`DOG_WALKING`, `PET_SITTING`, `FEEDING`, `GROOMING`, `PET_BOARDING`, `MEDICATION_ASSISTANCE`, `EMERGENCY_CHECK_IN`, `OTHER`), schedule date/time, coordinates, budget, status (`OPEN`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- **Booking**: Links Request, Owner, and Helper. Status lifecycle (`CONFIRMED` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
- **Review**: Rating (1-5), comments, automatically updates helper's aggregate score.
- **Message**: 1-on-1 chat associated with a booking thread.
- **Notification**: Real-time event notifications delivered via Socket.io.
- **RefreshToken**: Secure token rotation with 7-day expiration.

---

## 2. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /register`: Create Pet Owner or Helper account
- `POST /login`: Authenticate and receive JWT access & refresh tokens
- `POST /refresh`: Rotate refresh token and issue fresh access token
- `POST /logout`: Invalidate refresh token

### Users (`/api/users`)
- `GET /me`: Authenticated user profile with role details
- `PUT /me`: Update profile details, coordinates, or profile photo
- `GET /:id`: Fetch public user profile

### Pets (`/api/pets`)
- `POST /`: Add a pet profile (validated with Zod)
- `GET /`: Get current owner's pets
- `GET /:id`: Get specific pet details
- `PUT /:id`: Update pet details & health notes
- `DELETE /:id`: Remove pet

### Helpers & Discovery (`/api/helpers`)
- `PUT /profile`: Update helper service radius, hourly rate, bio, and offered services
- `GET /nearby?latitude=..&longitude=..&radiusKm=..&serviceType=..`: Geospatial nearby verified helper search with Haversine distance computation
- `GET /search`: Search helpers by query, rating, and service type
- `GET /:userId`: View public helper profile

### Service Requests (`/api/requests`)
- `POST /`: Post a new pet care request
- `GET /my`: Get current owner's requests
- `GET /nearby`: Get open requests matching helper's services & radius
- `GET /:id`: View request details
- `PATCH /:id/status`: Update status
- `DELETE /:id`: Cancel/delete request

### Bookings (`/api/bookings`)
- `POST /`: Confirm/create a booking
- `GET /`: Get user's bookings (Owner or Helper view)
- `GET /:id`: Booking details
- `PATCH /:id/status`: Transition booking state (`IN_PROGRESS`, `COMPLETED`, `CANCELLED`)

### Chat & Messaging (`/api/messages`)
- `POST /`: Send message
- `GET /booking/:bookingId`: Retrieve conversation history
- `PATCH /booking/:bookingId/read`: Mark messages as read

### Reviews (`/api/reviews`)
- `POST /`: Submit 1-5 star review for completed booking
- `GET /user/:userId`: Get user reviews

### Admin Operations (`/api/admin`)
- `GET /stats`: Real-time marketplace KPIs, GMV & Platform fee revenue
- `GET /users`: List all platform users with filtering
- `PATCH /users/:userId/suspend`: Suspend or reactivate user
- `PATCH /helpers/:helperProfileId/verify`: Approve or reject helper verification
- `GET /requests`: System-wide requests overview
- `GET /bookings`: System-wide bookings overview

---

## 3. Real-Time WebSocket Events

- `join_room`: Join `booking:{bookingId}` or `user:{userId}`
- `new_message` / `message_received`: Instant message push
- `notification`: Live user notification push
- `helper_location_update`: Live GPS streaming during active bookings
