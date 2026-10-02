# Quiz and Review Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Make sentence quizzes work in every lesson, expose complete combined quizzes, and correct review and answer audio.

**Architecture:** Keep the existing Next.js reviewer and route structure. Fix sentence splitting in the quiz helper; build quiz pools from the selected lesson or all 204 main words independently of list scope; centralize speech at quiz submission and word advancement.

**Tech Stack:** Next.js 15, React 19, TypeScript, browser SpeechSynthesis, Playwright CLI.

**Spec:** `docs/superpowers/specs/2026-10-02-quiz-and-review-fixes.md`

## Global Constraints

- Keep the existing Vercel site and GitHub repository.
- Do not alter the user's iOS project in the workspace root.
- Preserve lesson-specific quiz scope behavior; combined quiz uses all 204 main vocabulary records.
- Verify in a real browser because the report concerns interactions and speech.

---

### Task 1: Sentence ordering in every lesson

**Files:** Modify `src/lib/quiz.ts`, `src/components/Reviewer.tsx`.

**Interfaces:** `sentenceTokens(sentence, words)` returns at least two ordered tokens for every textbook dialogue line used as a quiz; `createQuiz` receives those tokens and never silently leaves the setup screen.

- [x] Confirm the current Lesson 1 sentence quiz stays on its setup screen when Start is clicked.
- [x] Make the tokenizer split an entire-sentence dictionary match into constituent words or characters, while retaining normal longest-word matching elsewhere.
- [x] Show a clear message if a selected quiz mode ever has zero eligible questions.
- [x] Reopen Lesson 1 and finish an ordering question; check sentence questions in every lesson.

### Task 2: Complete combined quizzes

**Files:** Modify `src/components/Reviewer.tsx`, and its existing styles in `src/app/globals.css` only if needed.

**Interfaces:** The home page opens `/lesson/all/quiz`. In that route, the three vocabulary quiz modes contain 204 questions for Full and 10 unique random questions for Short; sentence mode covers all 76 distinct orderable textbook dialogue lines. Lesson routes keep their own vocabulary pool.

- [x] Add a visible combined quiz action on the home page and combined lesson page.
- [x] Derive combined quiz questions from `vocab` rather than the current scoped list.
- [x] Present 10 random or Full as explicit choices, with the available Full count for the selected mode.
- [x] Open all four modes through the home page and check displayed counts and lesson coverage in the browser.

### Task 3: Correct spoken word and spoken answer

**Files:** Modify `src/components/Reviewer.tsx`.

**Interfaces:** All single-word-review advancement buttons call a shared advance helper that speaks the next visible word. `finishQuizQuestion` speaks `question.sentence` for sentence mode and the target Hanzi for vocabulary modes.

- [x] Replace current-word speech in single-word-review grade buttons with next-word speech.
- [x] Move multiple-choice speech from the clicked option into answer submission, so an incorrect selection reads the correct word.
- [x] Submit a wrong answer in each quiz direction and an incorrect sentence order; inspect SpeechSynthesis utterance text in the browser.
- [x] Use the single-word next and grade buttons and check speech matches the newly displayed Hanzi.

### Task 4: Review and publish

**Files:** Review the changed files and the plan; no new runtime files.

- [x] Check types, data consistency, and build output.
- [x] Run browser checks on a narrow viewport and look for console errors.
- [x] Request code review and fix material findings.
- [x] Commit, push to `main`, and verify the existing Vercel URL serves the new version.
