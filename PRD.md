# Psykie — Product Requirements Document (PRD)

| Field | Value |
|---|---|
| Product | Psykie |
| AI assistant | Mindy |
| Version | 1.1 — draft |
| Backend target | Supabase |
| Frontend observed in uploaded ZIP | React, TypeScript, Vite, React Router, Zustand |
| Status | Proposed requirements; validate against implementation |

## 1. Product overview

Psykie is a psychology-focused platform for students and psychology professionals. It combines learning organization, AI-assisted studying, board-exam preparation, research support, professional scheduling, client documentation, and reviewed clinical-reference resources.

The product should support learning and professional workflows without presenting AI output as authoritative diagnosis or replacing professional judgment.

## 2. Current codebase baseline

The uploaded ZIP contains `src/pages` for Dashboard, Mindy, Notes, Flashcards, Quizzes, Research, Calendar, Clients, Documents, Settings, Help, Login, and Register. `src/App.tsx` routes to these pages. `src/store/useMindyStore.ts` holds sessions/messages in a Zustand store and creates session IDs in memory. `MindyPage.tsx` calls `generateMindyResponse`, which selects from predefined response templates. `src/store/useAuthStore.ts` uses mock users and Zustand persistence rather than Supabase Auth. `src/utils/aiGenerator.ts` includes predefined sample content for generated notes, flashcards, and quizzes.

**Implication:** existing screens and UI patterns are a starting point, not proof of complete end-to-end features. Supabase Auth, persisted chat history, live AI-provider integration, trusted-source retrieval, and secure professional records must be verified or implemented. Do not remove working UI until replacement workflows are tested.

## 3. Problem statement

Students need one place to organize coursework, learn psychology concepts, create revision resources, and find credible research. Professionals need scheduling, protected client documentation, assessment references, and intervention resources. Switching between tools creates fragmented workflows, while unverified AI content and poorly protected clinical data create trust and privacy risks.

## 4. Product goals

1. Give students a personalized, data-backed dashboard.
2. Provide an AI study assistant with persistent conversation history.
3. Support notes, flashcards, quizzes, board-review exams, and progress tracking.
4. Return research and clinical references only from trusted, traceable sources.
5. Provide a professional workspace for appointments, client records, sessions, and notes.
6. Implement a searchable DSM-5-TR-inspired educational reference using licensed content or original summaries and links.
7. Protect private and clinical data through server-side authorization and Supabase RLS.

## 5. Personas

- **Psychology student:** organizes subjects and deadlines, studies concepts, reviews for board exams, researches academic topics.
- **Psychology professional:** schedules appointments, manages authorized client records, documents sessions, consults assessment/intervention references.
- **Content reviewer/admin:** verifies sources and reviews clinical-reference content. Privileged permissions must be granted by trusted administrative processes.

## 6. Scope and functional requirements

### 6.1 Authentication and account
- Register, log in, log out, and recover account using Supabase Auth.
- Create a profile linked to `auth.users`.
- Support student and professional roles; optionally allow both roles per user.
- Role elevation must not be possible through self-service profile edits.
- Protect all private routes and data APIs. UI route guards are convenience, not security boundaries.

### 6.2 Student personalized dashboard
- Show subjects, assignments, exams, deadlines, progress, recent activity, and study goals.
- Create/update/archive subjects and assignments.
- Create/update exams and exam dates.
- Sort deadlines correctly using the user's timezone.
- Derive metrics from persisted records, not hard-coded demo values.

### 6.3 AI Study Assistant — Mindy
- Explain psychology concepts, theories, terms, and examples.
- Answer academic questions with clear structure and uncertainty handling.
- Generate quizzes, practice tests, answer keys, and explanations.
- Allow users to start a new chat, switch conversations, rename conversations, delete conversations, and search/browse prior chats.
- Persist conversation metadata and messages to Supabase.
- Restore a user's conversations after signing in on another device.
- Show loading, retry, error, and cancellation states.
- Call AI providers through server-side Edge Functions; never expose provider keys in the frontend.
- Label AI-generated content and do not invent sources.

### 6.4 AI Chat History (explicit requirement)
- Each chat session belongs to one authenticated user.
- Store a session title, chat type, created/updated timestamps, and optional archive state.
- Store messages with role, text/content, timestamps, status, and safe metadata.
- Load the user's sessions ordered by `updated_at DESC`.
- Load messages for the selected session in stable chronological order with pagination for long conversations.
- Automatically update `updated_at` after new messages.
- Generate a concise title from the first user prompt, or use a safe deterministic fallback.
- Support create, rename, select, archive, delete, and clear-history flows.
- Confirm destructive actions and handle deletion consistently for messages and session metadata.
- Use RLS so a user cannot read, insert, update, or delete another user's sessions/messages.
- Do not store hidden chain-of-thought. Store user-visible assistant output, tool/source metadata needed for citations, and operational status only.
- Decide retention/export/deletion behavior before launch; explain it to users.
- If AI generation fails, preserve the user message and record a recoverable failed state instead of pretending the response succeeded.

### 6.5 Smart Notes
- Create, edit, organize, tag, favorite, and archive notes.
- Support documented file types such as PDF/DOCX/PPT/images only after secure upload and processing are implemented.
- Summarize lectures, extract key concepts and terms, and suggest questions/flashcards.
- Keep source documents linked to generated summaries.
- Require user review before a generated summary is treated as final.
- Store uploads in private Supabase Storage buckets.

### 6.6 Board Exam Review
- Topic-based quizzes and practice question banks.
- Timed mock board examinations.
- Score attempts, show rationales, and track progress by topic.
- Clearly distinguish generated practice items from official/validated questions.
- Do not claim that practice scores predict official exam results.

### 6.7 Flashcards and spaced repetition
- Create decks and cards manually or with AI.
- Link cards to notes/topics when relevant.
- Record review rating, review time, interval, and next due date.
- Use a documented spaced-repetition algorithm.
- Persist decks, cards, and review history.

### 6.8 Research Assistant
- Search only approved trusted domains or verified scholarly/public-sector APIs.
- Summarize accessible journal articles and show source-linked metadata.
- Generate APA citations from validated bibliographic metadata.
- Assist with literature-review themes and evidence comparison.
- Explain research methods and statistics.
- Store title, authors, date, DOI/identifier, canonical URL, source domain, retrieval/verification timestamp, and license/access notes.
- Reject or label unverified sources. Never fabricate citations.
- Respect copyright, publisher access restrictions, and API terms.

### 6.9 Schedule and appointments
- Create, view, reschedule, cancel, and complete appointments.
- Store start/end time, timezone, status, optional client relationship, and reminder settings.
- Support reminders without exposing clinical details in notifications.
- Handle conflicts and retries predictably.

### 6.10 Client management
- Maintain minimum-necessary client profiles.
- Link sessions, progress notes, and assessment records to the correct client.
- Restrict access to the owning professional or explicitly authorized care team.
- Keep sensitive content out of general analytics and application logs.
- Define audit, retention, export, deletion, backup, and incident response procedures.
- Do not use real client data until security and legal reviews are complete.

### 6.11 Psychological assessment tools
- Provide assessment guides and instrument/version metadata.
- Support scoring only where instrument licensing/terms permit it.
- Explain limitations and interpretation boundaries.
- Do not expose restricted test items or manuals without permission.
- Keep AI output advisory and subject to professional review.

### 6.12 Diagnostic criteria / DSM-5-TR-inspired reference
- Searchable categories and original educational summaries.
- Links to authorized references and content version/review metadata.
- Educational differential-diagnosis aids and symptom checklists.
- Distinguish diagnostic education from a diagnosis or clinical decision.
- Do not reproduce substantial DSM-5-TR text without permission/license.
- Use licensed content where available; otherwise create original summaries and link to authorized APA material.
- Require qualified clinical review, source traceability, and update history.

### 6.13 Therapy techniques
- Evidence-based intervention library, session-planning resources, worksheets, and psychoeducation material where permitted.
- Show source, target context, review date, intended audience, and limitations.
- Do not present the library as a replacement for training or clinical judgment.

### 6.14 Documents and help
- Clarify whether the existing Documents page is a file manager, reference library, or both.
- Keep uploaded files private and ownership-scoped.
- Provide help, privacy information, account controls, and feature limitations.

## 7. Trusted-source policy

Initial candidate sources include APA, PubMed/NLM, NIMH, WHO, Cochrane, government health agencies, and peer-reviewed journals. The approved list must be reviewed and maintained rather than assuming every result from a domain is automatically suitable.

For each result, validate its canonical URL and metadata. Show author/title/date/DOI or identifier/source type when available. Distinguish peer-reviewed articles, preprints, guidelines, public information, and publisher pages. If evidence is unavailable, state that clearly. Never treat an LLM-generated citation as verified without retrieval and validation.

## 8. Security and privacy requirements

- Enable RLS for every table exposed through Supabase APIs.
- Use private Storage buckets and policies scoped to owner/authorized relationships.
- Keep Supabase service-role and AI provider keys server-side only.
- Validate inputs, session identity, ownership, quotas, and request size in Edge Functions.
- Rate-limit AI and search endpoints.
- Use least-privilege roles and audited role assignment.
- Avoid logging passwords, tokens, full prompts containing sensitive data, client-note contents, or assessment results.
- Separate development, test, and production projects.
- Define retention, deletion, export, backup, and restoration practices.
- Review applicable privacy/health-data law, contracts, and hosting obligations before using real clinical records.

## 9. Non-functional requirements

- Security: unauthorized access must fail at database/API level.
- Reliability: clear loading, empty, error, retry, and success states.
- Data integrity: constraints, foreign keys, transactions where required, migrations.
- Accessibility: keyboard navigation, labels, contrast, responsive layout.
- Performance: paginate long chat histories and large result lists.
- Maintainability: typed data layer, tests, lint/build checks, documented environment.
- Observability: sanitized logs and actionable errors.
- Traceability: sources and clinical content have provenance and version history.

## 10. Success metrics

- 100% pass rate for defined RLS cross-user isolation tests.
- Percentage of AI research outputs with verified source metadata.
- Rate of fabricated/mismatched citations in evaluation tests.
- Successful persistence and restoration of chat history across sessions/devices.
- Assignment and study task completion rates.
- Flashcard review adherence and quiz completion.
- Reminder delivery success.
- Zero known critical security issues at release.

## 11. Release acceptance

A feature is complete only after end-to-end behavior, database persistence, authorization, error handling, accessibility, and tests are verified. A UI route alone is not sufficient. AI/research features additionally require provider integration, output validation, trusted-source controls, and transparent limitations.

## 12. Open decisions

- AI provider/model selection and provider data-retention settings.
- Research APIs and approved source policy.
- Supported upload types, file size, OCR, and parsing.
- Individual professional ownership versus team-based client access.
- Reminder channel and timezone behavior.
- Applicable jurisdictions and health-data requirements.
- Licenses for DSM-related content and assessment instruments.
