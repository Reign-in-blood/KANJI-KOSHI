# KANJI KŌSHI — Roadmap

This document is the working roadmap for KANJI KŌSHI.

The goal is to keep development focused: build a useful N5/N4 learning application first, then add progression, accounts and advanced features only when the core experience is solid.

---

## Product scope

### Current V1 target

- JLPT N5 and N4
- Kanji revision
- Multiple-choice quizzes
- Hiragana / katakana later in the same application
- Desktop and mobile-responsive web app
- Local-first persistence
- No mandatory user account

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

- explain what KANJI KŌSHI does
- provide quick access to learning modes
- resume the last session
- show a small progress summary when progress tracking exists

Possible actions:

- Start timed revision
- Start quiz
- Study kana
- View progress
- Open settings

---

## 2. Revision

Timed kanji revision mode.

Core flow:

```text
Kanji
  ↓
thinking timer
  ↓
answer reveal
  ↓
answer display timer
  ↓
next kanji
```

Session options:

- N5
- N4
- N5 + N4
- thinking duration
- answer display duration
- automatic reveal
- manual reveal
- automatic next
- manual next / skip
- pause / resume

Displayed information after reveal:

- kanji
- JLPT level
- ON readings
- KUN readings
- French meanings

---

## 3. Quiz

Multiple-choice learning modes.

### Kanji → meaning

Example:

```text
食

What does this kanji mean?

○ boire
○ manger
○ marcher
○ parler
```

### Meaning → kanji

Example:

```text
Which kanji means "manger"?

○ 飲
○ 食
○ 見
○ 行
```

### Kanji → reading

Example:

```text
Which is a valid reading of 食?

○ た.べる
○ の.む
○ み.る
○ か.く
```

Quiz requirements:

- plausible distractors
- support for multiple valid readings
- score tracking
- session results
- retry mistakes
- no silent ambiguity in accepted answers

---

## 4. Kana

Separate learning area for kana.

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

## 6. Settings

Planned settings:

- default JLPT levels
- thinking timer
- answer display timer
- automatic/manual reveal
- automatic/manual next
- interface preferences
- sound preferences if sound is added later

Settings should be stored locally in V1.

---

# User accounts and persistence

## V1: local-first

No mandatory account.

Use browser storage for:

- selected levels
- timer settings
- interface preferences
- quiz history
- kanji progress
- learning status

The application should remain usable without a network connection once PWA support is added.

## Architecture requirement

Application code must not depend directly on `localStorage`.

Use `src/core/storage.js` as an abstraction:

```text
Application
    ↓
storage.js
    ↓
localStorage
```

This allows a later architecture such as:

```text
Application
    ↓
storage.js
    ↓
local storage + cloud sync
```

without rewriting the quiz and UI logic.

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

Therefore it is intentionally postponed until the local application is useful on its own.

---

# Development phases

## Phase 1 — Foundations

Status: substantially complete.

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

---

## Phase 2 — UI V1

Status: next major development phase.

Goal: turn the technical prototype into the first real KANJI KŌSHI experience.

- [ ] Create `feature/ui-v1`
- [ ] Define global navigation
- [ ] Create Home page
- [ ] Implement Sakura-inspired visual direction
- [ ] Create reusable layout/components in vanilla JS
- [ ] Create revision session configuration screen
- [ ] Create final revision screen
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
- [ ] Add clean end/reset behavior
- [ ] Support N5 only
- [ ] Support N4 only
- [ ] Support N5 + N4
- [ ] Make desktop layout responsive
- [ ] Make mobile layout usable
- [ ] Test keyboard/mouse/touch interactions
- [ ] Preserve accessibility basics

---

## Phase 3 — Settings and local persistence

- [ ] Implement `src/core/storage.js`
- [ ] Store selected levels
- [ ] Store thinking duration
- [ ] Store answer duration
- [ ] Store automatic/manual behavior
- [ ] Restore preferences on page load
- [ ] Add reset-to-defaults action
- [ ] Version stored settings for future migrations

---

## Phase 4 — Multiple-choice quiz

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

## Phase 5 — Progress tracking

- [ ] Define progress data model
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

## Phase 6 — Kana

- [ ] Audit existing hiragana source
- [ ] Normalize hiragana data
- [ ] Add small hiragana
- [ ] Add combination kana
- [ ] Add katakana dataset
- [ ] Create kana learning screen
- [ ] Add kana → romaji quiz
- [ ] Add romaji → kana quiz
- [ ] Track kana progress separately

---

## Phase 7 — Advanced learning

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

## Phase 8 — Account and cloud sync

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

## Phase 9 — PWA / mobile

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

The immediate next development branch should be:

```text
feature/ui-v1
```

Primary objective:

> Build a recognizable, responsive KANJI KŌSHI interface around the already working N5/N4 data layer, quiz session engine and timer.

The temporary functional test interface should remain replaceable and must not dictate the final visual architecture.
