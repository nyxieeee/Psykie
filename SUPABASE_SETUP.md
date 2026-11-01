# Supabase authentication setup

The app supports Supabase email/password authentication and Google OAuth. Workspace content remains browser-local; this change does not sync notes, clients, documents, or events to Supabase.

## Connect your project

1. Create/select your Supabase project. Copy `.env.example` to `.env.local` and enter `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Older projects may use `VITE_SUPABASE_ANON_KEY` instead. Never place a service-role key or provider client secret in a `VITE_` variable.
2. Apply `supabase/migrations/202611010001_profiles.sql` in your project's SQL editor, or through the Supabase CLI migration workflow. It creates the profile table, own-profile access policies, profile creation trigger, and database rule locking the selected account type. It is intended for a project without a conflicting `public.profiles` schema. Review existing schemas before applying.
3. In Supabase Authentication > URL Configuration, set your production Site URL and add your app callback URLs to Redirect URLs. For local development add `http://localhost:5173/auth/callback` and/or `http://127.0.0.1:5173/auth/callback`, using the same host you use to start sign-in. Add the production `https://YOUR_APP_DOMAIN/auth/callback` explicitly.
4. Enable Google under Authentication > Providers. Configure their provider application credentials in Supabase, not in the frontend. Use the Supabase callback URL shown in each provider's settings for the provider application, commonly `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
5. Restart Vite after changing environment variables. Production builds need the variables set at build time. Buttons stay disabled when no Supabase URL/key is configured. A provider must also be enabled in Supabase; errors from disabled/misconfigured providers appear in the sign-in flow.

## Account type and sessions

- New social users get a profile with no role. They must choose **Student** or **Registered Psych** before opening a workspace, including through a direct URL. A failed profile save leaves the user on that screen.
- Registered Psych is stored as `professional`. It is an account type selected by the user; this implementation does not verify professional registration/licensing.
- Returning users load their saved role from Supabase. Changing browser-persisted profile data cannot change that role. The profile trigger blocks changing an existing role or resetting it to null.
- Email signup records the selected type when the profile is created. If email confirmation is enabled, users see an instruction to check their email before signing in.
- The callback uses Supabase's PKCE session handling. The app retrieves the authenticated user and the profile before opening protected routes. No OAuth token is accepted from a query-string user/role value.
- Profile name/photo updates save to Supabase. Account emails are read-only in this app. Full email-change/password-recovery UI is not part of this change.

## Development accounts

`npm run dev` shows **Development accounts** on the login page. Student and Registered Psych open immediately without signup or passwords. These accounts have stable, separate, empty local workspaces and can be used even before Supabase is configured. They do not create Supabase users or insert mock content.

The UI and demo identities are removed from production bundles by `import.meta.env.DEV`. Production rejects persisted development sessions. Browser-local email accounts are also a development fallback only; production requires Supabase.

## Verification and remaining setup

- `scripts/check-dev-auth.cjs`: dev accounts, role guards, reload, no account creation, provider buttons without configuration.
- `scripts/check-production-auth.cjs`: production bundle excludes dev account code/UI and rejects a persisted dev session. Run a production preview on port 4173.
- `scripts/check-supabase-auth.cjs`: mocked Supabase responses verify all three PKCE redirects, new-user onboarding, save failure/retry, and returning-user role restoration. It expects an isolated Vite instance on 5174 with `VITE_SUPABASE_URL=http://127.0.0.1:54321` and a test publishable key. These are test values, not deployable credentials.
- Live OAuth sign-in, email confirmation, and database policies/triggers must be verified after connecting your actual Supabase project and applying the migration. No live project or external provider accounts were modified here.

Official references: [Google](https://supabase.com/docs/guides/auth/social-sign-in/auth-google), [user profiles](https://supabase.com/docs/guides/auth/managing-user-data), [row level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
