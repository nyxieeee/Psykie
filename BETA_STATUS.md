# Psykie beta status

## Local functionality

- Explicit Student/Registered Psych signup; duplicate account prevention; password login after reload; role-preserving profile updates; logout.
- Separate account storage for study content, client records, calendar events, research, files, and preferences.
- Empty workspaces with no seeded people, papers, cards, questions, appointments, accounts, or progress.
- Notes: creation, editing, text import, favorites, removal, and cards made from the actual note text. Each nonempty line supplies the answer; `Term: definition` supplies a specific prompt. This is text conversion, not AI generation.
- Flashcards: deck/card creation and removal, 3D flip, review scheduling, real review progress and streaks.
- Quizzes: AI practice from topics, uploaded files, or notes; psychology styles and difficulty; optional timer; saved progress; answer rationales, flags, missed-question retries, review downloads, and individual attempt history. Local flashcard-based practice remains available and snapshots the question bank. See STUDY_WORKFLOWS.md for limits, storage, and deployment.
- Calendar: study/personal events for students; clinical categories for professionals; month/week/agenda navigation; saved events and removal. Dashboard upcoming events uses the saved calendar.
- Research: curated Mistral web search with server-side source/relevance checks, a saved library, collections, personal references, and summaries from pasted text. See AI_SETUP.md.
- Documents: empty folders/vault, folder creation, actual uploaded bytes in IndexedDB, preview where supported, bookmarks, downloads, and deletion of both metadata and bytes.
- Settings: persisted profile/appearance, fixed account type, validation errors; unavailable delivery/sharing settings disabled.
- Clients: empty initial list, actual entered client records and overview notes, persistence, and student route restrictions.

Automated browser results: `artifacts/beta/results.json`. The main beta check exercises signup, empty pages, notes/cards/flip, quizzes, events, original file downloads, research, clients, persistence, account isolation, and student route guards. It checks ten routes at 320, 390, 768, and 1440 pixels. Additional edge checks verify file-byte deletion, no reseeding after deletion, invalid profile email handling, and theme application.

## Services not connected

Google OAuth is integrated through Supabase and require project keys, provider setup, and the profile migration before live use. See SUPABASE_SETUP.md. Mistral AI and curated research search are integrated and require deployed Edge Functions plus server secrets; see AI_SETUP.md. Notification delivery, password recovery UI, cloud content sync, and public sharing are not connected. No canned AI replies or simulated success responses replace these services.

With Supabase configured, authentication and account types use Supabase. Without it, browser-local accounts with salted PBKDF2 password hashes and one-click development accounts are available only in development. Production requires Supabase. Workspace content remains browser-local. Client-side route guards do not substitute for a backend. Content in browser storage is not encrypted. Use a backend with appropriate access controls before collecting real clinical records.

## Data and checks

New storage uses `psykie-beta:<account-id>:<content-key>`. Old unscoped demo caches are not imported or erased because they may also contain user-created content. Accounts from the earlier demo authentication are signed out; register a beta account to begin an empty workspace. Clearing browser/site data removes local beta accounts/content. Uploaded bytes live in the `psykie-local-documents` IndexedDB database.

Run the Vite dev server on `127.0.0.1:5173`, then `npm run test:beta` and `node scripts/check-beta-edge-cases.cjs`. The browser harness uses Playwright and installed Microsoft Edge; install Playwright locally if it is not already available. Older demo-fixture scripts predate empty account workspaces and are superseded by these beta checks. Build/typecheck: `npm run build`. Static checks: `npm run lint`.
