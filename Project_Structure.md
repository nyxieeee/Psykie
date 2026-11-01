# Psykie — Project Structure

This target tree is intended to organize the existing React/Vite/TypeScript codebase and Supabase backend. Do not assume every listed file exists in the uploaded ZIP.

## 1. Proposed directory tree

```text
Psykie/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── route-guards/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── feedback/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   ├── assignments/
│   │   ├── exams/
│   │   ├── mindy-chat/
│   │   ├── notes/
│   │   ├── flashcards/
│   │   ├── board-review/
│   │   ├── research/
│   │   ├── calendar/
│   │   ├── clients/
│   │   ├── assessments/
│   │   ├── diagnostic-references/
│   │   └── therapy-resources/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── database.types.ts
│   │   ├── env.ts
│   │   └── validation/
│   ├── services/
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   └── main.tsx
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   ├── functions/
│   │   ├── mindy-chat/
│   │   ├── generate-quiz/
│   │   ├── summarize-notes/
│   │   ├── research-search/
│   │   ├── summarize-research/
│   │   └── send-reminders/
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 2. Feature module convention

A complex feature may follow this pattern:

```text
features/mindy-chat/
├── components/
├── pages/
├── hooks/
├── schemas/
├── types.ts
├── mindy-chat.service.ts
└── index.ts
```

- Pages compose route-level UI.
- Components contain feature-specific presentation.
- Hooks coordinate client-side interactions.
- Schemas validate inputs and returned payloads.
- Services call Supabase APIs or Edge Functions.
- Types should align with generated Supabase database types.

## 3. Naming and architectural boundaries

- Keep Zustand for transient UI state; persist domain data in Supabase.
- Put provider calls in Edge Functions, never directly in browser components.
- Keep database access in typed service modules.
- Use migrations as the schema source of truth.
- Add RLS tests for every user-owned table.
- Keep professional records separated by service and authorization boundary from general student content.
- Do not create empty folders just to match the diagram; add structure as real code is implemented.

## 4. Environment files

`.env.example` should contain safe placeholders only. The frontend may use a Supabase project URL and publishable/anon key. AI-provider and service-role keys must remain server-side.

## 5. Safe migration approach

1. Map the current files and imports.
2. Add a typed Supabase client and environment validation.
3. Implement Supabase Auth and replace mock authentication.
4. Add migrations and RLS before client queries.
5. Implement chat persistence and test ownership boundaries.
6. Migrate student features incrementally.
7. Add AI functions, trusted-source retrieval, and professional workflows after the security model is tested.
8. Remove mock data only after the replacement flow passes tests.
