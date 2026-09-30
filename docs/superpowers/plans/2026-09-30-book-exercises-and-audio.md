# Textbook Exercises, Speech, and Grammar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align lessons 1–8 with the supplied textbook, add every numbered end-of-lesson exercise section, speak educational selections, and distinguish book content from supplementary grammar.

**Architecture:** Keep the existing static Next.js app and JSON data. Store a source-backed exercise catalog separately from the lesson dialogue and grammar data. Render exercises with a dedicated client component that shares the app's speech helper and local progress state. Keep book notes and supplementary lessons visibly separated on the grammar screen.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, local JSON, Web Speech API, Hanzi Writer, Playwright CLI.

**Spec:** User request in this chat; source PDF `/Users/posh/Study/LNG275/汉语教程第一册上 2.pdf`; existing lesson summary `source/lng275-summary.md`.

## Global Constraints

- The site remains static and deploys on the existing Vercel project without a backend or environment variables.
- Preserve the 204-word vocabulary and all eight lesson routes.
- Chinese examples and numbered exercise sections must trace to the supplied PDF's printed book pages.
- Thai translations and explanations are authored for this site; mark additional knowledge clearly as supplementary.
- Tapping a study or answer choice should call speech for the corresponding Chinese text when a Chinese voice is available.
- Keep the existing cream light theme and usable 375px layout.
- Do not edit the unrelated iOS project or root repository changes.

## Source Map

| Lesson | Book pages | Dialogue lines | Book exercise sections | Exercise pages |
| --- | --- | ---: | ---: | --- |
| 1 | 1–13 | 2 | 6 | 10–13 |
| 2 | 14–20 | 4 | 9 | 17–20 |
| 3 | 21–30 | 8 | 7 | 26–30 |
| 4 | 31–40 | 9 | 7 | 37–40 |
| 5 | 41–50 | 9 | 7 | 45–50 |
| 6 | 51–61 | 25 | 7 | 57–61 |
| 7 | 62–69 | 11 | 8 | 65–69 |
| 8 | 70–77 | 13 | 5 | 73–77 |

The section inventory covers tone and sound drills, reading, questions, dialogue completion, communication, character writing, substitution, retelling, and picture prompts. Book pages above are printed page numbers; the scanned PDF has duplicate/photo pages, so PDF page numbers must be verified per item.

### Task 1: Source-backed lesson and exercise data

**Files:** Create `src/data/book-exercises.json`, `src/data/book-exercises.ts`, `src/data/book-notes.json`; modify `src/data/types.ts`, `src/data/lessons.json`, `scripts/verify-data.ts`.

**Interfaces:** `BookExerciseSection` has `lessonId`, `number`, `kind`, `titleZh`, `titleTh`, `bookPages`, `source`, and typed `items`. `BookNote` has `lessonId`, `title`, `explainTh`, `examples`, `bookPages`, and `source: 'book-note' | 'dialogue-pattern' | 'supplement'`.

- [ ] Compare all 81 existing dialogue lines against PDF text pages and attach their source page and section. Keep each Chinese line, pinyin, and Thai translation together.
- [ ] Record each of the 56 numbered exercise sections with its printed page, section heading, and activity kind. Transcribe book prompts for the interactive parts and retain a clear page reference for oral drills.
- [ ] Record the book's per-lesson notes and assign current grammar points to book notes, dialogue-derived patterns, or supplementary knowledge. Move L1 `是` and any other rule not actually present in that lesson out of the book-note group.
- [ ] Extend the data verifier to assert eight lessons, 56 numbered sections, unique section IDs, valid source pages, Chinese/pinyin/Thai on dialogue lines, and valid answers for interactive exercises.
- [ ] Run `npm run verify:data` and inspect any mismatches against the PDF images.

### Task 2: Interactive textbook exercises

**Files:** Create `src/components/BookExercises.tsx`; modify `src/components/Reviewer.tsx`, `src/app/lesson/[id]/[mode]/page.tsx`, `src/app/globals.css`.

**Interfaces:** `/lesson/{1..8}/exercises` statically renders each lesson's source-backed sections. A section renders the matching interaction: listen/repeat, choice, answer reveal, dialogue gap, substitution, retell, picture prompt, or character writing.

- [ ] Add the `exercises` route to static path generation and a large lesson menu tile.
- [ ] Show numbered sections in the book's order, with `หนังสือหน้า N` and an activity type label.
- [ ] Build the shared answer state keyed by exercise item ID, with immediate feedback and a clear retry action.
- [ ] Reuse `StrokeBox` for writing items and the existing speech helper for oral sections; reserve image space where a picture cue is needed.
- [ ] Keep page navigation and exercise controls usable at 375px and on desktop.

### Task 3: Speech on educational selection

**Files:** Modify `src/components/Reviewer.tsx`, `src/components/BookExercises.tsx`, `src/lib/speak.ts`.

**Interfaces:** Every selected vocabulary quiz choice resolves to its source Hanzi. A tapped Hanzi token reads itself; flashcard reveal and grading read the current word; dialogue and grammar example taps read the displayed Chinese text.

- [ ] Attach a spoken Hanzi value to each quiz option, including pinyin and Thai-label choices.
- [ ] Call speech when the learner selects flashcards, quiz options, sentence tokens, phonetics options, or exercise answers.
- [ ] Preserve the no-Chinese-voice notice and ensure rapid repeated taps cancel the previous utterance before speaking the latest selection.
- [ ] Inspect keyboard and touch interactions so one selection produces one utterance.

### Task 4: Grammar provenance and useful additions

**Files:** Create `src/data/supplemental-grammar.json`; modify `src/components/Reviewer.tsx` or add a focused `GrammarView.tsx`; modify `src/app/globals.css`.

**Interfaces:** Grammar screen first shows book notes with printed page references, then dialogue-derived patterns, then a visually quieter section titled `ความรู้เพิ่มเติม` with a statement that it is supplementary study material.

- [ ] Cover the book's notes for tone marks, tone changes, neutral tone, er suffix, polite forms, names, measure words, word stress, and `吧` where those appear in lessons 1–8.
- [ ] Add concise supplementary guidance for word order, comparing `吗` with verb-not-verb questions, and other exam-relevant distinctions absent from the book notes; label each supplementary card.
- [ ] Add one or two short, unobtrusive lesson tips below core study content, never as a primary feature tile.

### Task 5: Browser audit and production update

**Files:** Update `README.md` with source method and exercise coverage; fix any defects found in app files; no standalone test specification required.

- [ ] Run `npm run verify:data` and `npm run build`.
- [ ] Use Playwright CLI to exercise home, all vocab, all eight lesson menus, dialogue, every exercise kind, grammar, flashcards, quiz, speech interactions, and stroke writing at 375px and desktop.
- [ ] Inspect console errors, broken routes, overflow, missing stroke data, and offline behavior after initial load; repair material issues and recheck those flows.
- [ ] Request read-only code review of the final diff, address material findings, commit and push the nested app repository, deploy production to its existing Vercel project, and verify the public URL.
