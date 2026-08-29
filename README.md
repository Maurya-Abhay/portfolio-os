# Portfolio OS

A unified Next.js application combining a public developer portfolio with a private personal operating system for study, testing, finance, and portfolio management.

## Contents

- Public developer portfolio
- Secure register/login/logout
- Private dashboard
- Full Stack, DSA with Java, and AI study tracks
- Study topics, progress, notes, and targets
- Database-backed tests and attempt history
- Personal finance: income, expenses, budgets, categories, analytics
- Portfolio CMS: projects, skills, experience, education, achievements
- Structured curriculum and question-bank seed data
- Production security, performance, and deployment rules

---

# 1. Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma 6
- PostgreSQL
- Zod
- Lucide React
- Node.js 20+

---

# 2. Product Architecture

```text
Browser
   |
   v
Next.js App Router
   |
   +----------------------------+
   |                            |
   v                            v
Public Portfolio            Private OS
                                |
                +---------------+---------------+
                |               |               |
              Study           Tests          Finance
                |               |               |
                +---------------+---------------+
                                |
                         Portfolio CMS
                                |
                                v
                         Server-side logic
                                |
                                v
                             Prisma
                                |
                                v
                           PostgreSQL
```

The public portfolio must work without login.

Private features must require authentication and server-side authorization.

---

# 3. Recommended Folder Structure

Keep the project feature-oriented. Do not create a separate folder for every tiny file.

```text
portfolio-os-app/
│
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── projects/
│   │   └── ...
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── study/
│   │   ├── tests/
│   │   ├── finance/
│   │   └── portfolio/
│   ├── api/
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── layout/
│   ├── portfolio/
│   ├── dashboard/
│   ├── study/
│   ├── tests/
│   ├── finance/
│   └── ui/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── validation/
│   ├── portfolio-owner.ts
│   └── ...
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── data/
│   ├── study-content.json
│   └── STUDY_CONTENT.md
│
├── public/
├── scripts/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.*
├── tailwind.config.*
├── postcss.config.*
└── README.md
```

Do not create structures such as `components/button/ButtonFolder/` for every small component.

---

# 4. Routes

Keep routes minimal and understandable.

```text
/
├── /projects
├── /projects/[slug]
├── /login
├── /register
│
└── /dashboard
    ├── /study
    ├── /study/[track]
    ├── /study/[track]/[topic]
    ├── /tests
    ├── /tests/[id]
    ├── /tests/[id]/result
    ├── /finance
    └── /portfolio
```

Only add another page when the feature genuinely needs one.

---

# 5. Public Portfolio

The public side should present:

- Name
- Profile image
- Introduction
- Skills
- Featured projects
- All projects
- Experience
- Education
- Achievements
- Contact
- GitHub
- LinkedIn
- X/Twitter

The design should be modern, responsive, accessible, fast, and clearly feel like a finished product rather than a basic template.

Only intentionally public/published portfolio data should appear publicly.

---

# 6. Authentication

Required features:

- Register
- Login
- Logout
- Session handling
- Protected dashboard
- User-specific data

Important:

Hiding a dashboard button is NOT authorization.

Every private route and mutation must verify the authenticated user on the server.

Never trust a browser-supplied `userId` for authorization.

Bad:

```text
userId = request.body.userId
```

Correct principle:

```text
userId = authenticatedSession.user.id
```

---

# 7. Dashboard

The dashboard is the private home screen.

It should summarize:

- Study progress
- Current targets
- Recent tests
- Test performance
- Finance summary
- Recent transactions
- Portfolio status

The dashboard should link to the main systems without creating unnecessary duplicate pages.

---

# 8. Study System

Initial study tracks:

1. Full Stack
2. DSA with Java
3. AI

The architecture must allow new tracks to be added without changing the database schema.

Structure:

```text
StudyCategory
   |
   +-- StudyModule
          |
          +-- StudyTopic
                 |
                 +-- StudyProgress
                 +-- StudyNote
                 +-- Question
                 +-- TopicResource
```

## Full Stack

The curriculum may cover areas such as:

- HTML
- CSS
- JavaScript
- TypeScript
- React
- Next.js
- APIs
- Backend
- Authentication
- PostgreSQL
- Prisma
- Security
- Testing
- Deployment
- Performance
- System design

## DSA with Java

The curriculum may cover:

- Complexity
- Arrays
- Strings
- Linked lists
- Stacks
- Queues
- Hashing
- Recursion
- Sorting
- Searching
- Trees
- Heaps
- Graphs
- Dynamic programming
- Greedy algorithms
- Problem-solving patterns

## AI

The curriculum may cover:

- AI fundamentals
- Machine learning fundamentals
- Neural networks
- Deep learning
- NLP
- Embeddings
- Transformers
- LLMs
- Prompt engineering
- RAG
- Vector databases
- AI agents
- Evaluation
- AI application development
- AI safety and security

The actual content files are the source of truth for the final curriculum.

---

# 9. Topic Learning

A good topic should explain:

```text
What is it?
      ↓
Why does it matter?
      ↓
How does it work?
      ↓
Simple example
      ↓
Diagram / mental model when useful
      ↓
Implementation / code
      ↓
Common mistakes
      ↓
Practice
      ↓
Interview check
      ↓
Test
```

Use simple English.

Avoid unnecessarily complicated wording.

Code examples must be correct and relevant.

Diagrams should be used when they genuinely make the concept easier to understand.

---

# 10. Study Progress

Users should be able to mark topics as:

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

The system should track progress per user and per topic.

Useful information includes:

- Completed topics
- Remaining topics
- Track progress
- Module progress
- Revision count
- Completion dates

Do not calculate authoritative progress from UI state alone. Store it in the database.

---

# 11. Notes and Targets

Notes are private user data.

A note can contain:

```text
Title
Content
Topic
Created date
Updated date
```

Targets can contain:

```text
Title
Type
Due date
Status
Created date
Completed date
```

All notes and targets must be scoped to the authenticated user.

---

# 12. Test System

Tests are database-backed.

Supported question types:

```text
MCQ
SCENARIO
DEBUGGING
OUTPUT
DSA
```

Question structure:

```text
Question
├── type
├── question
├── options
├── answer
├── explanation
├── difficulty
└── topic
```

Attempt structure:

```text
TestAttempt
├── score
├── total questions
├── correct answers
├── wrong answers
├── skipped
├── startedAt
├── completedAt
└── answers
```

The result page should show:

- Score
- Percentage
- Pass/fail
- Correct answers
- Wrong answers
- Skipped
- Weak topics
- Revision recommendations
- Attempt history

Correct answers must not be exposed before submission.

The purpose of testing is to identify knowledge gaps, not merely produce a score.

---

# 13. Question Bank

The documented project target is:

```text
558 curriculum topics
3 questions per topic
= 1,674 questions
```

Always verify the actual seed/database count before claiming these numbers as final.

Questions should test:

- Understanding
- Practical decisions
- Debugging
- Output prediction
- Scenarios
- Trade-offs
- Problem solving

Avoid questions that only test memorization.

---

# 14. Finance System

Finance is private.

Supported features:

- Income
- Expenses
- Categories
- Budgets
- Transaction history
- Date filtering
- Category filtering
- Payment methods
- Descriptions
- Analytics

Transaction types:

```text
INCOME
EXPENSE
```

Example:

```text
Type: EXPENSE
Amount: 500.00
Category: Food
Description: Lunch
Date: 2026-08-29
Payment Method: UPI
```

Basic calculation:

```text
Net Balance = Total Income - Total Expense
```

The database is the source of truth for financial totals.

Use Prisma `Decimal` for money. Avoid using JavaScript floating-point values as authoritative stored money.

All financial queries must be scoped to the authenticated user.

---

# 15. Portfolio CMS

Private portfolio management should support:

- Projects
- Skills
- Experience
- Education
- Achievements

Project fields include:

```text
title
slug
description
longDescription
image
liveUrl
githubUrl
featured
published
sortOrder
```

Project visibility should respect the published/public state.

Do not invent portfolio claims such as fake clients, years of experience, revenue, performance numbers, certifications, or results.

---

# 16. Database Architecture

PostgreSQL is the runtime persistent database.

User data includes:

```text
User
 ├── StudyProgress
 ├── StudyNote
 ├── StudyTarget
 ├── TestAttempt
 ├── Transaction
 ├── Budget
 ├── FinanceCategory
 ├── Project
 ├── Skill
 ├── Experience
 ├── Education
 └── Achievement
```

Study:

```text
StudyCategory
   |
   +-- StudyModule
          |
          +-- StudyTopic
                 |
                 +-- Progress
                 +-- Notes
                 +-- Questions
                 +-- Resources
```

Tests:

```text
Test
 |
 +-- Question
 |
 +-- TestAttempt
        |
        +-- TestAnswer
```

Finance:

```text
User
 |
 +-- Transaction
 |      |
 |      +-- FinanceCategory
 |
 +-- Budget
        |
        +-- FinanceCategory
```

---

# 17. Source Content vs Database

GitHub is NOT the runtime database.

GitHub can store:

- Source code
- Documentation
- JSON curriculum
- Markdown catalogue
- Seed scripts

PostgreSQL stores runtime data:

- Users
- Progress
- Notes
- Targets
- Attempts
- Answers
- Transactions
- Budgets
- Categories
- Portfolio records

Content flow:

```text
study-content.json
        |
        v
     seed.ts
        |
        v
   PostgreSQL
        |
        v
    Study UI
```

This makes large study content easier to manage and update.

---

# 18. Prisma

Required schema configuration:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Useful commands:

```bash
npx prisma format
npx prisma validate
npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma migrate deploy
npx prisma db seed
npx prisma studio
```

Use `db push` for appropriate development workflows.

For production migration deployment, prefer:

```bash
npx prisma migrate deploy
```

Do not use destructive development commands against production.

---

# 19. Environment Variables

Create `.env` from `.env.example`.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
```

The exact database URL depends on the PostgreSQL provider.

For Supabase, use the connection string appropriate for the deployment/runtime and follow the current provider guidance for pooled vs direct connections.

Never hard-code secrets.

Never commit:

```text
.env
.env.local
.env.production
```

Never put production credentials in README files.

---

# 20. Local Setup

Requirements:

- Node.js 20+
- PostgreSQL
- npm

Install:

```bash
npm install
```

Configure:

```text
.env.example -> .env
```

Set:

```env
DATABASE_URL="..."
AUTH_SECRET="..."
```

Then:

```bash
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

---

# 21. Production Setup

Production check:

```bash
npm run build
npm run start
```

Recommended production flow:

```bash
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

Run seed data only when intentionally required.

Before production, verify the database and migration strategy.

---

# 22. Production Security Rules

## Secrets

Use long, unique production secrets.

Never use weak values such as:

```env
AUTH_SECRET="123456"
```

## Passwords

Never store plain-text passwords.

Use a strong password-hashing implementation.

## Authorization

Every private read/write/delete operation must verify:

1. User is authenticated.
2. User owns the requested data.
3. Requested operation is allowed.

## Public data

Only intentionally public data should be exposed.

## Input validation

Validate external input with schemas such as Zod.

Validate:

- Registration fields
- Login fields
- IDs
- Amounts
- Dates
- URLs
- Portfolio fields
- Study/test input

## HTML

Do not render untrusted HTML.

Avoid `dangerouslySetInnerHTML` unless the content is explicitly sanitized and trusted.

## Cookies and sessions

Production sessions should use secure cookie/session settings and HTTPS.

## Rate limiting

Authentication and other sensitive endpoints should have appropriate rate limiting in production.

## Dependencies

Keep dependencies updated and review security advisories.

---

# 23. Performance Rules

The application should feel fast.

Prefer Server Components when client interactivity is not required.

Use Client Components only where needed.

Avoid:

- Duplicate database queries
- Huge client-side bundles
- Unnecessary dependencies
- Giant images
- Heavy libraries inside Client Components
- Repeated expensive calculations

Use efficient Prisma queries and appropriate indexes.

Animations should be subtle and should not cause scroll or layout performance problems.

Respect `prefers-reduced-motion` where practical.

---

# 24. Content Quality Rules

Study notes must be useful, not padded.

Use:

- Simple English
- Short explanations
- Practical examples
- Correct code
- Mental models
- Real-world use cases
- Common mistakes
- Practice
- Interview questions

Do not make content longer just to make it look complete.

A topic is complete when it is understandable and practically useful.

---

# 25. Adding a New Study Track

Do NOT create a new database model for every track.

Bad:

```text
FullStackTopic
DSATopic
AITopic
CloudTopic
DevOpsTopic
```

Good:

```text
StudyCategory
StudyModule
StudyTopic
```

To add a track:

1. Create a new category.
2. Add modules.
3. Add topics.
4. Add topic content.
5. Add resources if needed.
6. Add tests/questions.
7. Run seed.
8. Verify the UI.

---

# 26. Adding a Topic

A topic can contain:

```text
title
slug
description
example
codeExample
content
diagram
commonMistakes
practice
interviewQuestion
difficulty
sortOrder
```

Recommended learning sequence:

```text
Concept
→ Example
→ Mental model
→ Code
→ Mistakes
→ Practice
→ Interview check
→ Test
```

---

# 27. Adding Tests

A test can contain:

```text
title
description
difficulty
duration
passing score
questions
```

Questions should connect to topics where possible so the application can identify weak areas.

For example:

```text
Test
 |
 +-- Question 1 -> Topic A
 +-- Question 2 -> Topic B
 +-- Question 3 -> Topic A
```

This allows result analysis such as:

```text
Topic A: Strong
Topic B: Needs Revision
```

---

# 28. Adding Portfolio Content

A project should communicate:

```text
Problem
   ↓
Solution
   ↓
Technology
   ↓
Important implementation
   ↓
Real result
```

Only use real information.

---

# 29. Adding Finance Data

A transaction should be structured.

Example:

```text
Type: INCOME
Amount: 25000.00
Category: Salary
Description: Monthly income
Date: 2026-08-29
Payment Method: Bank
```

The finance system should make it easy to:

- Add
- Edit
- Delete
- Filter
- Analyze

All operations must verify ownership server-side.

---

# 30. Verification Checklist

Run:

```bash
npx prisma format
npx prisma validate
npx prisma generate
npm run build
```

Then test the application manually.

## Public

- [ ] Home
- [ ] Projects
- [ ] Project details
- [ ] Navigation
- [ ] Footer
- [ ] Contact
- [ ] Mobile layout

## Authentication

- [ ] Register
- [ ] Login
- [ ] Invalid login
- [ ] Logout
- [ ] Protected routes
- [ ] Session persistence
- [ ] Unauthorized access rejection

## Study

- [ ] Tracks
- [ ] Modules
- [ ] Topics
- [ ] Content
- [ ] Progress
- [ ] Complete/uncomplete
- [ ] Notes
- [ ] Targets
- [ ] Track/module progress

## Tests

- [ ] Test listing
- [ ] Start test
- [ ] Timer if enabled
- [ ] Answer selection
- [ ] Submission
- [ ] Scoring
- [ ] Results
- [ ] Correct/wrong/skipped
- [ ] Attempt history
- [ ] Weak-topic analysis

## Finance

- [ ] Income
- [ ] Expenses
- [ ] Categories
- [ ] Budgets
- [ ] Add
- [ ] Edit
- [ ] Delete
- [ ] Filters
- [ ] Totals
- [ ] Analytics
- [ ] User isolation

## Portfolio CMS

- [ ] Projects
- [ ] Skills
- [ ] Experience
- [ ] Education
- [ ] Achievements
- [ ] Published state
- [ ] Featured state
- [ ] Ordering
- [ ] Public visibility

## Security

- [ ] No plain-text passwords
- [ ] No secrets in source
- [ ] `.env` ignored
- [ ] Private routes protected
- [ ] User ownership enforced
- [ ] Public routes cannot expose private data
- [ ] Mutations verify authorization
- [ ] Input validation exists

---

# 31. Deployment Checklist

Before deployment:

- [ ] Production PostgreSQL database exists
- [ ] Production `DATABASE_URL` configured
- [ ] Strong `AUTH_SECRET` configured
- [ ] `.env` is not committed
- [ ] Production migrations reviewed
- [ ] `prisma generate` succeeds
- [ ] `prisma migrate deploy` succeeds
- [ ] Production build succeeds
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] Public portfolio tested
- [ ] Study tested
- [ ] Tests tested
- [ ] Finance tested
- [ ] CMS tested
- [ ] Mobile layout tested
- [ ] Loading states tested
- [ ] Empty states tested
- [ ] Error states tested
- [ ] Production logs checked
- [ ] Database backups enabled
- [ ] HTTPS configured
- [ ] Rate limiting considered

---

# 32. Troubleshooting Prisma

If Prisma reports that a schema line is invalid, format the schema normally.

Use:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then:

```bash
npx prisma format
npx prisma validate
npx prisma generate
```

If the generator reports that `provider` is missing, check that the generator contains:

```prisma
provider = "prisma-client-js"
```

If database connection fails, check:

- Host
- Port
- Database name
- Username
- Password
- SSL requirements
- Pooler/direct connection compatibility
- `DATABASE_URL`

Do not delete production data as a first response to a development error.

---

# 33. Project Principles

## One application

Portfolio, Study, Tests, Finance, and CMS share the same application, authentication, database, UI system, validation, and security patterns.

## Database is the runtime source of truth

GitHub stores source code and content files.

PostgreSQL stores runtime/user data.

## Content is structured

Do not hard-code hundreds of topics inside React pages.

Use structured content data and seed it into PostgreSQL.

## Security is server-side

A hidden button is not security.

Every private operation requires authentication and ownership checks.

## Simple English

Learning content should be easy to understand.

## Tests should be useful

Tests should reveal what needs revision.

## Portfolio claims must be real

Never invent achievements, clients, numbers, experience, or results.

## Architecture must be expandable

The system should make it easy to add:

```text
New study track
New module
New topic
New question type
New finance report
New portfolio section
New dashboard widget
```

without rebuilding the entire application.

---

# Final Definition

```text
                    PORTFOLIO OS
                         |
        +----------------+----------------+
        |                |                |
     PUBLIC            PRIVATE          DATA
   PORTFOLIO         PERSONAL OS       LAYER
        |                |                |
   Projects          Dashboard        PostgreSQL
   Skills            Study            Prisma
   Experience        Tests
   Education         Finance
   Achievements      Portfolio CMS
   Contact
```

The public portfolio represents the developer professionally.

The private OS manages learning, knowledge measurement, finances, and portfolio content.

Authentication isolates private data.

PostgreSQL stores runtime data.

Prisma provides database access.

Structured content files provide the source curriculum.

The entire application should remain secure, fast, maintainable, responsive, and easy to expand.
