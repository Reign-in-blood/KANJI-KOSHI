# Quiz engine

The quiz engine is intentionally independent from the final interface.

## Current V1 behavior

- Active JLPT filters: N5 and N4.
- A session can use N5, N4, or both.
- Questions are drawn from a shuffled bag.
- Every selected kanji is shown once before a new cycle starts.
- The first item of a new cycle is prevented from immediately repeating the previous item when possible.
- Session phases are `idle`, `question`, and `answer`.
- The countdown timer supports start, pause, resume and stop.

## Temporary browser test

The current UI is a functional test harness, not the final visual design.

Default timing:

- 4 seconds to think.
- Answer is then displayed for 3 seconds.
- The next kanji starts automatically.

Manual controls allow pause/resume, immediate answer reveal and next/skip.

Run:

```bash
npm run dev
```

Automated core tests:

```bash
npm test
```
