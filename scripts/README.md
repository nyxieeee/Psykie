# Reference redesign verification

## Long quizzes and uploaded study material

The France Notes study flow is adapted for psychology: 5–100 questions/cards, small AI batches, persisted generation checkpoints, editable question drafts, study/exam feedback, custom or preset timers up to three hours, shuffled practice, identification/fill-in questions, case/research/ethics practice, answer history, printable quizzes/results, Word downloads and reviewer PowerPoint exports. Memory aids and simpler explanations save as separate Library materials. Nursing content, medication tools and podcasts are excluded.

Supported uploads extract text automatically; scanned pages use Mistral OCR. Originals remain available. Limits: 10 MB per file, 1,000 PDF pages, 50 scanned pages and 1,000,000 source characters. OCR and generation consume the account's allowance. Requests in a long operation are spaced about eight seconds apart. Long sources are processed by section; quizzes use section summaries where needed. An exhausted allowance stops the operation with completed generation batches available for review or resumption.

Run these serially (browser scripts mock authentication and model output):

```powershell
node scripts/check-study-generation.mjs
node scripts/run-ai-ui.cjs scripts/check-long-quizzes.cjs
node scripts/run-ai-ui.cjs scripts/check-large-source.cjs
node scripts/run-ai-ui.cjs scripts/check-ocr.cjs
node scripts/run-ai-ui.cjs scripts/check-reviewer-tools.cjs
```

These cover 100-question batching, bounded requests, cancellation and resumption; a browser quiz recovering from a provider error; written answers and persistence; a real 120-page PDF; OCR; real PowerPoint downloads; and separate reviewer tools. They do not establish live model quality or available provider quota.

Start the app with `npm.cmd run dev -- --host 127.0.0.1`.

The checks use Playwright and installed Microsoft Edge. They use isolated browser contexts and the app's demo stores.

Install the browser driver separately from the app dependencies in PowerShell:

```powershell
npm.cmd install --no-save --package-lock=false --prefix "$env:TEMP/psykie-ui-check" playwright
```

Or install Playwright locally or set `PLAYWRIGHT_MODULE` to its module path.

```powershell
node scripts/check-reference-layout.cjs
node scripts/check-reference-interactions.cjs
node scripts/check-reference-effects.cjs
node scripts/check-flip.cjs
```

- Layout: twelve workspace routes at 320, 390, 768, 1024, and 1440px, plus login and registration at four widths. Checks horizontal overflow and browser errors; saves screenshots to `artifacts/reference`.
- Interactions: sign-in, notes editing/favorites/creation, deck and card creation, 3D flipping, quiz completion and filtering, research bookmarks, client notes, a real local file upload/download, calendar views, saved preferences, FAQs, Mindy messages, search, and mobile clinical navigation.
- Effects: viewport coverage, backdrop blur, sharp dialog contents, focus, scroll locking, Escape dismissal, and saved 3D page transitions across sixteen dialog flows and shared search at phone and desktop widths.
- Flip: intermediate and final 3D transforms, hidden faces, keyboard controls, reduced motion, and horizontal overflow.

`check-layout.cjs`, `check-interactions.cjs`, `check-effects.cjs`, and `check-card-creation.cjs` forward to the current reference checks.

## Workspace redesign checks

Run `npm run test:redesign` (Playwright and Microsoft Edge required). The runner starts its own local Vite server with test credentials. Auth responses are mocked, with no model requests or real account changes.

Checks all student pages at 320, 390, 768 and 1440px, clinical pages at three widths, login/registration, global DSM search handoff, appearance saving and calendar persistence/removal. Screenshots are written to ignored `artifacts/redesign/`.

The existing `check-library.cjs`, `check-ai-ui.cjs` and `check-psych-quiz.cjs` cover material reuse, OCR imports, note summaries, chat retry, flashcards, quiz timers/history and research collections. Run them through `node scripts/run-ai-ui.cjs scripts/<name>.cjs`, one at a time.

## Motion and visual polish

The shared tabs, panel entrance and modal motion adapt free patterns by Jakub Antalik from [Transitions.dev](https://transitions.dev/). Source recipes: [sliding tabs](https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/16-tabs-sliding.md), [panel reveal](https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/07-panel-reveal.md), and [modal](https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/06-modal.md). Usage is covered by the project's [license](https://github.com/Jakubantalik/transitions.dev/blob/main/LICENSE). No Pro assets or additional runtime package are used.

DSM book turns use the existing Framer Motion dependency and Psykie's own `BookTurn` component. Outgoing copies are hidden from assistive technology and removed after the turn. Perspective remains local to the book; page controls and modal positioning remain outside it. Single-page and spread modes share keyboard, scrubber, jump and contents navigation. Reduced-motion preferences update live and show pages immediately.

Run `node scripts/run-ai-ui.cjs scripts/check-motion.cjs` to check forward/back/rapid turns, spread pairing, end bounds, contents, mobile overflow, live reduced-motion changes, tab resize alignment and modal dismissal. The tests mock authentication and make no model requests. Screenshots go to ignored `artifacts/motion/`.

## Connected account workflows

Run `node scripts/run-ai-ui.cjs scripts/check-connected-workspace.cjs` for private cloud snapshot uploads/downloads, account isolation, recovery copies, failed saves, notification preferences, handwriting OCR preserving its source, and password recovery/update. Network responses are mocked and no real emails are sent. Apply `supabase/migrations/202611080001_workspace_backups.sql` before live backup use; configure auth email delivery and redirects using `GMAIL_SETUP.md`.

## France Notes pink and dark theme

`src/theme.css` uses the current theme variables from France Notes' `src/index.css`: dusty rose `#BE5B6C` with warm cream `#FBF4F2`, and rose `#D9798A` with warm charcoal `#1C1517` in dark mode. Psykie's cloud artwork, layout, and motion remain in place. Shared appearance handling migrates the old default violet accents, restores the theme before React renders, follows system color changes, and preserves a non-sensitive device preference for authentication screens. Custom accent choices remain supported.

Run `node scripts/run-ai-ui.cjs scripts/check-theme.cjs` to verify both palettes across student/clinical routes, dialogs, phone/tablet layouts, legacy defaults, system-mode changes, and sign-in appearance. Uses mocked authentication; no AI requests. Screenshots go to ignored `artifacts/theme/`.
