# Mistral AI and trusted research

## Connect the services

1. Complete `SUPABASE_SETUP.md`, including the account profile migration. AI requires a real signed-in Supabase user with a completed Student/Registered Psych account type. Development demo accounts remain available for UI work but cannot call paid AI services.
2. Apply `supabase/migrations/202611010002_ai_limits.sql`. It adds atomic per-user limits: 8 requests per UTC minute and 60 per UTC day. Search may make multiple Mistral calls within one request. Adjust limits in the database function to fit your beta budget; monitor your Mistral account usage too.
3. Get a Mistral API key from your Mistral account. Add the key to `MISTRAL_API_KEY` in the root `.env.local`, alongside your Supabase settings. There is one actual environment file; `.env.example` is its blank template. These values are **server secrets**, not frontend `VITE_` variables. Never use the Supabase service-role key in the browser.
4. Set `ALLOWED_ORIGINS` to your exact app origins, comma-separated, including your production HTTPS origin. Do not use `*`. Local origins are needed only while testing locally. The models are configurable with `MISTRAL_MODEL` and `MISTRAL_SEARCH_MODEL`; defaults are `mistral-small-latest` and `mistral-medium-latest`.
5. With the Supabase CLI authenticated and your project linked, run:

```powershell
supabase secrets set --env-file .env.local
supabase functions deploy psykie-ai
supabase functions deploy psykie-research
```

The functions use Supabase's provided `SUPABASE_URL` and `SUPABASE_ANON_KEY` to verify the user JWT and read the caller's profile under RLS. The gateway JWT check is disabled in `supabase/config.toml` because the handler performs explicit verification with Supabase Auth. This is **not** an anonymous AI endpoint: unauthenticated requests, incomplete profiles, disallowed browser origins, and quota failures are rejected before Mistral is called.

No Mistral key, Supabase project credentials, or deployment access was supplied during implementation. Live service calls and the SQL migration must be verified against your actual project after configuration. Tests use mocked network responses; they do not establish answer quality or live provider availability.

## What is connected

The study generator accepts topics/instructions, pasted text, or one uploaded PDF, DOCX, TXT, Markdown, or CSV file. Combine topics with material to focus the generated cards on selected concepts. Files are parsed locally; only the editable extracted text and instructions are sent when Generate draft is clicked. Limits: 10 MB per file, 100 PDF pages, 25,000 combined characters, and 1–20 flashcards per request. Long documents are rejected rather than silently truncated. Scans without selectable text require OCR elsewhere before import. Uploading replaces the source material; changing inputs discards the previous draft. Preview and Save create a new study deck.

After updating the generation prompt, redeploy `psykie-ai` with the command above. No new API keys or database migrations are required for document imports. Parser references: [PDF.js](https://mozilla.github.io/pdf.js/getting_started/) and [Mammoth raw text extraction](https://github.com/mwilliamson/mammoth.js#extractrawtextinput).

- **Mindy**: server-side Mistral chat completions with recent conversation history. Chats persist separately per account. Note questions carry a bounded excerpt through navigation state, not a large private note in the URL. A retry after failure does not duplicate the user message. Chat does not pretend to browse: current-source questions are directed to Research.
- **Notes**: AI summaries save as new notes, preserving originals. AI flashcards can be generated from the selected note. The existing line-to-card conversion remains a separate local action.
- **Flashcards**: generate from a topic or pasted text, preview, then save a real deck with individual cards.
- **Quizzes**: generate questions, four options, correct-answer indexes, and explanations. Saved quizzes use those generated questions rather than substituting the local flashcard bank. Existing local practice remains available.
- **Research**: topic-focused web search, exact source-domain filtering, a second relevance pass, reading list, collections, and AI summaries of text the user pastes. No arbitrary full-paper URL fetch or automatic full-paper reading is claimed.

Drafts must be explicitly saved. Error/refusal/truncation or invalid structured output never creates study content. The frontend sends selected source text, the requested category/count, or the active conversation; it does not silently upload the whole workspace or client records. Mistral is the external processor. Do not use identifying clinical records as study prompts.

## How Research works

1. Mistral checks whether the query concerns psychology, mental health, neuroscience, assessment, or related research methods. Out-of-scope queries return an explanation and no results.
2. The Mistral Conversations API uses the `web_search` tool with a psychology-specific query and source instructions. Conversations use `store: false`.
3. Only actual `tool_reference` chunks from the web-search response are eligible. URLs mentioned solely in generated prose are ignored. HTTPS, hostname/subdomain boundaries, credentials, and ports are checked against the fixed allowlist in `supabase/functions/_shared/contracts.ts`.
4. A structured relevance pass can select only indexes from that retrieved, allowed list. It cannot add URLs. Tangential matches are excluded. If nothing passes, the app says so rather than falling back to unrestricted search.
5. Cards show the source, link, retrieval date, source category, and an AI relevance explanation. Source inclusion is not a factual guarantee and does not certify every article as peer reviewed. Publisher domains can host editorial, news, and other page types. Always inspect the original source and publication context.

The initial source policy includes APA, APS, BPS, NIMH, WHO, NICE, NHS, PubMed/PMC, Cochrane, Nature, and Science. It is intentionally a curated list, not a claim to cover all relevant research. Review and amend the list for your institution's needs. Mistral organization admins can also configure a web-search allowlist so blocked domains are removed before the model sees them. The application server's post-retrieval filter remains active independently of that setting.

Manual references appear only in the personal saved library; adding one does not make its domain approved for search. Saved references and study content remain browser-local; Supabase cloud content sync is not implemented by this change.

## Checks

```powershell
npx tsc --noEmit
npx tsc -p tsconfig.functions.json
npm run lint
node scripts/check-ai-backend.mjs
node scripts/run-ai-ui.cjs
```

Backend checks run the shared handler with mocked authentication/Mistral fetches and test auth, CORS, quotas, input/output validation, missing configuration, off-topic queries, actual-reference provenance, relevance, and domain spoofing. The UI launcher starts an isolated Vite server with test-only Supabase configuration on port 5174, intercepts Supabase/AI network responses, and stops the server when checks finish. They verify chat persistence, draft review/save, preservation of source notes, generated quiz questions, error/retry, source filtering, saved collections, and 320/390/768/1440px Research layouts. Results are in `artifacts/ai/frontend-results.json`.

SQL policies, concurrent quota enforcement in Postgres, real Mistral output quality, provider billing, and live search recall still require integration testing in your configured project.

Official references: [Mistral chat](https://docs.mistral.ai/api/endpoint/chat), [structured outputs](https://docs.mistral.ai/studio/conversations/structured-output/custom), [web search and references](https://docs.mistral.ai/studio/agents/agent-tools/websearch), [Conversations API](https://docs.mistral.ai/api/endpoint/beta/conversations), [Supabase authenticated Edge Functions](https://supabase.com/docs/guides/functions/auth-legacy-jwt).
