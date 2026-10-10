# PawCo — In-Page Authentication Modal Redesign

Redesign PawCo's authentication experience based on the interaction pattern in the attached Zepto screenshot. Use it as a UX reference, not as a pixel-for-pixel design to copy.

## 1. Core requirement

Currently, clicking Login opens a dedicated full-page login screen. Replace this normal login experience with a polished modal overlay displayed on top of the existing PawCo page.

When a guest clicks Login:
- Keep the current page visible behind the modal.
- Add a translucent dark overlay to the background.
- Display a centered authentication modal with a subtle entrance animation.
- Allow dismissal through a close button, clicking outside the modal, or pressing Escape on desktop.
- Do not navigate to a separate login page during normal login interactions.
- Preserve the underlying page, browsing state, and scroll position.

## 2. Modal design

Create a premium consumer-app experience inspired by the usability of Zepto and Urban Company while maintaining PawCo's own branding.

**Desktop**
- Use a balanced two-column layout when sufficient space is available.
- Left side: PawCo branding, attractive pet imagery, and concise value proposition such as "Trusted care for your best friend."
- Right side: authentication form.
- Include a visible close button in the top-right corner.
- Use a refined white or warm-neutral surface, restrained teal accents, readable typography, and subtle shadows.
- Keep the modal compact, polished, and easy to scan.

**Mobile**
- Use a single-column layout.
- Hide or simplify the decorative panel when space is limited.
- Fit the modal within the available viewport, accounting for safe areas and the on-screen keyboard.
- Allow internal scrolling when necessary.
- Keep the close button and form controls accessible.

Do not copy Zepto's logo, branding, exact layout, illustrations, or distinctive visual identity. Create a recognizable PawCo design.

## 3. Authentication form

Include:
- Email address.
- Password with show/hide control.
- Sign In button.
- Forgot Password link if supported.
- Create Account link.
- Validation and helpful authentication errors.
- Loading and disabled states during requests.

Remove all demo sign-in buttons, demo account shortcuts, and demo credentials from the user-facing authentication interface.

Use the existing authentication API. Do not introduce fake login logic or hardcoded credentials.

## 4. Registration and password recovery

Clicking Create Account should switch to the registration form within the modal wherever practical, without unnecessarily navigating away.

Support the existing customer/owner and helper registration flows. Admin accounts must remain restricted to the existing secure provisioning process.

Provide a clear way to switch between Sign In and Create Account.

Integrate password recovery into the modal flow if the existing authentication architecture supports it. Preserve existing validation and security checks.

## 5. Login entry points and protected actions

Make the modal available from the main navigation Login action and other appropriate authentication entry points.

For guests:
- Allow public browsing wherever supported.
- When a guest initiates a protected action, open the login modal instead of unexpectedly redirecting to a separate login page.
- After successful authentication, resume the intended action or return to the relevant page where practical.
- Use safe return destinations and never redirect to untrusted external URLs.

For example, if a guest tries to book pet care, prompt them to authenticate and continue the booking flow after login when possible.

For authenticated users, show an account/profile action instead of Login.

Do not expose protected pages or weaken role-based authorization to support guest browsing.

## 6. Technical implementation

First inspect the existing Next.js App Router structure, login page, navigation component, authentication provider/context, registration flow, and route guards.

Then:
- Implement a reusable authentication modal controlled by application state.
- Connect it to the existing authentication API and shared authentication state.
- Ensure navigation and protected actions can open it consistently.
- Move focus into the modal when opened and return focus to the triggering element when closed.
- Trap keyboard focus while open.
- Prevent background interaction and restore background scrolling correctly.
- Avoid hydration errors and unnecessary global state.
- Reuse the current styling framework and animation dependencies wherever possible.
- Keep a dedicated authentication route as a fallback for direct navigation, password reset links, and entry points that require it.

Inspect the Expo React Native application separately. Implement a matching native login modal or bottom sheet using native navigation and interactions. Do not use a WebView for mobile authentication.

## 7. Strict testing instructions — DO NOT USE DOM AUTOMATION

My development environment has a problem where automated DOM/browser-based testing gets stuck or takes too long.

**Do not run DOM automation or browser-driven UI tests. Do not use browser agents, Playwright, Puppeteer, Selenium, or any tool that launches a browser and interacts with the page DOM. Do not repeatedly retry a hanging test.**

Instead, follow this workflow:

1. Inspect the relevant source files and existing implementation.
2. Implement the modal and authentication integration.
3. Review the modified code directly.
4. Run only quick, non-interactive checks that are already supported by the project, such as targeted TypeScript checks, linting, or a build if it completes within a reasonable time.
5. If a check hangs, stop it and report the issue. Do not keep retrying it or launch DOM testing as a fallback.
6. Do not run full end-to-end suites, start unnecessary browser instances, or spend time waiting for automated visual interaction.
7. Verify implementation through code inspection, existing unit tests that do not require a browser, and API-level checks only when they can run quickly and safely without changing real user data.
8. Clearly distinguish checks that passed from behavior that still needs manual verification.

Do not claim that the modal has been visually or interactively tested if it has not.

## 8. Acceptance criteria

Implement the following behavior and verify it through code inspection and appropriate fast checks:

- Login opens a modal without replacing the underlying page.
- Closing the modal preserves the page and its scroll position.
- Close button, outside click, and Escape handling are implemented correctly where applicable.
- Authentication uses the existing backend.
- Registration and password recovery use supported existing flows.
- Login errors and loading states are handled properly.
- Successful authentication updates navigation and closes the modal.
- Protected actions can request authentication without bypassing authorization.
- No demo sign-in controls remain in the authentication UI.
- Responsive desktop and mobile layouts are implemented.
- The native app uses an appropriate native authentication experience.
- Existing functionality and role-based security remain intact.

Make the changes directly in the existing codebase without rebuilding the project from scratch.

At the end, provide a concise summary of files changed, implementation details, checks actually completed, any errors encountered, and the steps I should manually try in the running application.
