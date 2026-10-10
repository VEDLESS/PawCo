# PetCo UI/UX redesign — premium, responsive pet-care marketplace

Redesign the existing PetCo application to make it visually appealing, intuitive, accessible, and production-quality. The current core functionality is mostly working, so improve the existing implementation rather than rebuilding the project.

#### Visual direction
- Create a premium, warm, friendly pet-care brand identity.
- Use a refined palette of forest green/teal, warm ivory, white, subtle neutrals, and restrained accent colors.
- Use strong typography hierarchy, consistent spacing, rounded cards, subtle shadows, tasteful transitions, and high-quality pet imagery.
- Avoid excessive whitespace, oversized headings, crowded layouts, excessive borders, and generic template styling.
- Use consistent design tokens for colors, spacing, typography, radii, shadows, and interactive states.

#### Customer experience
- Improve the home page with a compelling hero, clear primary action to book care, service categories, trusted helper profiles, and an upcoming-bookings section.
- Make the pet profile cards visually engaging and easy to scan.
- Redesign the request wizard into simple, intuitive steps with clear labels, validation, Back/Continue controls, and a persistent progress indicator.
- Make medical details, medication instructions, emergency information, budget, date, time, and location easy to enter.
- Improve the review screen with a clear summary, pet details, schedule, location, budget, and an obvious final submission button.
- After successful submission, show a polished confirmation screen with the request ID, status, and next steps.
- Show friendly loading, empty, error, and success states. Never show a success state when the API call fails.

#### Helper experience
- Create a visually clear job feed with useful filters and prominent service, pet, schedule, location, and budget details.
- Make accepting jobs, declining them, submitting offers, editing availability, and managing bookings straightforward.
- Display verification status and reviews clearly.

#### Admin experience
- Improve dashboard hierarchy and make metrics easy to scan.
- Create consistent tables, filters, search, pagination, status indicators, and responsive tab navigation.
- Clearly distinguish pending verifications, emergencies, open reports, and completed actions.
- Use confirmation dialogs for destructive or sensitive actions.

#### Responsive and accessibility requirements
- Support mobile, tablet, and desktop layouts.
- Ensure sidebars collapse appropriately on smaller screens and forms remain usable on phones.
- Use accessible contrast, readable font sizes, visible keyboard focus, descriptive form labels, and clear validation messages.
- Maintain consistent navigation and visual language across Customer, Helper, and Admin portals.

#### Engineering constraints
- Inspect the existing codebase and reuse its current framework, components, and styling system.
- Preserve all existing working features, API contracts, authentication, role-based permissions, database operations, and Socket.IO behavior.
- Do not replace live data with mock data or modify database schemas unnecessarily.
- Refactor shared UI components where beneficial instead of duplicating styles.
- Avoid adding large dependencies unless necessary.
- Test every role and the complete customer request flow after redesign.
- Fix any regressions introduced by the changes.

Implement the redesign in phases, starting with shared design tokens, typography, buttons, cards, inputs, navigation, and layout. Then improve the customer request flow, helper portal, admin portal, and public landing page. Run the available checks and summarize the files changed and features verified.
