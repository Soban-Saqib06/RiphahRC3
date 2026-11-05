# API: auth

Feature folder `auth`. Pages: `/auth/login`, `/auth/register`. Session design: `docs/DATA_MODEL.md` section 9. Tables: User, Session, CandidateProfile.

## POST /api/auth/register
- Access: public
- Body: `{ name: string (2-80), email: string (valid, max 190, stored trimmed and lowercase), password: string (8-72), role: "RECRUITER" | "CANDIDATE" }`
- Effects: creates the User with a scrypt hash; if role is CANDIDATE also creates an empty CandidateProfile; creates a session and sets the cookie.
- 201 `data`: `{ user: UserDTO }`
- Errors: 400 VALIDATION_ERROR, 409 EMAIL_TAKEN ("An account with this email already exists.")
- Note: recruiter self-registration is open for the demo.

## POST /api/auth/login
- Access: public
- Body: `{ email: string, password: string }`
- Effects: verifies the password, creates a session, sets the cookie, deletes the user's expired sessions.
- 200 `data`: `{ user: UserDTO }`
- Errors: 400 VALIDATION_ERROR, 401 INVALID_CREDENTIALS (same message for unknown email and wrong password: "Email or password is incorrect.")

## POST /api/auth/logout
- Access: any (also succeeds with no session)
- Body: none
- Effects: deletes the Session row, clears the cookie.
- 200 `data`: `{ loggedOut: true }`

## GET /api/auth/me
- Access: any
- 200 `data`: `{ user: UserDTO }`
- Errors: 401 UNAUTHENTICATED
