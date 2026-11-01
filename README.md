# Psykie

Psychology study and professional workspace built with React, TypeScript, Vite, Supabase Auth, and Mistral AI.

The frontend is implemented. Live authentication/AI require your own project configuration and deployment. Notes, files, cards, research saves, events, and client content currently stay in the browser; cloud content sync is not implemented.

## 1. Fill three values in one file

Open `.env.local`. If it does not exist, copy `.env.example` to `.env.local`.

| Setting | Where to get it |
| --- | --- |
| `VITE_SUPABASE_URL` | Open your project in the [Supabase dashboard](https://supabase.com/dashboard), then its **Connect** dialog. Copy the project URL. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase project **Settings > API Keys** (or Connect). Copy the **publishable** key, not the secret key. |
| `MISTRAL_API_KEY` | Open [Mistral Studio](https://console.mistral.ai), go to **API Keys**, then **Create new key**. Copy it into this field. |

Leave `VITE_SUPABASE_ANON_KEY` empty when using the publishable key. Keep the supplied model names and local allowed origins for now. Add your production app origin to `ALLOWED_ORIGINS` when hosting the app.

`.env.local` contains your actual credentials and is ignored by Git. Only `VITE_` variables are exposed to the browser; the Mistral key has no `VITE_` prefix and is used by the server functions.

Check the file without displaying any keys:

```powershell
npm install
npm run setup:check
```

## 2. Set up your Supabase project

These commands run from this project folder. `PROJECT_REF` is the project reference shown in Supabase project settings; for a standard URL `https://abcdefgh.supabase.co`, it is `abcdefgh`. Replace that placeholder before running the link command.

```powershell
npx supabase login
npx supabase link --project-ref PROJECT_REF
npx supabase db push --dry-run
```

Review the pending migrations. They create account profiles and AI request limits. If this Supabase project already has a `profiles` table or other app data, review the migrations against its schema before applying them. For a new Psykie project, apply the reviewed migrations, upload the environment settings, and deploy the two functions:

```powershell
npx supabase db push
npx supabase secrets set --env-file .env.local
npx supabase functions deploy psykie-ai
npx supabase functions deploy psykie-research
```

Google needs provider configuration under **Supabase > Authentication > Providers**. Add your app's `/auth/callback` URL under **Authentication > URL Configuration > Redirect URLs**. See [the authentication setup guide](SUPABASE_SETUP.md) for the exact steps. Email/password signup can be used independently of social-provider setup.

## 3. Run the app

```powershell
npm run dev
```

Restart Vite after changing `.env.local`. Development-only demo accounts skip signup and use empty local workspaces. AI requires a real signed-in Supabase account; demo accounts do not call paid AI services.

Optional credential connectivity check, after filling the values:

```powershell
npm run setup:check -- --live
```

This checks Supabase's public auth settings and Mistral's model-list endpoint. It does not generate AI content or prove the migrations/functions/providers are deployed correctly.

## What the integrations do

- **Supabase:** email/social sign-in, Student/Registered Psych profiles, a fixed account-type choice, and authenticated server functions.
- **Mistral:** Mindy chat, note summaries, flashcards, quizzes, and source-checked Research search.
- **Research:** only retrieved citations from the approved source list can appear; a second relevance pass filters topic matches. Source inclusion is not a guarantee of accuracy or peer review.
- **Not implemented:** cloud content sync, notification delivery, password-recovery UI, public sharing, or support messaging.

## Deploy to Vercel

Import `nyxieeee/Psykie` in Vercel using the Vite preset. Add the two public Supabase variables in Vercel; Mistral secrets remain in Supabase Edge Functions. The SPA routing configuration is included. Follow [VERCEL_SETUP.md](VERCEL_SETUP.md) for the exact environment, callback, and allowed-origin settings.

## Checks and details

```powershell
npm run build
npm run lint
npm run check:functions
npm run test:ai:backend
npm run test:ai:ui
```

AI UI tests use mocked services, not your live API keys. The test harness requires Playwright and Microsoft Edge.

- [Mistral deployment and source policy](AI_SETUP.md)
- [Supabase authentication and OAuth setup](SUPABASE_SETUP.md)
- [Beta functionality and limitations](BETA_STATUS.md)
- Planning documents: [requirements](PRD.md), [features](Feature_Specification.md), [data model](ERD.md), [data flow](DFD.md), [architecture](System_Architecture.md). These describe planned capabilities as well as current functionality; use the setup/beta guides for implementation status.

Official setup references: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Mistral API keys](https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key), [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).
