# Psychology study workflows

Adapted after reviewing the local France Notes by Uno project's Quiz page, quiz store, and Study Box workflows. Its useful study patterns are implemented with Psykie's own Mistral backend and psychology subjects. The reference project was not modified.

## Create practice from your material

- In **Quizzes**, choose **Create quiz**. Enter topics, paste material, select a saved note, or upload a PDF, DOCX, TXT, Markdown, CSV, JPEG, PNG, or WebP file.
- In **Documents**, choose a stored file and **Quiz me on this**. Its readable text opens in quiz setup. **Make flashcards** and **Summarize** also use the document and preview drafts before saving. The saved note or deck opens after saving.
- In **Notes**, **Quiz me on this** carries the current note to quiz setup. Source text is passed through navigation state rather than a URL query and the handoff is consumed once.
- Choose subject, difficulty, and a style: multiple choice, true/false, psychology scenarios, or mixed. Scenarios cover fictional psychology learning situations, not nursing exam scenarios. Board-style practice is educational, not an official or validated exam.
- Choose 1-15 questions and optionally a 5, 10, 20, or 30 minute whole-quiz timer. Preview the generated questions and rationales, then save.

Uploads use the same local parsers and limits as flashcards: 10 MB, at most 100 PDF pages, and 25,000 combined source/instruction characters. Photos and scanned PDFs support opt-in Mistral vision OCR. Each scanned page consumes one AI request; at most five scanned pages per import are accepted, with the count checked before OCR begins. Native-text pages stay local. You can cancel reading and edit the extracted text before generation. Legacy DOC and slides are not supported by the extractor. No silent truncation or invented extra questions is used to fill a requested count.

## Practice and review

- Answers and flags are saved as you work. Use Previous or numbered buttons to revisit questions. Closing a tab or navigating away does not reset a timer; the absolute deadline is retained.
- When the deadline expires, current answers are submitted once. Unanswered questions count as missed. A timed session that expires while the page is closed is finalized when Quizzes is reopened.
- The result shows your answer, the correct answer, and the saved explanation for each question. Filter missed or flagged questions, retry only missed questions, or download a plain-text review.
- **Results** lists individual attempts rather than overwriting the previous score. Opening an old result preserves any current unfinished quiz; choose **Resume current quiz** to return to it. Starting another quiz replaces the current unfinished attempt.
- **Practice from flashcards** uses saved question/answer cards without an AI request. The quiz stores a snapshot so future card edits do not alter that quiz.

Quiz content, the current session, and up to 30 attempts per quiz are stored locally in this browser, isolated by account. Deleting a quiz deletes its attempts. Legacy score-only records remain visible but have no recoverable per-question review. Supabase content synchronization, nursing-specific question formats, essay auto-grading, and per-question timers were not copied. The OCR workflow is adapted to Psykie's own Mistral account and limits.

## Deploy and check

Deploy the updated `psykie-ai` function to enable the new quiz-format schema and psychology prompts:

```powershell
supabase functions deploy psykie-ai
```

No new migrations, API keys, or environment variables are needed. Frontend changes deploy through the connected Vercel repository.

```powershell
npm run lint
npm run build
npm run check:functions
npm run test:ai:backend
node scripts/run-ai-ui.cjs scripts/check-psych-quiz.cjs
node scripts/run-ai-ui.cjs
```

Browser and backend tests use mocked Supabase/Mistral responses. They test the application flow and validation, not live model accuracy or provider availability.
