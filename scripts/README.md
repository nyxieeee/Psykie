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
