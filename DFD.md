# Psykie — Data Flow Diagrams (DFD)

Diagrams are expressed in Mermaid inside Markdown for version control and easy editing.

## 1. Context / Level 0

```mermaid
flowchart TB
    Student[Student]
    Professional[Psychology Professional]
    Reviewer[Content Reviewer / Admin]
    Psykie((Psykie Platform))
    Sources[Approved Research APIs / Publishers]
    AI[AI Provider]
    Notifications[Email / Push Provider]

    Student <--> |Study data, prompts, chats, results| Psykie
    Professional <--> |Appointments, client records, reference queries| Psykie
    Reviewer <--> |Reviewed sources and clinical content| Psykie
    Psykie <--> |Approved metadata and source links| Sources
    Psykie <--> |Minimized AI prompts and generated output| AI
    Psykie --> |Privacy-preserving reminders| Notifications
```

## 2. Level 1 — Main data flows

```mermaid
flowchart TB
    Student[Student]
    Professional[Professional]
    Reviewer[Content Reviewer]
    Auth[Supabase Auth]
    P1((1. Authentication and Authorization))
    P2((2. Student Workspace))
    P3((3. Mindy Chat and AI))
    P4((4. Research Retrieval))
    P5((5. Professional Workspace))
    P6((6. Clinical Reference Search))
    D1[(Profiles and Roles)]
    D2[(Student Records)]
    D3[(Chat Sessions and Messages)]
    D4[(Research Documents and Citations)]
    D5[(Professional Records)]
    D6[(Reviewed Clinical References)]
    D7[(Sanitized Audit Events)]
    Edge[Supabase Edge Functions]
    AI[AI Provider]
    APIs[Approved Research APIs]

    Student -->|Credentials| Auth
    Professional -->|Credentials| Auth
    Auth -->|JWT identity| P1
    P1 <--> D1
    P1 --> P2
    P1 --> P3
    P1 --> P4
    P1 --> P5
    P1 --> P6
    Student <--> P2
    P2 <--> D2
    Student <--> P3
    P3 <--> D3
    P3 <--> Edge
    Edge <--> AI
    Student <--> P4
    P4 <--> APIs
    P4 <--> D4
    Professional <--> P5
    P5 <--> D5
    Student <--> P6
    Professional <--> P6
    Reviewer <--> D6
    P6 <--> D6
    P1 --> D7
    P3 --> D7
    P4 --> D7
    P5 --> D7
```

## 3. Level 2 — Persisting Mindy chat history

```mermaid
flowchart TD
    User[Authenticated User]
    UI[Mindy React UI]
    Auth[Supabase Auth JWT]
    Sessions[(chat_sessions)]
    Messages[(chat_messages)]
    RLS{RLS: caller owns session?}
    Function[Edge Function: Mindy response]
    Provider[AI Provider]
    SaveUser[Save user message]
    SaveAssistant[Validate and save assistant message]
    Error[Persist safe failure status]
    UIHistory[Render ordered conversation history]

    User --> UI --> Auth
    UI -->|Create/list/select session| RLS
    RLS -->|Allowed| Sessions
    Sessions -->|Owned session ID| UI
    UI -->|Append user message| SaveUser --> RLS
    RLS -->|Authorized insert| Messages
    SaveUser --> Function --> Provider
    Provider -->|Response| SaveAssistant --> RLS
    RLS -->|Authorized insert| Messages
    Function -->|Provider failure| Error --> Messages
    Sessions --> UIHistory
    Messages --> UIHistory
    UIHistory --> UI --> User
```

Controls:
- A client-supplied session ID is never proof of ownership.
- Check ownership in RLS and in the trusted function.
- Save the user's message before AI generation so a failed call does not erase it.
- Save only user-visible assistant text and required citation/usage metadata; never hidden chain-of-thought.
- Paginate long histories and order by `created_at` plus a stable tie-breaker.
- Update the parent session's `updated_at` after a message is added.

## 4. Level 2 — Trusted research search

```mermaid
flowchart TD
    User[Student]
    UI[Research UI]
    Fn[Edge Function]
    Validate[Validate JWT, query, quota]
    Allowlist[(Trusted Source Allowlist)]
    API[Approved scholarly / public-sector API]
    Check[Validate metadata, DOI and canonical URL]
    Summarize[Summarize retrieved source]
    AI[AI Provider]
    DB[(Research metadata and summaries)]
    Return[Return summary with source links]
    Reject[Omit or label unverified result]

    User --> UI --> Fn --> Validate --> Allowlist --> API --> Check
    Check -->|Verified source| Summarize --> AI
    AI --> Summarize --> DB --> Return --> UI --> User
    Check -->|Not verified| Reject --> Return
```

## 5. Level 2 — Professional note access

```mermaid
flowchart TD
    Clinician[Authenticated Professional]
    UI[Client / Session UI]
    API[Supabase API]
    Policy{RLS: owner or explicit team access?}
    Client[(Client Records)]
    Note[(Progress Notes)]
    Audit[(Sanitized Audit Metadata)]
    Deny[Access Denied]

    Clinician --> UI --> API --> Policy
    Policy -->|Allowed| Client
    Client --> Note
    Note -->|Authorized write| API
    API --> Audit
    Policy -->|Denied| Deny --> UI
```

## 6. Data classification

| Classification | Examples | Controls |
|---|---|---|
| Public | Approved public links and educational summaries | Source validation and versioning |
| Personal | Profile, subjects, notes, chat history | Auth, owner-scoped RLS |
| Sensitive professional | Client profiles, progress notes, assessments | Strict relationship-based RLS, private storage, audit metadata, retention rules |
| Secrets | Service-role and AI-provider keys | Server-side secrets only |

## 7. Trust boundaries

1. Browser → Supabase API: authentication does not replace RLS.
2. Browser → Edge Function: validate identity, payload, quotas, and record access.
3. Edge Function → AI provider: minimize data and protect keys.
4. Research API → Psykie: treat returned content and URLs as untrusted until validated.
5. Professional records: require owner or explicit team relationship at database level.
