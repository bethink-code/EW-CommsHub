# Claude Code Instructions for EW Communications Hub

> **QUICK PRIMER** — Read this first every session:
> - This is a **management/insights layer** on top of the **commtype schema** (7 archetypes) — NOT a messaging app
> - Mantra: **"Look like a chat but don't be a chat"** — stateful flows, not free-form
> - **Single source of truth**: All tokens in `elite-wealth-design-system.css` — no hardcoded values
> - Before styling: check existing classes, use CSS variables, match the reference spec exactly

---

## Project Vision & Strategy

### What This Is
**Elite Wealth Communications Hub** - A professional-grade client communication management system for financial advisors. This is the **orchestration layer** that sits above all other platform functions — the "nervous system" of the Elite Wealth suite.

**Full vision brief:** See `docs/VISION_BRIEF.md` for complete context.

### The Problem We're Solving
Elite Wealth has 47+ different message types scattered across the platform:
- **Fragmented experience** — Clients receive disconnected messages
- **Channel chaos** — No coherent communication strategy
- **Platform voice** — Messages sound like a system, not their trusted adviser
- **No memory** — Each communication starts from zero context

---

## Core Architecture: The Commtype Schema

**THIS IS THE FOUNDATION OF EVERYTHING.**

The Communications Hub is a **management and insights layer** built on top of a structured commtype schema. Every communication in the system inherits from one of 7 archetypes:

| Archetype | Purpose | Example |
|-----------|---------|---------|
| **Workflow** | Multi-step process with client actions | Onboarding, document collection |
| **Request** | Ask client for something specific | Document request, information update |
| **Notification** | Inform client of something | Policy update, system notification |
| **Alert** | Urgent, requires acknowledgment | Security alert, time-sensitive matter |
| **Broadcast** | One-to-many, marketing-aware | Newsletter, market update |
| **Touchpoint** | Relationship building, personal | Birthday, anniversary, milestone |
| **Conversation** | Free-form but tracked | Ad-hoc adviser communication |

### The Mantra: "Look like a chat but don't be a chat"

| What It IS | What It ISN'T |
|------------|---------------|
| Stateful conversation flows | Free-form chat |
| Predefined states with clear progression | Open-ended back-and-forth |
| Structured responses | Arbitrary text replies |
| Clear beginning and end | Endless thread |
| Platform-managed follow-ups | Adviser manually chasing |

**When building any feature, ask:** "Which commtype archetype does this serve? How does it fit the schema?"

---

### The 7 Design Principles
Every feature decision should align with these:

1. **Adviser voice, not platform voice** — Feel like it comes from a person, not a system
2. **Context over templates** — Smart defaults with human judgment
3. **Silence is a valid choice** — Not sending is sometimes right
4. **Compliance confidence** — Make the right thing easy, not scary
5. **Progressive disclosure** — Simple surface, depth available
6. **Relationship-first metrics** — Measure relationship health, not volume sent
7. **Respect the attention budget** — Every message costs client attention

### Strategic Goals
1. **Professional & Trustworthy** - Financial services require a clean, professional aesthetic that builds trust. No flashy design, no gimmicks.
2. **Consistency with Elite Wealth Suite** - This must match the look and feel of other Elite Wealth applications exactly. The reference app renders perfectly - this one should too.
3. **Advisor Efficiency** - Every feature should help advisors communicate with clients faster and more effectively. If a feature adds complexity without clear value, question it.
4. **Maintainable Codebase** - Single source of truth patterns. Change in one place = updates everywhere. No scattered duplicate code.

### Critical Architecture Principle: Single Source of Truth
The CSS architecture follows a strict hierarchy:
- **All design tokens live in ONE file**: `elite-wealth-design-system.css`
- **Change a value once** → it updates everywhere
- **No duplicate definitions** across files
- **No hardcoded values** in components - always use CSS variables

### When to Push Back
**Challenge a request if it:**
- Breaks visual consistency with the Elite Wealth design system
- Adds unnecessary complexity for marginal benefit
- Uses inline styles or hardcoded values instead of design tokens
- Creates a one-off pattern that should be reusable
- Conflicts with the professional, clean aesthetic (e.g., excessive animations, bright colors, playful elements)
- Would require duplicating styles across multiple files
- Uses font sizes, colors, or spacing that don't match the reference spec below
- Makes communications feel like they come from "a system" instead of the adviser
- Doesn't respect the client's attention budget
- **Treats this as a "messaging app"** — it's a management/insights layer on structured commtypes
- **Doesn't fit one of the 7 commtype archetypes** — every feature should map to the schema
- **Turns structured flows into free-form chat** — "Look like a chat but don't be a chat"

**Ask clarifying questions like:**
- "This would create inconsistency with [X]. Should we update the design system pattern instead?"
- "This feature adds complexity - what's the core user problem we're solving?"
- "The spec shows [X] but you're asking for [Y]. Which should we follow?"
- "This uses a hardcoded value - should I add it to the design system tokens instead?"
- "Does this serve the relationship, or just the transaction?"

---

## Design System - MANDATORY

**Always use the Elite Wealth Design System for all styling work.**

### Primary CSS Files (in order of importance):
1. `src/app/elite-wealth-design-system.css` - **Single source of truth** for all tokens
2. `src/app/elite-wealth-typography.css` - Typography system
3. `src/app/elite-wealth-inputs.css` - Form inputs

### Before Writing Any CSS or Styling:
1. Check if a design system class already exists
2. Use CSS variables, never hardcode colors/sizes
3. If a new pattern is needed, add it to `elite-wealth-design-system.css`

### Token Reference (Quick Access):

**Font Sizes:**
- `--font-size-xs: 12px` - Table headers, small labels
- `--font-size-sm: 14px` - Body text, inputs, buttons
- `--font-size-base: 16px` - Standard content
- `--font-size-lg: 18px` - Section titles
- `--font-size-xl: 20px` - Card titles
- `--font-size-2xl: 24px` - Page headings

**Font Weights:**
- `--font-weight-normal: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600`
- `--font-weight-bold: 700`

**Colors:**
- `--ew-blue: #016991` - Primary brand
- `--ew-orange: #F97415` - Secondary/accent
- `--text-primary: #111827` - Main text (gray-900)
- `--text-secondary: #374151` - Secondary text (gray-700)
- `--text-muted: #6b7280` - Muted text (gray-500)
- `--border-default: #e5e7eb` - Standard borders

**Icons (ALWAYS OUTLINED):**
- Use `material-icons-outlined` class, NOT `material-icons`
- Icons should be outline style, never filled
- Example: `<span className="material-icons-outlined">delete</span>`

**Button Classes:**
- `.btn-primary` - Blue primary button
- `.btn-secondary` - White with gray border
- `.btn-ghost` - Transparent
- `.btn-destructive` - Red for dangerous actions

**Icon Buttons (sizes):**
- `.btn-icon` / `.btn-icon-lg` - 40px - Header actions, standalone
- `.btn-icon-md` - 32px - Table row actions, toolbar actions
- `.btn-icon-sm` - 28px - Very compact spaces only

**Icon Button Variants:**
- Default: white bg, gray border (for most actions)
- `.primary`: blue bg, white icon (any icon can use this style)

**Panel Classes:**
- `.slide-panel-*` - Generic slide-in panel pattern
- `.notes-panel-*` - Notes panel (uses slide-panel internally)

**Wizard Footer (Fixed):**
- `.wizard-fixed-footer` - Fixed footer at bottom of viewport
- `.wizard-fixed-footer-inset` - Inset for sidebar layouts (64px)
- `.wizard-footer-left/center/right` - Three-column layout
- `.wizard-step-indicator` - Step counter (teal color)
- `.wizard-step-description` - Step label (muted color)

**Data Tables:**
- `.data-table` - Base table pattern
- `.col-actions` - Row actions column (LEFT side)
- `.col-link` - Clickable text (teal/blue)
- `.col-text` - Regular text (gray-700)
- `.col-text-muted` - Muted text (gray-500)
- `.col-time` - Days/time values (orange)
- `.col-currency` - Right-aligned currency
- `.col-nav` - Navigation chevron (RIGHT side)

**Row Actions:**
- `.row-actions` - Container for row action buttons
- `.row-action-btn` - Icon button (32px)
- `.row-action-btn.delete` - Delete variant (red on hover)
- `.row-action-btn.add` - Add variant (teal background)
- `.row-actions-dropdown` - Dropdown menu for 3+ actions

**Summary Cards (Reference Style):**
- `.summary-cards-grid` - Grid container
- `.summary-card-ref` - Card with pale blue border
- `.summary-card-ref-label` - Teal label (top)
- `.summary-card-ref-value` - Large value (bottom)
- `.summary-card-ref-value.currency` - Prepends "R "

### Rules:
1. **NO inline styles** unless absolutely necessary for dynamic values
2. **NO hardcoded hex colors** - always use CSS variables
3. **NO duplicate CSS** - check if style exists before creating
4. Add new reusable patterns to `elite-wealth-design-system.css`
5. Component-specific styles go in component-level CSS files

### Table Pattern Rules (FROM REFERENCE APP):
1. **Row actions on LEFT** - Delete, duplicate, add icons on left side of row
2. **Clickable text uses teal** (`--ew-blue`) - Client names, comm types
3. **Time/days values use orange** (`--ew-orange`) - Always orange, no health variants
4. **Navigation chevron on RIGHT** - For row click navigation
5. **1-2 actions = icon buttons, 3+ actions = dropdown menu**

---

## Project Structure

- `/src/app/comms-hub/` - Communications Hub pages
- `/src/components/` - Shared React components
- `/src/components/primitives/` - Base UI components (Box, Flex, Button, etc.)

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS (for utilities)
- Framer Motion (for animations)
- Prisma (database ORM)

## Key Workflows

### Communications Hub Features
- **Dashboard** - Overview of all client communications
- **Interactions** - Track calls, meetings, emails with clients
- **Campaigns** - Bulk communication management
- **Send Wizard** - Multi-step flow for sending communications
- **Templates** - Reusable communication templates
- **Portal Invites** - Client portal access management
- **Info Requests** - Request information from clients

---

## Reference Specification (MUST MATCH EXACTLY)

### Typography Spec

**Font Family:** `'Inter', ui-sans-serif, system-ui, sans-serif`

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--font-size-xs` | **12px** | 16px | Table headers, small labels |
| `--font-size-sm` | **14px** | 20px | Body text, inputs, buttons |
| `--font-size-base` | **16px** | 24px | Standard content |
| `--font-size-lg` | 18px | 28px | Section titles |
| `--font-size-xl` | 20px | 28px | Card titles |
| `--font-size-2xl` | 24px | 32px | Page headings |

**Font Weights:**
- Normal: 400 — Body text, inputs
- Medium: 500 — Buttons, emphasized text, form labels
- Semibold: 600 — Section headers
- Bold: 700 — Totals, strong emphasis

### Color Spec

**Primary Brand:**
```
--ew-blue: #016991
--ew-blue-dark: #014a66
--ew-blue-darkest: #013849
--ew-orange: #F97415  (NOT #EA8A2E)
```

**Text Colors (Tailwind Gray Scale):**
```
--text-primary: #111827   (gray-900)
--text-secondary: #374151 (gray-700)
--text-muted: #6b7280     (gray-500)
--text-disabled: #9ca3af  (gray-400)
--text-label: #4b5563     (gray-600)
```

**Backgrounds:**
```
--bg-page: #EFF2F5
--bg-card: #ffffff
--bg-table-header: #f9fafb
--bg-accent-light: #E8F3F8
```

**Borders:**
```
--border-default: #e5e7eb
--border-subtle: #f3f4f6
--border-section: #d1d5db
```

### Button Spec

| Button | Background | Text | Border | Hover BG |
|--------|------------|------|--------|----------|
| `.btn-primary` | #016991 | white | #016991 | #014a66 |
| `.btn-secondary` | white | **#828282** | **#BDBDBD** | #F2F2F2 |
| `.btn-destructive` | #ef4444 | white | #ef4444 | #dc2626 |
| `.btn-ghost` | transparent | #6b7280 | none | #f3f4f6 |

**Important:** Secondary button uses gray text (#828282) and gray border (#BDBDBD), NOT the primary text color.

### Label Patterns

- **Form Labels:** 14px, weight 500, color #374151 (gray-700)
- **Table Headers:** 12px, uppercase, tracking-wide, weight 500, color #6b7280 (gray-500)
- **Section Headers:** 14px, uppercase, tracking-wider, weight 600, color #4b5563 (gray-600)

---

## Verification Checklist

Before completing any styling work, verify:

- [ ] Font sizes match spec (12px, 14px, 16px — NOT 11px, 13px, 14px)
- [ ] Orange accent is `#F97415` (not `#EA8A2E`)
- [ ] Text colors use Tailwind gray scale
- [ ] Secondary buttons have gray text (#828282) and gray border (#BDBDBD)
- [ ] No hardcoded hex colors in component files
- [ ] No duplicate CSS definitions across files
- [ ] All new patterns added to `elite-wealth-design-system.css`
- [ ] Visual appearance matches the reference Elite Wealth app
