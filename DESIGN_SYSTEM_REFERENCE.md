# Elite Wealth Design System - Quick Reference

**ALWAYS USE THESE VALUES - NEVER HARDCODE COLORS OR STYLES**

## Colors (from design tokens)

### Primary Colors
- **Brand Primary**: `var(--ew-primary-7)` or `#016991`
- **Primary Dark**: `var(--ew-primary-1)` or `#003D57`
- **Primary Light**: `var(--ew-primary-8)` or `#4FB1D6`
- **Primary Lighter**: `var(--ew-primary-9)` or `#E8F4FA`

### Secondary Colors
- **Brand Secondary**: `var(--ew-secondary-6)` or `#EA8A2E`
- **Secondary Light**: `var(--ew-secondary-7)` or `#F09A47`
- **Secondary Lighter**: `var(--ew-secondary-9)` or `#FEF3C7`

### Neutral Colors
- **Text Primary**: `var(--color-text-primary)` or `#1E293B`
- **Text Secondary**: `var(--color-text-secondary)` or `#475569`
- **Text Muted**: `var(--color-text-muted)` or `#94A3B8`
- **Background**: `var(--color-bg-primary)` or `#FFFFFF`
- **Background Secondary**: `var(--color-bg-secondary)` or `#F8FAFC`
- **Border**: `var(--color-border)` or `#CBD5E1`

### Status Colors
- **Success**: `var(--ew-success)` or `#10B981`
- **Error**: `var(--ew-error)` or `#DC2626`
- **Warning**: `var(--ew-warning)` or `#F59E0B`
- **Info**: `var(--ew-info)` or `#3B82F6`

## Typography

### Font Family
- Always use: `font-family: 'Inter, sans-serif'`

### Font Sizes
- **XS**: `11px` - Captions
- **S**: `13px` - Labels
- **Base**: `14px` - Body text
- **M**: `16px` - Emphasis
- **L**: `18px` - Subheadings
- **XL**: `20px` - Section headers
- **2XL**: `24px` - Major headers
- **3XL**: `28px` - Page titles

### Font Weights
- **Regular**: `400` - Body, standard
- **Medium**: `500` - Labels, emphasis
- **SemiBold**: `600` - Buttons, subheads
- **Bold**: `700` - Headings, strong

## Spacing (use CSS variables)

- `var(--spacing-xs)` - `4px`
- `var(--spacing-sm)` - `8px`
- `var(--spacing-base)` - `16px`
- `var(--spacing-md)` - `24px`
- `var(--spacing-lg)` - `32px`
- `var(--spacing-xl)` - `48px`
- `var(--spacing-2xl)` - `64px`

## Border Radius

- `var(--radius-sm)` - `4px`
- `var(--radius-base)` - `6px`
- `var(--radius-md)` - `8px`
- `var(--radius-lg)` - `12px`
- `var(--radius-xl)` - `16px`
- `var(--radius-full)` - `9999px` (pill shape)

## Shadows

- `var(--shadow-xs)` - Subtle
- `var(--shadow-sm)` - Small
- `var(--shadow-base)` - Default
- `var(--shadow-md)` - Medium
- `var(--shadow-lg)` - Large
- `var(--shadow-xl)` - Extra large

## Components to Use

### Buttons
Use classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-tertiary`

### Cards
Use classes: `.card`, `.card-header`, `.card-body`, `.card-footer`

### Badges
Use classes: `.badge`, `.badge-success`, `.badge-error`, `.badge-warning`, `.badge-info`

### Navigation
Use classes from: `elite-wealth-navigation.css`

## Design System Files Location
- Colors/Tokens: `src/app/elite-wealth-design-system.css`
- Navigation: `src/app/elite-wealth-navigation.css`
- Full Docs: `docs/design-system/`

## Rules
1. ✅ ALWAYS use CSS variables for colors
2. ✅ ALWAYS use design system classes when available
3. ✅ ALWAYS use Inter font
4. ✅ ALWAYS use design tokens for spacing, shadows, radius
5. ❌ NEVER hardcode colors like `#FF0000`
6. ❌ NEVER use arbitrary spacing values
7. ❌ NEVER use fonts other than Inter
