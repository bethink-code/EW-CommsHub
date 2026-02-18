# Elite Wealth Typography System

**Font Family:** Inter | **Version:** 1.0 | **Status:** Production Ready

---

## Type Scale

### 11-Level Type Scale

| Level | Pixel Size | Use Case | Line Height |
|-------|-----------|----------|-------------|
| XS | 11px | Captions, metadata, timestamps | 1.4 |
| S | 13px | Labels, small text, hints | 1.5 |
| Base | 14px | Body copy, default text | 1.5 |
| M | 16px | Larger body, emphasized text | 1.6 |
| L | 18px | Subheadings, larger labels | 1.6 |
| XL | 20px | Section headings | 1.4 |
| 2XL | 24px | Major headings | 1.4 |
| 3XL | 28px | Page titles | 1.3 |
| 4XL | 32px | Hero headings | 1.3 |
| 5XL | 48px | Large hero text | 1.2 |
| 6XL | 74px | Maximum size (rare) | 1.2 |

---

## Font Weights

**Available Weights:** 400, 500, 600, 700

| Weight | Name | Use Case |
|--------|------|----------|
| 400 | Regular | Body text, standard content, paragraphs |
| 500 | Medium | Labels, emphasized text, UI elements |
| 600 | SemiBold | Subheadings, buttons, input labels |
| 700 | Bold | Main headings, strong emphasis, call-outs |

---

## Heading Styles

### H1 (Page Title)
- Size: 28-32px
- Weight: 700 (Bold)
- Line Height: 1.3
- Color: Primary text (#1E293B)
- Letter Spacing: -0.02em
- Margin Bottom: 16px

### H2 (Major Heading)
- Size: 24px
- Weight: 700 (Bold)
- Line Height: 1.4
- Color: Primary text (#1E293B)
- Margin Bottom: 12px

### H3 (Section Heading)
- Size: 20px
- Weight: 600 (SemiBold)
- Line Height: 1.4
- Color: Primary text (#1E293B)
- Margin Bottom: 12px

### H4 (Subsection)
- Size: 18px
- Weight: 600 (SemiBold)
- Line Height: 1.5
- Color: Primary text (#1E293B)
- Margin Bottom: 8px

### H5, H6 (Minor Headings)
- Size: 16px
- Weight: 600 (SemiBold)
- Line Height: 1.5
- Color: Secondary text (#475569)

---

## Body Text

### Paragraph
- Size: 14-16px
- Weight: 400 (Regular)
- Line Height: 1.5-1.6
- Color: Primary text (#1E293B)
- Max Width: 720px (for readability)

### Small Text / Secondary Copy
- Size: 13px
- Weight: 400 (Regular)
- Line Height: 1.5
- Color: Secondary text (#475569)

### Muted / Caption Text
- Size: 12px
- Weight: 400 (Regular)
- Line Height: 1.4
- Color: Muted text (#94A3B8)

---

## Special Text Styles

### Code / Monospace
- Font Family: Monospace (courier new, consolas, etc.)
- Size: 13px
- Weight: 400
- Background: Light gray (#E2E8F0)
- Padding: 2px 4px
- Border Radius: 4px

### Labels (Form)
- Size: 12-13px
- Weight: 600 (SemiBold)
- Color: Primary text (#1E293B)
- Text Transform: None (sentence case)

### Button Text
- Size: 14px
- Weight: 600 (SemiBold)
- Line Height: 1.5
- Text Transform: None
- Letter Spacing: 0

### Links
- Color: Primary (#016991)
- Text Decoration: Underline (on hover)
- Weight: 400-600 (context dependent)

### Overline / Metadata
- Size: 11px
- Weight: 600 (SemiBold)
- Text Transform: Uppercase
- Letter Spacing: 0.5px
- Color: Muted text (#94A3B8)

---

## Responsive Typography

### Mobile (< 768px)
- Reduce heading sizes by 1 level
- Keep body text readable (14px minimum)
- Increase line height for small screens (1.6+)
- Maintain strong visual hierarchy

### Tablet (768px - 1024px)
- 90% of desktop sizes
- Adjust margins and padding proportionally
- Maintain readability with adequate spacing

### Desktop (> 1024px)
- Use full type scale
- Optimal paragraph width: 720px
- Adequate spacing and margins

---

## Spacing & Leading

### Default Spacing
- **Paragraph to Paragraph:** 24px (1.5rem)
- **Heading to Body:** 12-16px
- **Body to Next Heading:** 24px
- **List Items:** 8px between items

### Letter Spacing
- **Headings:** -0.02em (tighter)
- **Body:** Normal (0em)
- **Overline/Caps:** 0.5px (looser)

---

## Text Colors

### Primary (Body Text)
- Color: #1E293B
- Opacity: 100%
- Use for: Main content, body copy

### Secondary (Supporting Text)
- Color: #475569
- Opacity: 100%
- Use for: Descriptions, metadata, secondary info

### Muted (Tertiary Text)
- Color: #94A3B8
- Opacity: 100%
- Use for: Captions, timestamps, hints

### Brand (Emphasis)
- Color: #016991 (primary blue)
- Use for: Links, emphasized text, CTAs

### Semantic (Status)
- Success: #047857
- Error: #991B1B
- Warning: #B45309
- Info: #1E40AF

---

## Implementation Files

- **CSS:** `06_elite_wealth_typography.css` (production-ready)
- **Cheatsheet:** `10_elite_wealth_typography_cheatsheet.md` (quick reference)
- **Design Tokens:** `07_elite_wealth_design_tokens.json`

---

## Google Fonts Setup

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## Accessibility Notes

✅ All type sizes meet WCAG standards
✅ Sufficient contrast with backgrounds
✅ Line heights support readability
✅ Font weights provide visual hierarchy
✅ Responsive scaling maintains legibility

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Initial release |
