# PetCo — Feature Expansion: Customer, Helper & Admin Ecosystem

The PetCo cross-platform application is already set up.

We now need to expand the product into a complete **pet-care marketplace platform** with three distinct account types:

1. **Customer / Pet Owner**
2. **Helper / Pet Care Provider**
3. **Admin**

The application must continue to work across:

- Web
- Android
- iOS

All three account types must use the same backend and PostgreSQL database.

Do NOT create separate backends or databases.

---

# 1. THREE ACCOUNT TYPES

The platform must have exactly three primary roles:

```text
CUSTOMER
   ↓
Creates pet-care requests
   ↓
HELPER
   ↓
Accepts / manages requests
   ↓
ADMIN
   ↓
Oversees entire platform
```

Roles:

```text
CUSTOMER
HELPER
ADMIN
```

Implement proper role-based access control at the backend level.

Do NOT rely only on frontend route protection.

A user must never be able to access APIs or data belonging to another role unless explicitly authorized.

---

# 2. CUSTOMER / PET OWNER

The customer is someone who owns one or more pets and wants to request pet-related services.

## Customer Registration

Allow registration with:

- Name
- Email
- Phone number
- Password
- Profile photo
- Address/location

During onboarding, ask:

> "What do you need help with?"

Allow multiple selections.

Examples:

- Pet walking
- Pet sitting
- Feeding
- Grooming
- Veterinary care
- Medicine
- Pet boarding
- Transportation
- Emergency assistance
- Other

---

# 3. CUSTOMER PET MANAGEMENT

Customers should be able to create and manage multiple pets.

Pet profile:

- Pet name
- Species
- Breed
- Age
- Gender
- Weight
- Profile photo
- Medical conditions
- Allergies
- Vaccination information
- Current medications
- Special instructions
- Behaviour notes
- Emergency notes

Example:

```text
Bruno
Golden Retriever
Age: 4
Weight: 28 kg

Medical Conditions:
Hip dysplasia

Medication:
Joint supplement

Allergies:
Chicken

Special Instructions:
Do not let him run excessively.
```

Allow customers to edit/delete pets.

---

# 4. CUSTOMER SERVICE REQUEST SYSTEM

This is one of the most important features.

Customers should have a prominent:

**"Request Help"**

button.

When clicked, show a service selection screen.

## Service Categories

Include:

### Basic Care
- Dog Walking
- Pet Sitting
- Feeding
- Grooming
- Bathing
- Pet Boarding

### Medical / Health
- Vet Consultation
- Vet Visit Assistance
- Medicine Pickup
- Medicine Administration
- Post-Surgery Care
- Health Check Assistance

### Transportation
- Vet Transportation
- Pet Pickup/Drop
- Emergency Transportation

### Emergency
- Emergency Vet Assistance
- Emergency Check-in
- Lost Pet Assistance

### Other
- Custom Request

Make the service list extensible so new categories can be added later.

---

# 5. CUSTOM REQUEST

Customers must be able to create a completely custom request.

Example:

> "My dog needs medicine every 6 hours while I'm away for two days."

The customer should provide:

- Service type
- Description
- Pet
- Date
- Start time
- End time
- Frequency if applicable
- Location
- Budget
- Additional instructions
- Photos/documents if required

---

# 6. MEDICINE REQUESTS

For medicine-related services, collect additional information.

Fields:

- Medicine name
- Dosage
- Frequency
- Start date
- End date
- Instructions
- Prescription upload if required
- Vet information

Example:

```text
Medicine:
Amoxicillin

Dosage:
1 tablet

Frequency:
Every 8 hours

Duration:
5 days
```

IMPORTANT:

PetCo should NOT diagnose medical conditions.

The platform is only helping users connect with helpers/vets and manage instructions supplied by the customer.

---

# 7. VET SERVICES

Customers should be able to request veterinary assistance.

Options:

- Find nearby vet
- Book/request vet assistance
- Request transportation to vet
- Request helper to accompany pet to vet
- Upload medical documents
- Add symptoms/notes supplied by the owner
- Add preferred date/time

For emergency requests, display an appropriate emergency notice and encourage users to contact emergency veterinary services directly when necessary.

Do not present PetCo as a replacement for professional veterinary care.

---

# 8. CUSTOMER REQUEST STATUS

Every request should have a clear lifecycle.

```text
DRAFT
   ↓
OPEN
   ↓
HELPER INTERESTED / ACCEPTED
   ↓
CONFIRMED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

Alternative outcomes:

```text
CANCELLED
EXPIRED
REJECTED
DISPUTED
```

Customers should always be able to see the current status.

---

# 9. CUSTOMER REQUEST HISTORY

Create:

**My Requests**

with tabs:

- Active
- Upcoming
- Completed
- Cancelled

Each request card should show:

- Pet
- Service
- Date
- Time
- Location
- Status
- Assigned helper
- Price
- Actions

---

# 10. HELPER ACCOUNT

Helpers are people who provide pet-care services.

Helper registration should collect:

- Name
- Email
- Phone
- Password
- Profile photo
- Address/location
- Date of birth
- Bio
- Experience
- Skills
- Services provided
- Service radius
- Availability
- Pricing

---

# 11. HELPER VERIFICATION

Helpers should have a verification process.

Collect where appropriate:

- Government ID
- Profile photo
- Experience information
- Certifications
- Veterinary/pet-care certifications if applicable
- Background verification status

Possible statuses:

```text
PENDING
UNDER_REVIEW
VERIFIED
REJECTED
SUSPENDED
```

Only verified helpers should be prominently shown as verified providers.

Display:

**✓ Verified Helper**

on verified profiles.

Admin must control verification.

---

# 12. HELPER SERVICES

Helpers should choose which services they provide.

Examples:

- Dog Walking
- Pet Sitting
- Feeding
- Grooming
- Boarding
- Medicine Assistance
- Vet Assistance
- Pet Transportation
- Emergency Assistance

They can specify pricing per service.

Example:

```text
Dog Walking
₹300 / hour

Pet Sitting
₹800 / day

Vet Assistance
₹500 / visit
```

---

# 13. HELPER AVAILABILITY

Helpers should be able to set:

- Available / unavailable
- Working days
- Working hours
- Service radius
- Maximum bookings per day

Example:

```text
Monday
6:00 AM – 10:00 AM
5:00 PM – 9:00 PM
```

Customers should not be able to book unavailable helpers.

---

# 14. HELPER REQUEST FEED

This is the main helper feature.

Create:

**Nearby Requests**

The helper should see requests matching:

- Their services
- Their availability
- Their service radius
- Their location

Each request should show:

```text
🐕 Dog Walking

Golden Retriever
3 years old

Distance:
2.4 km

Date:
Tomorrow

Time:
6:00 PM

Budget:
₹400

Location:
Approximate location only

[View Details]
```

Do NOT expose the customer's exact address before the booking is confirmed unless necessary.

---

# 15. HELPER REQUEST FILTERS

Allow helpers to filter requests by:

- Distance
- Service
- Date
- Time
- Budget
- Pet type
- Emergency
- Newest
- Highest paying

---

# 16. ACCEPTING REQUESTS

Helpers can:

- Accept request
- Decline request
- Send an offer
- Suggest a different price
- Suggest another time

When a helper accepts:

```text
Request
   ↓
Helper accepts
   ↓
Customer notified
   ↓
Customer confirms
   ↓
Booking created
```

Do not automatically expose sensitive customer information before confirmation.

---

# 17. CUSTOMER ↔ HELPER CHAT

Once a request reaches an appropriate stage, allow customer and helper to communicate.

Chat features:

- Text
- Images where appropriate
- Timestamp
- Read status
- Online status
- Real-time messages
- Report conversation
- Block user

Use Socket.IO for real-time communication.

---

# 18. BOOKING MANAGEMENT

Create a proper booking entity.

A booking connects:

```text
Customer
+
Pet
+
Helper
+
Service
+
Request
+
Date/Time
+
Price
```

Both customer and helper should see the booking.

Customer:

```text
Upcoming Booking
───────────────
Bruno
Dog Walking
Rahul
Tomorrow
6:00 PM
₹400
```

Helper sees the same booking from their dashboard.

---

# 19. START / COMPLETE SERVICE

Helper should be able to:

**Start Service**

and later:

**Complete Service**

The customer should receive real-time updates.

Possible lifecycle:

```text
CONFIRMED
    ↓
HELPER_ON_THE_WAY
    ↓
SERVICE_STARTED
    ↓
SERVICE_COMPLETED
    ↓
CUSTOMER_CONFIRMED
```

Do not make every status mandatory if it doesn't make sense for a particular service.

---

# 20. CUSTOMER REVIEWS

After completion:

Customer can rate helper:

⭐ 1–5

and leave:

- Review
- Comments
- Optional service-specific feedback

Helpers should also be able to review customers where appropriate.

Prevent users from submitting unlimited reviews for the same booking.

---

# 21. ADMIN ACCOUNT

The admin is the platform operator.

Admin should have a completely separate dashboard.

Admin must be able to see an overview of everything happening on PetCo.

Dashboard should include:

### Platform Statistics

- Total users
- Total customers
- Total helpers
- Verified helpers
- Pending verifications
- Active requests
- Active bookings
- Completed bookings
- Cancelled bookings
- Revenue
- Platform growth
- New users
- New requests

Use charts and graphs where appropriate.

---

# 22. ADMIN USER MANAGEMENT

Admin can:

- View all users
- Search users
- Filter by role
- View customer profile
- View helper profile
- Suspend account
- Reactivate account
- Delete account where appropriate
- View activity
- View complaints/reports

---

# 23. ADMIN HELPER VERIFICATION

Create a dedicated:

**Helper Verification**

section.

Admin sees:

```text
Rahul Sharma
Pet Care Experience: 3 years

Documents:
✓ Government ID
✓ Certification

Status:
PENDING

[Review]
```

Admin can:

- Approve
- Reject
- Request more information
- Suspend verification

Maintain an audit trail.

---

# 24. ADMIN REQUEST MONITORING

Admin should see every request.

Filters:

- Open
- Accepted
- Active
- Completed
- Cancelled
- Emergency
- Disputed

Admin can open a request and see:

- Customer
- Pet
- Helper
- Service
- Location
- Date
- Price
- Status
- Timeline
- Related messages
- Reports

---

# 25. ADMIN BOOKING MONITORING

Admin should be able to see:

- Upcoming bookings
- Active bookings
- Completed bookings
- Cancelled bookings
- Disputed bookings

Provide search/filter functionality.

---

# 26. ADMIN LIVE ACTIVITY

Create a section showing recent platform activity.

Example:

```text
10:42 PM
Rahul accepted a Dog Walking request

10:39 PM
Amit created a Vet Assistance request

10:35 PM
New helper registration: Priya

10:31 PM
Booking completed

10:25 PM
New review submitted
```

This gives the admin a real-time overview of what is happening.

Use Socket.IO for live updates where appropriate.

---

# 27. ADMIN EMERGENCY MONITORING

Emergency requests should be visually prioritized.

For example:

```text
🚨 EMERGENCY REQUEST

Pet:
Bruno

Service:
Emergency Vet Assistance

Location:
Mumbai

Status:
Searching for helper

Created:
2 minutes ago
```

Admin should be able to monitor unresolved emergency requests.

Again, PetCo must not present itself as a replacement for emergency veterinary services.

---

# 28. REPORTING SYSTEM

Allow users to report:

- Another user
- Helper
- Customer
- Inappropriate behaviour
- Fraud
- Unsafe behaviour
- Fake profile
- Other issue

Admin should receive these reports.

Report statuses:

```text
OPEN
UNDER_REVIEW
RESOLVED
DISMISSED
```

---

# 29. ADMIN AUDIT LOG

Create an audit log for important administrative actions.

For example:

```text
Admin:
admin@petco.com

Action:
Approved helper

User:
Rahul Sharma

Timestamp:
08 Oct 2026, 11:20 PM
```

Track:

- Verification changes
- Suspensions
- User deletions
- Booking intervention
- Report resolution
- Important configuration changes

---

# 30. SEARCH

Implement global search appropriate to each role.

Customer can search:

- Helpers
- Services
- Pets
- Bookings

Helper can search:

- Requests
- Customers where permitted
- Bookings

Admin can search:

- Users
- Helpers
- Requests
- Bookings
- Reports

---

# 31. SMART MATCHING

Eventually implement a helper recommendation system.

When a customer creates a request, rank helpers based on:

1. Service compatibility
2. Distance
3. Availability
4. Rating
5. Experience
6. Price
7. Verification status

Example:

```text
Recommended Helpers

1. Rahul
⭐ 4.9
📍 1.2 km
✓ Verified
₹350

2. Priya
⭐ 4.8
📍 2.1 km
✓ Verified
₹400
```

Build the backend in a way that allows this matching algorithm to evolve later.

---

# 32. Notifications

Implement notifications for all important events.

Customer:

- Helper accepted request
- Booking confirmed
- Helper arriving
- Service started
- Service completed
- New message
- Review reminder

Helper:

- New nearby request
- Customer accepted offer
- Booking confirmed
- Upcoming booking
- New message
- Review

Admin:

- New helper registration
- Verification pending
- Emergency request
- New report
- Dispute
- Important platform event

Support:

- In-app notifications
- Push notifications on mobile
- Browser notifications where supported

---

# 33. Privacy & Security

Because PetCo deals with personal information and pet/medical information:

Implement strong access control.

Customers can only access:

- Their own pets
- Their own requests
- Their own bookings
- Their own conversations

Helpers can only access information necessary for their assigned/requested services.

Admins can access platform-wide information.

Do not expose:

- Passwords
- Authentication tokens
- Sensitive documents
- Exact location unnecessarily
- Private medical information unnecessarily

Use secure API authorization.

---

# 34. Database Changes

Extend the PostgreSQL/Prisma schema to support all of these features.

Likely entities:

```text
User
CustomerProfile
HelperProfile
Pet
ServiceCategory
ServiceRequest
RequestAttachment
Booking
BookingStatusHistory
Review
Message
Conversation
Notification
Report
HelperVerification
Availability
Location
Payment
AuditLog
```

Use proper relationships and indexes.

Avoid creating unnecessary duplicate data.

---

# 35. Important UX Principle

The application should feel different depending on the role.

Customer:

> "I need help with my pet."

Helper:

> "I want to find work and help pets."

Admin:

> "I need to understand and control what's happening on the platform."

Do not create one generic dashboard with slightly different text.

Each role should have a purpose-built experience.

---

# 36. Mobile Navigation

Customer mobile navigation:

```text
Home
Requests
Bookings
Messages
Profile
```

Helper mobile navigation:

```text
Home
Nearby Jobs
Bookings
Messages
Profile
```

Admin mobile:

```text
Dashboard
Users
Requests
Bookings
Reports
More
```

The web dashboard can use a sidebar.

---

# 37. Final Product Flow

The ideal customer flow:

```text
Sign Up
   ↓
Add Pet
   ↓
Request Help
   ↓
Choose Service
   ↓
Add Details
   ↓
Choose Location
   ↓
Set Date/Time
   ↓
Set Budget
   ↓
Submit
   ↓
Nearby Helpers See Request
   ↓
Helper Accepts / Makes Offer
   ↓
Customer Confirms
   ↓
Booking Created
   ↓
Chat
   ↓
Helper Arrives
   ↓
Service Starts
   ↓
Service Completed
   ↓
Customer Reviews Helper
```

Helper flow:

```text
Sign Up
   ↓
Create Helper Profile
   ↓
Submit Verification
   ↓
Admin Approves
   ↓
Set Services + Availability
   ↓
See Nearby Requests
   ↓
Accept / Offer
   ↓
Customer Confirms
   ↓
Booking
   ↓
Chat
   ↓
Complete Service
   ↓
Receive Review
```

Admin flow:

```text
Login
   ↓
Admin Dashboard
   ↓
Monitor Platform
   ├── Users
   ├── Helpers
   ├── Verification
   ├── Requests
   ├── Bookings
   ├── Emergency Requests
   ├── Reports
   ├── Reviews
   └── Analytics
```

---

# 38. Implementation Requirements

Do not implement this as a collection of static screens.

All important flows must be connected to the actual backend and PostgreSQL database.

For every feature:

```text
UI
 ↓
API
 ↓
Controller/Service
 ↓
Prisma
 ↓
PostgreSQL
```

Use real data.

Use Socket.IO where real-time updates are required.

Use proper loading, empty, success and error states.

Make the application responsive and accessible.

---

# 39. Development Approach

First inspect the existing PetCo codebase and understand what has already been implemented.

Do not unnecessarily rewrite working functionality.

Then implement the new functionality in logical phases:

### Phase 1
Three-role authentication and authorization.

### Phase 2
Customer profile + pets.

### Phase 3
Service categories + customer request creation.

### Phase 4
Helper profile + verification + availability.

### Phase 5
Nearby request marketplace.

### Phase 6
Booking and request lifecycle.

### Phase 7
Customer-helper chat + real-time updates.

### Phase 8
Notifications.

### Phase 9
Admin dashboard + monitoring.

### Phase 10
Reports + verification + audit logs.

### Phase 11
Location/matching improvements.

### Phase 12
Testing, security, responsive UI and production cleanup.

After each phase, make sure the project still builds and runs.

Do not leave partially implemented buttons or fake functionality.

If a feature is not implemented yet, do not present it as functional.

---

# 40. Overall Goal

The final PetCo product should be a **complete hyperlocal pet-care marketplace**, not simply a pet information website.

The three roles must work together:

CUSTOMER
→ creates a need

HELPER
→ fulfills the need

ADMIN
→ oversees the ecosystem

The same PetCo platform must work seamlessly across:

**Android + iOS + Web browsers**

using:

**One backend + One PostgreSQL database + One authentication system.**

Prioritize a clean architecture, excellent UX, security, scalability and maintainability.