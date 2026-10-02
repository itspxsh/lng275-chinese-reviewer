# Textbook New Words Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every lesson's vocabulary review contain exactly its textbook New Words in printed order, with the permitted Lesson 2 addition.

**Architecture:** `lessons.json` holds ordered vocabulary IDs for each lesson. A small selector module resolves those IDs and their union; review screens consume selectors instead of the broad `lessons` occurrence tags. Keep other vocabulary records for dialogue, exercises, and distractors.

**Tech Stack:** Next.js 15, React 19, TypeScript, JSON course data, source textbook PDF.

**Spec:** `docs/superpowers/specs/2026-10-03-book-new-words.md`

## Global Constraints

- Use the local *汉语教程 第一册 上* PDF and its 生词 / New Words sections as the sole printed vocabulary source.
- Lesson 2 includes one allowed addition: 姐姐 after the printed words.
- Preserve the existing website and other book learning content.
- Keep full review in book order; the ten-question quiz option may randomize its selection.

---

### Task 1: Correct the source list

**Files:** Modify `src/data/lessons.json`, `src/data/vocab.json`; create `src/data/book-vocab.ts`.

**Interfaces:** `bookVocabForLesson(lesson)` returns the ordered words named by `lesson.vocabIds`; `allBookVocab` is their unique ordered union.

- [x] Transcribe all eight New Words sections, including unnumbered entries, and record their exact order and counts.
- [x] Replace each `vocabIds` list with those IDs; add the four required records for 姐姐, 块（元）, 角（毛）, and （一）点儿.
- [x] Set the book page metadata of selected entries to their New Words page and mark 姐姐 as an addition.
- [x] Check that every selected ID exists, appears only once across lesson lists, and matches the eight expected counts.

### Task 2: Use the source list throughout the reviewer

**Files:** Modify `src/components/Reviewer.tsx`, `src/components/BookExercises.tsx`, and any short UI copy needed.

**Interfaces:** Lesson review, reading, flashcards, focus, writing, quizzes, progress, and the combined vocabulary bank consume the selectors rather than `Vocab.lessons` occurrence tags.

- [x] Replace occurrence-based selection with ordered book vocabulary selectors.
- [x] Remove controls that silently hide textbook words or reorder ordinary review; keep search and explicit quiz sampling.
- [x] Ensure navigation from an individual list entry starts the matching word in the same ordered queue.
- [x] Keep the combined bank and full quizzes in book order, with a distinct random 10-question option.

### Task 3: Verify and publish

**Files:** Update `scripts/verify-data.ts` and documentation where counts changed.

- [x] Check the eight lists against the rendered source PDF and data consistency script.
- [x] Build the site and inspect lesson review paths in a browser, including Lesson 2 and Lesson 8.
- [x] Review changes, publish to the existing site, and confirm the public site shows the corrected order/counts.
