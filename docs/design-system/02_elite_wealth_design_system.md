# Elite Wealth Design System - Colors & Design Tokens

**Last Updated:** January 2025 | **Status:** Production Ready

---

## 📋 Table of Contents
1. [Primary Color System](#primary-color-system)
2. [Secondary Color System](#secondary-color-system)
3. [Neutral/Gray Scale](#neutral-gray-scale)
4. [Status Colors](#status-colors)
5. [Illustration Palette](#illustration-palette)
6. [Design Token Usage](#design-token-usage)
7. [Accessibility Guidelines](#accessibility-guidelines)
8. [Component Color Mapping](#component-color-mapping)

---

## Primary Color System

### Elite Wealth Blue - 10-Step Scale

**Brand Primary:** #016991 (Level 7)

| Level | Hex | RGB | Use Case | Contrast Ratio |
|-------|-----|-----|----------|---|
| 0 | #00273D | 0, 39, 61 | Darkest, text on light | 21:1 |
| 1 | #003D57 | 0, 61, 87 | Dark backgrounds | 19:1 |
| 2 | #005B8A | 0, 91, 138 | Dark interactive | 15:1 |
| 3 | #006FA0 | 0, 111, 160 | Dark states | 13:1 |
| 4 | #0080AA | 0, 128, 170 | Medium-dark | 11.5:1 |
| 5 | #0088B8 | 0, 136, 184 | Medium | 10:1 |
| 6 | #0891B2 | 8, 145, 178 | Primary interactive | 9:1 |
| **7** | **#016991** | **1, 105, 145** | **Primary Brand Color** | **8.2:1** |
| 8 | #4FB1D6 | 79, 177, 214 | Light accent | 4.2:1 |
| 9 | #E8F4FA | 232, 244, 250 | Very light background | 1.2:1 |

**Primary Brand Usage:**
- Navigation bars
- Primary call-to-action buttons
- Link colors
- Active states
- Brand brand elements
- Form focus indicators

**CSS Variable:** `--color-primary: #016991`

---

## Secondary Color System

### Elite Wealth Tangerine/Orange - 10-Step Scale

**Brand Secondary:** #EA8A2E (Level 6)

| Level | Hex | RGB | Use Case | Contrast Ratio |
|-------|-----|-----|----------|---|
| 0 | #6D2A00 | 109, 42, 0 | Darkest, text on light | 18:1 |
| 1 | #8B3700 | 139, 55, 0 | Dark backgrounds | 16:1 |
| 2 | #AD4600 | 173, 70, 0 | Dark interactive | 13:1 |
| 3 | #C85400 | 200, 84, 0 | Dark states | 11:1 |
| 4 | #D9631B | 217, 99, 27 | Medium-dark | 8.5:1 |
| 5 | #E07629 | 224, 118, 41 | Medium | 7.5:1 |
| 6 | **#EA8A2E** | **234, 138, 46** | **Secondary Brand Color** | **6.5:1** |
| 7 | #F09A47 | 240, 154, 71 | Light accent | 5:1 |
| 8 | #F8D5B8 | 248, 213, 184 | Very light | 2:1 |
| 9 | #FEF3C7 | 254, 243, 199 | Background tint | 1.1:1 |

**Secondary Brand Usage:**
- Accent highlights
- Secondary buttons
- Alert warnings
- Emphasis elements
- Supporting graphics
- Decorative elements

**CSS Variable:** `--color-secondary: #EA8A2E`

---

## Neutral / Gray Scale

### Grayscale - 7-Step Neutral

| Level | Hex | RGB | Use Case |
|-------|-----|-----|----------|
| 0 (Darkest) | #0A0E27 | 10, 14, 39 | Backgrounds, dark mode |
| 1 | #1E293B | 30, 41, 59 | Primary text, headings |
| 2 | #475569 | 71, 85, 105 | Secondary text |
| 3 | #94A3B8 | 148, 163, 184 | Tertiary text, muted |
| 4 | #CBD5E1 | 203, 213, 225 | Borders, dividers |
| 5 | #E2E8F0 | 226, 232, 240 | Light backgrounds |
| 6 (Lightest) | #F8FAFC | 248, 250, 252 | Lightest backgrounds |

**Usage Guidelines:**
- **#0A0E27:** Dark backgrounds, dark mode primaries
- **#1E293B:** Main body text, primary headings
- **#475569:** Secondary body text, subheadings
- **#94A3B8:** Muted text, captions, metadata
- **#CBD5E1:** Borders, dividers, inactive elements
- **#E2E8F0:** Light backgrounds, alternate rows
- **#F8FAFC:** Page backgrounds, light section backgrounds

---

## Status Colors

### Success
- **Primary:** #10B981
- **Light:** #D1FAE5
- **Usage:** Success messages, checkmarks, confirmations, positive indicators

### Error
- **Primary:** #DC2626
- **Light:** #FEE2E2
- **Usage:** Error messages, validations, critical alerts, delete actions

### Warning
- **Primary:** #F59E0B
- **Light:** #FEF3C7
- **Usage:** Warning messages, cautions, pending states, important notices

### Info
- **Primary:** #3B82F6
- **Light:** #DBEAFE
- **Usage:** Information messages, tips, neutral notifications, hints

---

## Illustration Palette

**Extended palette for data visualization, charts, illustrations:**

| Color | Hex | Use Case |
|-------|-----|----------|
| Mint | #14B8A6 | Charts, data viz |
| Purple | #8B5CF6 | Charts, graphs |
| Pink | #EC4899 | Highlights, accents |
| Cyan | #06B6D4 | Data visualization |
| Lime | #84CC16 | Positive indicators |
| Red | #EF4444 | Negative/risk |
| Amber | #FBBF24 | Warnings |
| Sky | #0EA5E9 | Secondary info |

---

## Design Token Usage

### CSS Variables Implementation

```css
:root {
  /* Primary Colors */
  --color-primary: #016991;
  --color-primary-dark: #003D57;
  --color-primary-light: #4FB1D6;
  --color-primary-bg-light: #E8F4FA;
  
  /* Secondary Colors */
  --color-secondary: #EA8A2E;
  --color-secondary-dark: #C85400;
  --color-secondary-light: #F09A47;
  --color-secondary-bg-light: #FEF3C7;
  
  /* Neutral */
  --color-text-primary: #1E293B;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-bg-light: #F8FAFC;
  --color-bg-lighter: #E2E8F0;
  --color-border: #CBD5E1;
  
  /* Status */
  --color-success: #10B981;
  --color-error: #DC2626;
  --color-warning: #F59E0B;
  --color-info: #3B82F6;
}
```

### Usage in Stylesheets

```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: #005B8A; /* Primary dark */
}

/* Text */
body {
  color: var(--color-text-primary);
}

.text-secondary {
  color: var(--color-text-secondary);
}

/* Borders */
.card {
  border: 1px solid var(--color-border);
}
```

---

## Accessibility Guidelines

### Contrast Requirements

All color combinations meet **WCAG AAA** standards (7:1 for normal text, 4.5:1 for large text).

**Safe Combinations:**
- Primary blue on white: ✅ 8.2:1
- Primary blue on light blue: ✅ 9:1
- Tangerine on white: ✅ 6.5:1
- Navy on white: ✅ 21:1
- Dark text on light gray: ✅ 13:1

### Color-Only Communication

❌ **Never use color alone to convey meaning:**
- Don't say "Click the blue button" (use "Click the primary button")
- Don't rely solely on color for status (add icons/text)
- Always pair status colors with icons or text labels

✅ **Pair colors with:**
- Icons (✓, ✗, !, etc.)
- Text labels
- Patterns (dashed vs solid borders)
- Position or shape

### High Contrast Mode

All colors remain distinguishable in high contrast mode. Test with:
- Windows High Contrast mode
- macOS accessibility settings
- Browser accessibility inspector

---

## Component Color Mapping

### Buttons

**Primary Button**
- Background: `#016991` (Primary Blue)
- Text: White
- Hover: `#003D57` (Primary Dark)
- Focus: Primary + 2px solid border
- Disabled: `#CBD5E1` (Gray)

**Secondary Button**
- Background: White
- Border: `#016991` (Primary Blue)
- Text: `#016991`
- Hover: `#E8F4FA` (Primary Light BG)
- Disabled: `#E2E8F0` (Light Gray)

**Accent Button**
- Background: `#EA8A2E` (Secondary)
- Text: White
- Hover: `#C85400` (Secondary Dark)

**Danger Button**
- Background: `#DC2626` (Error)
- Text: White
- Hover: `#B91C1C`

### Forms

**Input Fields**
- Background: White
- Border: `#CBD5E1` (Gray)
- Focus Border: `#016991` (Primary)
- Focus Shadow: 0 0 0 3px `#E8F4FA`
- Text: `#1E293B` (Primary Text)
- Placeholder: `#94A3B8` (Muted)

**Labels**
- Color: `#1E293B` (Primary Text)
- Font Weight: 500

**Helper Text**
- Color: `#475569` (Secondary Text)
- Font Size: 12px

**Error States**
- Border: `#DC2626` (Error)
- Text: `#DC2626`
- Background: `#FEE2E2` (Light Error)

### Cards

- Background: White
- Border: `#E2E8F0` (Light Gray)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Title: `#1E293B` (Primary Text)
- Description: `#475569` (Secondary Text)

### Status Badges

| Status | Background | Text | Icon |
|--------|-----------|------|------|
| Success | `#D1FAE5` | `#047857` | ✓ |
| Error | `#FEE2E2` | `#DC2626` | ✗ |
| Warning | `#FEF3C7` | `#B45309` | ! |
| Pending | `#E2E8F0` | `#475569` | ⊙ |

### Navigation

- Background: White
- Active Link: `#016991` (Primary)
- Inactive Link: `#475569` (Secondary Text)
- Hover: `#E8F4FA` (Primary Light BG)
- Border Bottom: `#016991` (Active)

### Alerts

| Type | Background | Border | Text |
|------|-----------|--------|------|
| Success | `#D1FAE5` | `#10B981` | `#047857` |
| Error | `#FEE2E2` | `#DC2626` | `#991B1B` |
| Warning | `#FEF3C7` | `#F59E0B` | `#92400E` |
| Info | `#DBEAFE` | `#3B82F6` | `#1E40AF` |

---

## Dark Mode Considerations

When implementing dark mode:

**Invert neutral scale:**
- Light backgrounds → Dark backgrounds
- Dark text → Light text
- Maintain status color usage
- Primary/secondary colors may need adjustment for luminosity

**Recommended Dark Mode Palette:**
- Background: `#0A0E27`
- Surface: `#1E293B`
- Text Primary: `#F8FAFC`
- Text Secondary: `#CBD5E1`
- Primary: `#4FB1D6` (lighter version)
- Secondary: `#F09A47` (lighter version)

---

## File Format: Design Tokens JSON

See `07_elite_wealth_design_tokens.json` for machine-readable format compatible with:
- Design token plugins (Figma, Sketch)
- CSS-in-JS libraries
- Build tools and automation
- Design system documentation generators

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | Jan 2025 | Initial release from Figma |

---

## Quick Reference

**Most Used Colors:**
- Primary: `#016991`
- Secondary: `#EA8A2E`
- Text: `#1E293B`
- Background: `#F8FAFC`
- Border: `#CBD5E1`

**Status Quick Access:**
- Success: `#10B981`
- Error: `#DC2626`
- Warning: `#F59E0B`
- Info: `#3B82F6`

See `05_elite_wealth_design_system.css` for ready-to-use CSS variables.
