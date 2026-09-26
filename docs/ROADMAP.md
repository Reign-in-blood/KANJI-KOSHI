# KANJI KŌSHI — Roadmap

This document is the working roadmap for KANJI KŌSHI.

The goal is to keep development focused: build a useful N5/N4 learning application first, then add quiz modes, progress tracking, accounts and advanced features only when the core experience is solid.

---

## Product principles

### Current V1 target

- JLPT N5 and N4
- Kanji revision
- Multiple-choice quizzes
- Hiragana / katakana later in the same application
- Desktop and mobile-responsive web app
- No mandatory user account
- No settings/configuration page

### Interaction rule

Avoid setup screens and settings menus.

Controls that users need frequently belong directly on the page where they are used. Everything else should use sensible defaults chosen by KANJI KŌSHI.

Examples:

- Revision page: N5 / N4 selection, pause, reveal, next
- Quiz page: level and quiz type controls
- Kana page: hiragana / katakana and group controls

Fixed V1 defaults:

- thinking time: 4 seconds
- answer display time: 3 seconds

These values can be reconsidered later if real usage shows a need.

### Later expansion

The architecture should remain compatible with:

- JLPT N3, N2 and N1
- spaced repetition
- cloud sync
- optional user accounts
- installable PWA
- possible native mobile wrapper
- handwriting / drawing exercises

These are not V1 requirements.

---

# Main application pages

## 1. Home

Purpose:

- establish the KANJI KŌSHI identity
- provide direct access to learning modes
- make Revision immediately visible as the primary V1 action
- show a small progress summary later when progress tracking exists

Primary destinations:

- Revision
- Quiz
- Kana
- Progress

No settings shortcut or session configuration step.

---

## 2. Revision

Timed kanji revision mode.

The page opens directly into the learning interface. There is no configuration screen before it.

Core flow:

```text
Kanji
  ↓
4 s thinking time
  ↓
answer reveal
  ↓
3 s answer display
  ↓
next kanji
```

Controls directly on the page:

- N5
- N4
- N5 + N4 by selecting both
- pause / resume
- reveal immediately
- next / skip

Displayed information after reveal:

- kanji
- JLPT level
- ON readings
- KUN readings
- French meanings

---

## 3. Quiz

Multiple-choice learning modes.

Controls belong directly on the Quiz page.

### Kanji → meaning

```text
食

Que signifie ce kanji ?

○ boire
○ manger
○ marcher
○ parler
```

### Meaning → kanji

```text
Quel kanji signifie « manger » ?

○ 飲
○ 食
○ 見
○ 行
```

### Kanji → reading

```text
Quelle lecture est valide pour 食 ?

○ た.べる
○ の.む
○ み.る
○ か.く
```

Quiz requirements:

- direct N5 / N4 level controls
- direct quiz-type controls
- plausible distractors
- support for multiple valid readings
- score tracking
- session results
- retry mistakes
- no silent ambiguity in accepted answers

---

## 4. Kana

Separate learning area for kana.

Controls belong directly on the page:

- Hiragana / Katakana
- base kana
- dakuten / handakuten
- combinations when available

Planned content:

- basic hiragana
- dakuten
- handakuten
- small kana
- hiragana combinations
- katakana
- kana → romaji quiz
- romaji → kana quiz
- independent progress tracking

The current legacy hiragana data is reference material only until this module is implemented.

---

## 5. Progress

Progress and learning history.

Initial states:

```text
À apprendre
En cours
Connu
```

Per-kanji statistics may include:

- times seen
- correct answers
- wrong answers
- success percentage
- last reviewed date
- learning status
- marked for review

Planned modes:

- review mistakes
- review weak kanji
- review manually marked kanji

More advanced spaced repetition can be added later.

---

# User accounts and persistence

## V1

No user account and no preferences/settings system.

When progress tracking is implemented, browser storage can initially hold learning history locally.

Application code should use `src/core/storage.js` as an abstraction instead of coupling progress logic directly to `localStorage`.

```text
Application
    ↓
storage.js
    ↓
localStorage
```

This preserves a future path to:

```text
Application
    ↓
storage.js
    ↓
local storage + optional cloud sync
```

## Later: optional account

Possible later features:

- email login
- Google login
- cloud backup
- desktop/mobile synchronization
- account recovery
- data export
- data deletion

A cloud account introduces additional requirements:

- backend/database
- authentication
- synchronization rules
- offline conflict handling
- privacy / GDPR handling

It is intentionally postponed until the local application is useful on its own.

---

# Development phases

## Phase 1 — Foundations

Status: complete for the current scope.

- [x] Initialize Vite project
- [x] Establish Git workflow
- [x] Organize project directories
- [x] Preserve legacy prototype
- [x] Preserve historical PDF/XLSX/CSV sources
- [x] Create normalized kanji data pipeline
- [x] Restrict V1 dataset to N5/N4
- [x] Add French meanings
- [x] Add source attribution / licensing
- [x] Add structural data validation
- [x] Add runtime data loader
- [x] Add basic quiz session engine
- [x] Add countdown timer
- [x] Add automated core tests
- [x] Add temporary functional browser interface
- [x] Define initial design system
- [x] Define product roadmap

---

## Phase 2 — UI V1

Status: in progress.

Goal: turn the technical prototype into the first recognizable KANJI KŌSHI experience.

- [x] Create `feature/ui-v1`
- [x] Build global application shell
- [x] Build global navigation
- [x] Create Home page
- [x] Apply initial Sakura-inspired visual direction
- [x] Create reusable UI structure in vanilla JS
- [x] Integrate the existing Revision engine into the new shell
- [ ] Create final Revision page
- [ ] Keep N5 / N4 controls directly on Revision page
- [ ] Display large central kanji
- [ ] Display JLPT level
- [ ] Display ON readings
- [ ] Display KUN readings
- [ ] Display French meanings
- [ ] Integrate visible timer/progress bar
- [ ] Add start
- [ ] Add pause/resume
- [ ] Add reveal
- [ ] Add next/skip
- [ ] Add clean return-to-home behavior
- [ ] Make desktop layout responsive
- [ ] Make mobile layout usable
- [ ] Test keyboard/mouse/touch interactions
- [ ] Preserve accessibility basics

There is deliberately no configuration screen and no Settings page.

---

## Phase 3 — Multiple-choice quiz

- [ ] Create Quiz page
- [ ] Put level/type controls directly on the page
- [ ] Add Kanji → meaning quiz
- [ ] Add Meaning → kanji quiz
- [ ] Add Kanji → reading quiz
- [ ] Generate plausible distractors
- [ ] Handle multiple valid readings safely
- [ ] Track answers during a session
- [ ] Show current score
- [ ] Create session result screen
- [ ] Show mistakes
- [ ] Add retry-mistakes action
- [ ] Add automated tests for quiz generation

---

## Phase 4 — Progress tracking

- [ ] Define progress data model
- [ ] Implement `src/core/storage.js`
- [ ] Record kanji seen
- [ ] Record correct answers
- [ ] Record wrong answers
- [ ] Record last review date
- [ ] Calculate success percentage
- [ ] Add learning status: À apprendre / En cours / Connu
- [ ] Allow manual status changes
- [ ] Allow marking a kanji for review
- [ ] Create Progress page
- [ ] Add N5/N4 progress summaries
- [ ] Add review-mistakes mode
- [ ] Add weak-kanji mode

---

## Phase 5 — Kana

- [ ] Audit existing hiragana source
- [ ] Normalize hiragana data
- [ ] Add small hiragana
- [ ] Add combination kana
- [ ] Add katakana dataset
- [ ] Create Kana page
- [ ] Put kana controls directly on the page
- [ ] Add kana → romaji quiz
- [ ] Add romaji → kana quiz
- [ ] Track kana progress separately

---

## Phase 6 — Advanced learning

Only after the core application is stable.

- [ ] Typed-answer mode
- [ ] French synonym handling
- [ ] Japanese reading input handling
- [ ] Optional romaji input
- [ ] Spaced repetition algorithm
- [ ] Adaptive weak-item selection
- [ ] Daily goals
- [ ] Optional streaks
- [ ] Vocabulary module
- [ ] More detailed session statistics

---

## Phase 7 — Account and cloud sync

Optional future phase.

- [ ] Choose backend/authentication provider
- [ ] Define cloud user data model
- [ ] Add optional account creation
- [ ] Add login/logout
- [ ] Add cloud backup
- [ ] Synchronize local and cloud progress
- [ ] Handle offline/online conflicts
- [ ] Add account recovery
- [ ] Add data export
- [ ] Add account/data deletion
- [ ] Add required privacy/GDPR documentation

---

## Phase 8 — PWA / mobile

- [ ] Add web app manifest
- [ ] Add app icons
- [ ] Add service worker
- [ ] Support offline application shell
- [ ] Support offline learning data
- [ ] Test installability on Android
- [ ] Test installability on iOS
- [ ] Evaluate Capacitor only if native capabilities are needed
- [ ] Evaluate handwriting/drawing exercises separately

---

# Not planned for the immediate V1

To avoid scope creep, do not prioritize these yet:

- Settings/configuration page
- pre-session configuration screen
- N3 / N2 / N1
- mandatory accounts
- backend
- social features
- leaderboards
- achievements
- complex gamification
- AI-generated learning content
- handwriting recognition
- native Android/iOS application
- advanced spaced repetition
- vocabulary overhaul

---

# Current next step

Current branch:

```text
feature/ui-v1
```

Immediate objective:

> Build the Home page and global application shell, then integrate the already working Revision mode into that interface.

The UI should follow `docs/DESIGN-SYSTEM.md` and keep controls close to the activity they affect.
