# Reference redesign verification

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
