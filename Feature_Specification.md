# Psykie — Complete Feature Specification

This document consolidates the requested product features into a single Markdown source of truth.

## 1. Student workspace

### 1.1 Personalized Dashboard
- Subjects and course cards.
- Assignments, due dates, completion state, priority.
- Exams, exam countdown, deadlines.
- Progress summaries and recent study activity.
- Empty states and quick actions.
- All values derive from persisted user-owned data.

### 1.2 AI Study Assistant — Mindy
- Explain psychology concepts and terminology.
- Answer academic questions and compare theories.
- Generate examples and study plans.
- Generate quizzes and practice tests with answer keys and explanations.
- Provide safe limitations and source links when claims depend on external evidence.
- Server-side AI provider integration; do not expose keys in the client.

### 1.3 AI Chat History
- Create, rename, switch, archive, and delete conversations.
- Persist chat sessions and messages to Supabase.
- Restore history after refresh and across devices.
- Sort sessions by most recently updated.
- Load messages chronologically, with pagination for long conversations.
- Display message status, timestamps, citations, and retryable failures.
- Optional chat categories: general, study, research, board-review.
- Optional search over the user's own chat titles and messages.
- RLS ensures users only access their own sessions/messages.
- Provide a clear-history action with confirmation.
- Do not store hidden chain-of-thought or unnecessary sensitive data.
- Define retention and export/delete behavior.

### 1.4 Smart Notes
- Create/edit/tag/favorite/archive notes.
- Summarize lectures and uploaded materials.
- Extract key concepts, definitions, and terms.
- Organize materials by subject/topic.
- Generate follow-up questions or flashcards from notes.
- Keep uploaded documents private and source-linked.
- Supported formats must be explicitly defined after secure parsing is implemented.

### 1.5 Board Exam Review
- Topic-based question sets.
- Mock board examinations with timed sessions.
- Answer explanations and review mode.
- Performance by topic and history of attempts.
- Label generated questions as practice questions unless sourced from an authorized validated bank.

### 1.6 Flashcards
- AI/manual card generation.
- Decks by subject/topic.
- Review ratings and due dates.
- Spaced repetition with a documented algorithm.
- Review history, favorites, and progress.

### 1.7 Research Assistant
- Search approved trusted sources only.
- Summarize journal articles and accessible papers.
- Generate APA citations from verified metadata.
- Assist literature-review organization and theme comparison.
- Explain research methods and statistics.
- Show source title, authors, date, DOI/identifier, canonical link, source type, and access/license status.
- Reject fabricated/unverified citations and respect copyright/API terms.

## 2. Professional workspace

### 2.1 Schedule & Appointments
- Calendar views and appointment CRUD.
- Session reminders and timezone support.
- Rescheduling/cancellation and status tracking.
- Conflict handling and idempotent reminder delivery.
- Reminder text must not reveal sensitive clinical details.

### 2.2 Client Management
- Secure client profiles with minimum necessary fields.
- Session history.
- Progress notes.
- Explicit professional ownership or care-team access.
- RLS and private storage where applicable.
- Sanitized audit events and defined retention/export/deletion policies.
- Do not use real client data before security and legal review.

### 2.3 Psychological Assessment Tools
- Assessment guides and instrument/version references.
- Scoring support only where licensing/terms permit.
- Interpretation guidance with limitations and professional review.
- No unauthorized reproduction of test items/manuals.
- No automatic diagnosis based solely on scores.

### 2.4 Diagnostic Criteria
- Searchable diagnostic reference categories.
- Educational differential-diagnosis guidance.
- Symptom checklists clearly labeled as educational aids, not diagnostic decisions.
- Source, version, reviewer, and update date for each reference.
- Distinguish official criteria from original summaries and links.

### 2.5 Therapy Techniques
- Evidence-based intervention library.
- Session-planning resources.
- Worksheets and psychoeducation materials where permitted.
- Source, intended audience, context, review date, and limitations.
- Do not imply the content substitutes for professional training.

## 3. DSM-5-TR-inspired diagnostic reference

- Use licensed content if the product needs to reproduce DSM-5-TR criteria.
- Without a license, provide original concise educational summaries and links to authorized APA resources.
- Do not copy substantial DSM-5-TR text or reproduce the manual.
- Support searchable categories, source/version metadata, reviewer approval, and revision history.
- Differential diagnosis and symptom checklists are educational aids, not automated diagnoses.
- Have qualified professionals review content and clarify that AI is not a diagnostic authority.

Official starting point: https://www.psychiatry.org/psychiatrists/practice/dsm

## 4. Trusted-source requirements

Candidate sources include:
- American Psychological Association: https://www.apa.org/
- PubMed / U.S. National Library of Medicine: https://pubmed.ncbi.nlm.nih.gov/
- National Institute of Mental Health: https://www.nimh.nih.gov/
- World Health Organization: https://www.who.int/
- Cochrane Library: https://www.cochranelibrary.com/
- Relevant government health agencies and peer-reviewed journals.

Implementation rules:
1. Use a maintained allowlist and/or verified scholarly APIs.
2. Validate URLs, titles, authors, dates, DOI/identifiers, and source domain.
3. Distinguish peer-reviewed papers, preprints, guidelines, and public information.
4. Tie claims and summaries to retrieved sources where feasible.
5. If evidence is missing, say so; never invent citations.
6. Respect publisher access controls, copyright, and source API terms.

## 5. Shared quality requirements

- Supabase Auth for identity.
- PostgreSQL persistence for user-owned data.
- RLS on every exposed table.
- Private storage for private files.
- Server-side AI integration and rate limiting.
- Cross-user authorization tests.
- Accessible, responsive UI.
- Error/loading/empty states.
- Backups, migrations, monitoring, and privacy controls.
