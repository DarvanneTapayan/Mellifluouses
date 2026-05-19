# Security Specification - Mellifluouses

## Data Invariants
1. Projects can only be created, updated, or deleted by the administrator (Darvanne).
2. Testimonials can only be managed by the administrator.
3. Public users can read all projects and testimonials.
4. Every project must have a title, thumbnail, and video URL.
5. Every testimonial must have a name and content.

## Admin Identity
Administrated by: darvanne.tapayan@gmail.com (extracted from runtime info)

## Security Rules Plan
- `allow read: if true` for both collections.
- `allow write: if isAdmin()` for both collections.
- `isAdmin()` helper will check if user is signed in and email is `darvanne.tapayan@gmail.com`.
