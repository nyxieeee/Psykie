# Deploy Psykie on Vercel

Vercel hosts the frontend. Supabase hosts authentication, profiles, and the two AI Edge Functions. Mistral is called by those functions, not directly by the frontend. You can still keep all settings in one local `.env.local`; production settings must also be configured in the service that runs the corresponding code.

## 1. Import the repository

In Vercel choose **Add New > Project**, then import `nyxieeee/Psykie`.

- Framework preset: **Vite**
- Root directory: repository root (`./`)
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

`vercel.json` provides these settings and the SPA rewrite needed for direct visits/refreshes on `/notes`, `/research`, `/auth/callback`, and the other routes.

## 2. Add frontend environment variables in Vercel

Under **Project > Settings > Environment Variables**, add:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable key |

Use `VITE_SUPABASE_ANON_KEY` only for an older project that has no publishable key; otherwise leave it unset. Use the Production environment for the live deployment. Preview environments may also use these variables if you deliberately want those previews connected to this project.

Never use the Supabase secret/service-role key as a `VITE_` variable. Do not add `VITE_MISTRAL_API_KEY`. The Mistral key is a server secret. Setting `MISTRAL_API_KEY` only in Vercel will not activate the current Supabase Edge Functions.

Deploy after adding the variables. Vite reads these values at build time, so changing them requires another deployment.

## 3. Register your deployed URL in Supabase

Once Vercel gives you a URL such as `https://YOUR_APP.vercel.app`, open **Supabase > Authentication > URL Configuration**:

- **Site URL:** `https://YOUR_APP.vercel.app`
- **Redirect URL:** `https://YOUR_APP.vercel.app/auth/callback`

Use your exact production/custom domain. Keep local callback URLs only if you still develop locally. Enable Microsoft/Azure, Google, and Apple separately under **Authentication > Providers**. Their provider application callback URL is the one shown by Supabase, not the frontend callback URL. See `SUPABASE_SETUP.md`.

Preview deployments have different origins. To test OAuth or AI in a preview, add that exact preview callback to Supabase's allowed redirects and that exact origin to the function's allowed origins. Do not broadly allow all `vercel.app` tenants. Production is simplest to configure first.

## 4. Activate Mistral on Supabase

Apply the profile and AI-limit migrations and deploy the two functions using the commands in `README.md` and `AI_SETUP.md`. In **Supabase > Edge Functions > Secrets**, set:

| Name | Value |
| --- | --- |
| `MISTRAL_API_KEY` | Your Mistral API key |
| `MISTRAL_MODEL` | `mistral-small-latest` |
| `MISTRAL_SEARCH_MODEL` | `mistral-medium-latest` |
| `ALLOWED_ORIGINS` | Your exact Vercel app origin, e.g. `https://YOUR_APP.vercel.app` |

For local and production access together, make `ALLOWED_ORIGINS` a comma-separated list, for example `http://localhost:5173,http://127.0.0.1:5173,https://YOUR_APP.vercel.app`.

Alternatively, update those values in your single local `.env.local`, then upload it with `npx supabase secrets set --env-file .env.local` after linking the correct Supabase project. No actual `.env.local` is committed or uploaded to GitHub.

## 5. Verify the deployment

- Visit `/login` directly and refresh it: the app should load instead of a Vercel 404.
- Sign up or sign in. Complete the account-type choice for new social accounts.
- Open `/notes` and `/research` directly and refresh them.
- Send a Mindy question, create an AI draft, and run a Research query using a real Supabase account.
- Development demo accounts must be absent from the deployed site.

The app has not been deployed to your Vercel account by this repository change. Live authentication and AI depend on your actual Supabase/Mistral configuration. Workspace content still stays in the browser; deployment does not enable cloud content sync.

Official references: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite), [Vercel environment variables](https://vercel.com/docs/environment-variables), [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
