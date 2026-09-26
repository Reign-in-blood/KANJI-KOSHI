# KANJI KŌSHI — Design System

This document records the initial visual direction for the application. It is a reference for later UI work and is not yet the final implementation.

## Visual direction

KANJI KŌSHI should feel Japanese-inspired and Sakura-influenced without becoming visually overloaded.

Principles:

- soft Sakura atmosphere
- clean, modern interface
- warm off-white backgrounds
- restrained use of bright pink
- dark burgundy for structure, headings and primary actions
- generous whitespace
- readable Japanese typography
- avoid decorative clichés that reduce usability

## Core palette

| Role | Variable | Value | Intended use |
|---|---|---|---|
| Sakura | `--color-sakura` | `#F9D8DB` | soft decorative areas, backgrounds, highlights |
| Accent | `--color-accent` | `#F077AF` | small accents, active details, decorative emphasis |
| Primary | `--color-primary` | `#913343` | primary buttons, headings, strong UI structure |

Supporting colors:

```css
:root {
  /* Brand */
  --color-sakura: #F9D8DB;
  --color-accent: #F077AF;
  --color-primary: #913343;

  /* Backgrounds */
  --color-bg: #FFF9F8;
  --color-surface: #FFFFFF;
  --color-surface-soft: #FDF1F2;

  /* Text */
  --color-text: #2A2022;
  --color-text-muted: #725E63;
  --color-text-on-primary: #FFFFFF;

  /* UI */
  --color-border: #E8C9CD;
  --color-progress-track: #F1DDE0;
  --color-progress: var(--color-primary);

  /* States */
  --color-success: #587A62;
  --color-warning: #A56B32;
  --color-error: #A13E49;
}
```

## Color usage

Preferred hierarchy:

```text
General background      #FFF9F8
Sakura areas            #F9D8DB
Decorative accent       #F077AF
Buttons / headings      #913343
Main text               #2A2022
Cards / surfaces        #FFFFFF
```

Guidelines:

- Do not use bright pink everywhere.
- Use `#F077AF` primarily as an accent.
- Use `#913343` for primary actions and important text.
- Prefer white or off-white surfaces for readability.
- Use `#FFFFFF` text on `#913343` primary controls.

## Typography

Current preferred families:

### Interface

`Noto Sans JP`

Use for:

- navigation
- buttons
- labels
- settings
- French text
- Japanese UI text
- readings

### Kanji display

`Noto Serif JP`

Use for:

- large central kanji
- prominent Japanese characters where a more traditional appearance is useful

Initial variables:

```css
:root {
  --font-ui: "Noto Sans JP", sans-serif;
  --font-kanji: "Noto Serif JP", serif;
}
```

A third font may be considered later for the KANJI KŌSHI wordmark/logo only. Do not add one unless it clearly improves the identity.

## Shared UI tokens

Use CSS custom properties in `:root` instead of hard-coded values throughout components.

Initial proposal:

```css
:root {
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;

  /* Shadow */
  --shadow-card: 0 8px 30px rgb(145 51 67 / 10%);

  /* Animation */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

## Example usage

```css
body {
  font-family: var(--font-ui);
  color: var(--color-text);
  background: var(--color-bg);
}

.kanji-character {
  font-family: var(--font-kanji);
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.button-primary {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  border-radius: var(--radius-md);
}
```

## Status

This is the initial agreed direction for future UI work.

Before final UI implementation, verify:

- actual font loading strategy
- typography weights
- focus states
- hover states
- contrast of secondary text
- mobile spacing
- final Sakura background/assets
- final logo treatment
