# Security Overview — Palengkee Demo

## Authentication & Session Management
- Passwords hashed with bcrypt (salt rounds: 10).
- JWT stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
- Session invalidation on password change.

## Authorization
- Role-based access control (BUYER, VENDOR, ADMIN) enforced in server actions and middleware.
- `requireUser`, `requireVendor`, `requireAdmin` helpers guard all protected routes.

## Data Protection
- Input validation and sanitisation via Zod schemas.
- SQL injection prevented by Prisma ORM (parameterised queries).
- No secrets committed — environment variables used throughout.

## Security Headers (via `proxy.ts`)
- HSTS (Strict-Transport-Security) — production only
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

## Demo-Specific
- `DEMO_MODE=true` disables real payments and emails.
- Synthetic sessions never write to production tables.
- Suspended users cannot log in or perform actions.

## Reporting Issues
For any security concern, please contact hello@palengkee.ph (demo address).
