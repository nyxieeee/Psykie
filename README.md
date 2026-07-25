# 🧠 Psykie
### Your Psychology Study & Practice Companion

Version: 1.0 (MVP Planning)
Status: Planning Phase
AI Assistant: **Mindy**

---

# Overview

Psykie is an AI-powered psychology platform designed for both psychology students and licensed professionals. It combines AI-assisted learning, board exam preparation, research tools, and clinical productivity into a secure, modern web application.

The integrated AI assistant, **Mindy**, helps users learn psychology, summarize research, generate quizzes and flashcards, assist with academic writing, and provide evidence-based clinical support while respecting ethical and legal boundaries.

---

# Vision

Create the most trusted all-in-one psychology platform that bridges education, research, and professional practice through responsible AI.

---

# Core Principles

- Evidence-based
- Privacy-first
- Professional-grade security
- Fast AI responses
- Beautiful user experience
- Mobile-friendly
- Accessible
- Scalable architecture

---

# Target Users

## Students

- Undergraduate Psychology
- Graduate Students
- Board Exam Reviewees

---

## Professionals

- Licensed Psychologists
- Psychometricians
- Guidance Counselors
- Clinical Supervisors
- Mental Health Professionals

---

# AI Assistant

## Name

**Mindy**

---

## AI Providers

### Primary

- Groq
- GPT OSS

Used for:

- Conversations
- Tutoring
- Quizzes
- Flashcards
- Psychology explanations
- Case discussions
- Study assistance

---

### Secondary

- Mistral AI

Used for:

- PDF summaries
- Research assistance
- APA formatting
- Long document understanding
- Literature reviews

---

## AI Routing

Mindy automatically chooses the best AI model depending on the task.

Example:

Student Question
        ↓
Groq GPT OSS

Upload Research Paper
        ↓
Mistral AI

Generate Flashcards
        ↓
Groq GPT OSS

Summarize Lecture PDF
        ↓
Mistral AI

---

# Student Module

## Dashboard

Features

- Personalized homepage
- Current subjects
- Upcoming deadlines
- Assignment tracker
- Exam countdown
- Progress analytics
- Study streak
- Recent activity

---

## AI Tutor

Mindy can

- Explain psychology concepts
- Compare theories
- Explain famous psychologists
- Generate examples
- Explain difficult terminology
- Answer academic questions

---

## Smart Notes

Upload

- PDF
- DOCX
- PPT
- Images

AI Features

- Summary
- Key concepts
- Important terms
- Highlighting
- Question generation
- Flashcard generation

---

## Flashcards

Features

- AI generated
- Manual cards
- Spaced repetition
- Favorites
- Categories
- Daily review

---

## Quiz Generator

Generate

- Multiple Choice
- True or False
- Identification
- Enumeration
- Essay Questions
- Situational Cases

Difficulty

- Easy
- Medium
- Hard
- Board Exam

---

## Board Review

Topics

- General Psychology
- Biological Psychology
- Developmental Psychology
- Cognitive Psychology
- Abnormal Psychology
- Social Psychology
- Personality
- Industrial Psychology
- Educational Psychology
- Psychological Assessment
- Research Methods
- Ethics

Features

- Mock Boards
- Timed Exams
- Random Questions
- Weak Topic Detection
- Performance Analytics

---

## Research Assistant

Features

- Journal summaries
- APA 7 citations
- Citation generator
- Research questions
- Literature review assistance
- Variable suggestions
- Hypothesis generation
- Methodology explanation
- Statistics explanation

---

# Professional Module

## Dashboard

Displays

- Today's appointments
- Client statistics
- Session reminders
- Pending assessments
- Recent notes

---

## Calendar

Features

- Schedule sessions
- Appointment reminders
- Google Calendar Sync
- Outlook Sync

---

## Client Management

Secure client records

Contains

- Demographics
- Intake forms
- Consent forms
- Session history
- Progress notes
- Treatment goals
- Attachments

---

## Assessment Toolkit

Features

- Assessment guides
- Scoring support
- Interpretation guidance
- Report drafting assistance

---

## DSM-5-TR Reference

Searchable database

Contains

- Disorder overview
- Diagnostic summaries
- Symptom summaries
- Differential diagnosis guidance
- Clinical notes

⚠️ Do **not** reproduce copyrighted DSM-5-TR text verbatim. Use original summaries and require users to consult the official DSM-5-TR for the complete criteria.

---

## Therapy Library

Evidence-based interventions

Includes

- CBT
- DBT
- ACT
- REBT
- Motivational Interviewing
- Family Therapy
- Solution Focused Therapy
- Person Centered Therapy
- Mindfulness

Resources

- Worksheets
- Psychoeducation
- Session planning
- Homework templates

---

# Trusted Knowledge Sources

Only retrieve information from trusted sources.

Priority Sources

★★★★★

- American Psychological Association
- World Health Organization
- PubMed
- NIH
- NIMH
- Cochrane Library

★★★★☆

- University publications
- Government health agencies
- Peer-reviewed journals

Never prioritize

- Reddit
- Quora
- Blogs
- AI generated websites
- Unverified sources

---

# AI Safety

Mindy must never

- Diagnose patients
- Replace psychologists
- Prescribe medication
- Generate fake citations
- Fabricate statistics
- Encourage unsafe behavior

Always remind users that AI is an educational and decision-support tool—not a replacement for professional judgment.

---

# Authentication

Users can login using

- Email
- Google
- Microsoft

Future

- University SSO

---

# User Roles

Guest

- Browse information

Student

- Access learning features

Professional

- Clinical workspace

Admin

- Manage platform

Super Admin

- Full access

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

---

## Backend

- Next.js API Routes
- Node.js

---

## Database

- PostgreSQL
- Prisma ORM

---

## Authentication

- Clerk
or
- Auth.js

---

## Storage

- Supabase Storage

---

## AI

- Groq GPT OSS
- Mistral AI

---

## Deployment

Frontend

- Vercel

Backend

- Railway

Database

- PostgreSQL

Storage

- Supabase

---

# Security

Authentication

- JWT
- MFA
- Secure Sessions

Encryption

- AES-256 at rest
- TLS in transit

Protection

- SQL Injection Protection
- XSS Protection
- CSRF Protection
- Rate Limiting
- CSP Headers
- Input Validation

Sensitive Data

Never expose

- .env
- API Keys
- Database credentials
- Server files
- Internal APIs

---

# Folder Structure

```
app/
components/
features/
    student/
    professional/
    ai/
    research/
    board-review/
    flashcards/
    assessments/
    therapy/
lib/
    ai/
    auth/
    db/
    utils/
prisma/
public/
```

---

# Future Roadmap

## Version 1.0

- Student Dashboard
- AI Tutor
- Flashcards
- Smart Notes
- Quiz Generator
- Research Assistant

---

## Version 1.5

- Professional Dashboard
- Client Management
- Calendar
- Assessment Toolkit
- Therapy Library

---

## Version 2.0

- Voice conversations with Mindy
- AI-generated session summaries
- Telehealth
- Mobile Apps
- Offline Mode
- Supervisor Portal
- Wearable Integration

---

# Design Language

Theme

- Calm
- Modern
- Healthcare
- Apple-inspired
- Minimal

Primary Colors

- Blue
- Teal
- White

Typography

- Clean
- Accessible
- Professional

Dark Mode

✅ Supported

Light Mode

✅ Supported

Responsive

✅ Desktop
✅ Tablet
✅ Mobile

---

# Mission Statement

**Psykie exists to empower psychology students and mental health professionals by combining trusted knowledge, secure technology, and responsible artificial intelligence into one seamless platform. Through Mindy, users can learn, research, organize, and practice with confidence while respecting ethical standards, privacy, and the limits of AI.**

# Original Idea and features

Student 
- Personalized Dashboard
    •    Subjects, assignments, exams, and deadlines 
- AI Study Assistant
    •    Explain psychology concepts
    •    Answer academic questions
    •    Generate quizzes and practice tests
- Smart Notes
    •    Summarize lectures
    •    Highlight key concepts
    •    Organize study materials
- Board Exam Review
    •    Topic-based quizzes
    •    Mock board examinations
    •    Performance tracking
- Flashcards
    •    AI-generated flashcards
    •    Spaced repetition for better retention
- Research Assistant
    •    Summarize journal articles
    •    Generate APA citations
    •    Assist with literature reviews
    •    Explain research methods and statistics

Professional 
- Schedule & Appointments
    •    Calendar management
    •    Session reminders
- Client Management
    •    Secure client profiles
    •    Session history
    •    Progress notes
- Psychological Assessment Tools
    •    Assessment guides
    •    Scoring support
    •    Interpretation guidance
- Diagnostic Criteria
    •    Searchable diagnostic references
    •    Differential diagnosis guidance
    •    Symptom checklists
- Therapy Techniques
    •    Evidence-based intervention library
    •    Session planning resources
    •    Worksheets and psychoeducation materials

*NOTE: all documents that is pulled from the search engine should be only from trusted sources

*DSM-5 TR DIAGNOSTICS CRITERIA SHOULD ALSO BE IMPLEMENTED (A VERSION OF IT)# Psykie
