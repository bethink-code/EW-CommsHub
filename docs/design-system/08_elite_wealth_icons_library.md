# Elite Wealth Icons Library

**Version:** 1.0 | **Status:** Production Ready | **Date:** January 2025

---

## 📋 Table of Contents
1. [Icon System Overview](#icon-system-overview)
2. [Core Icons](#core-icons)
3. [Website Icons](#website-icons)
4. [Icon Sizes & Variations](#icon-sizes--variations)
5. [Usage Guidelines](#usage-guidelines)
6. [SVG Code Examples](#svg-code-examples)

---

## Icon System Overview

### Design Standards
- **Grid:** 24px base grid (16px, 20px, 24px common sizes)
- **Stroke Width:** 2px (consistent across system)
- **Corner Radius:** Balanced - 2px on appropriate elements
- **Color Support:** Monochrome (fills and strokes)
- **Minimum Size:** 16px
- **Maximum Size:** 64px (rare use)

### Color System
| Use Case | Color | Hex |
|----------|-------|-----|
| Primary / Default | Elite Wealth Blue | #016991 |
| Disabled / Inactive | Gray | #BDBDBD |
| Interactive Hover | Darker Blue | #4C8DB4 |
| Pressed State | Dark Blue | #114E72 |
| Accent | Orange | #FFAE02 |
| Text Integration | Dark Gray | #171818 |

---

## Core Icons (24px Base)

### Navigation & Direction
| Icon | Name | Code | Usage |
|------|------|------|-------|
| ← | Back | `back` | Navigation, previous step |
| → | Forward | `forward` | Navigation, next step |
| ↔ | Reassign | `reassign` | Task reassignment |
| ↑ | Chevron Up | `chevron-up` | Collapse, decrease |
| ↓ | Chevron Down | `chevron-down` | Expand, increase |
| ≪ | Double Left | `double-left` | First item, extreme left |
| ≫ | Double Right | `double-right` | Last item, extreme right |

### Action Icons
| Icon | Name | Code | Usage |
|------|------|------|-------|
| ✓ | Checkmark | `checkmark` | Complete, confirm |
| ✓✓ | Complete Task | `complete` | Task completion |
| ⏱ | Postpone | `postpone` | Delay, reschedule |
| 👤 | Assign to | `assign-to` | Assign task |
| 👁 | View | `view` | Preview, view details |
| 📄 | View Document | `view-doc` | Open document |
| ✎ | Edit | `edit` | Modify, edit |
| 🗑 | Delete | `delete` | Remove, trash |
| 🔗 | Link | `link` | Connect, associate |
| 🚫 | Unlink | `unlink` | Disconnect |
| 📤 | Send for Signing | `send-signing` | Request signature |
| 📋 | List of Plans | `list-plans` | Show options |
| 🔄 | Refresh | `refresh` | Reload, update |

### Interface Icons
| Icon | Name | Code | Usage |
|------|------|------|-------|
| ⊕ | Add | `add` | Create new |
| ⋮ | Menu Dots (V) | `menu-dots-v` | More options |
| ⋯ | Menu Dots (H) | `menu-dots-h` | More options |
| 📁 | Folder | `folder` | File organization |
| 🔍 | Search | `search` | Find, lookup |
| ⚙ | Settings | `settings` | Configure |
| 🔒 | Lock | `lock` | Secure, locked |
| ℹ | Info | `info` | Information |
| ⚠ | Warning | `warning` | Alert, caution |
| ✉ | Email | `email` | Message, contact |
| ☎ | Phone | `phone` | Call, telephone |

### Dashboard & Data Icons
| Icon | Name | Code | Usage |
|------|------|------|-------|
| 📊 | Chart Bar | `chart-bar` | Statistics |
| 📈 | Chart Pie | `chart-pie` | Distribution |
| 📉 | Graph | `graph` | Trends, analytics |
| 👥 | Users Group | `users-group` | Team, people |
| 🧮 | Cube | `cube` | 3D, structure |
| 📋 | Clipboard List | `clipboard` | Lists, checklists |
| 🎯 | Badge | `badge` | Achievement, status |

### Specialized Icons
| Icon | Name | Code | Usage |
|------|------|------|-------|
| 🤖 | AI | `ai` | Artificial intelligence |
| 📱 | Tablet | `device-tablet` | Mobile, responsive |
| 📄 | PDF | `pdf` | PDF file |
| 📝 | Document | `document` | Text file |
| 👤 | Profile | `profile` | User account |
| 🔗 | Share | `share` | Share content |
| ✏ | Pencil | `pencil` | Write, edit |

---

## Website Icons

Larger, decorative icons used as visual elements on website/dashboard.

### Set 1 (40px)
- Chart Bar with gradient
- Cube 3D
- Pie Chart segments
- Clipboard checklist
- Users in group
- AI nodes/connections
- Graph lines

### Set 2 (Additional)
- Lock / Security
- Device/Tablet
- Settings/Cog
- Template document
- Info circle
- Chart variations

---

## Icon Sizes & Variations

### Size Scale
| Size | Use Case | Padding | Example |
|------|----------|---------|---------|
| 16px | Inline text, compact UI | 2px | Labels, small buttons |
| 20px | Standard UI, toolbar | 4px | Menu items, status |
| 24px | Primary icons, buttons | 6px | Main buttons, cards |
| 32px | Cards, large buttons | 8px | Feature buttons |
| 40px | Dashboard, large UI | 12px | Website graphics |
| 48px+ | Hero, focal point | 16px | Landing pages |

### Color Variations
**Primary Blue #016991**
```css
fill: #016991;
stroke: #016991;
```

**Dark Blue (Pressed) #114E72**
```css
fill: #114E72;
stroke: #114E72;
```

**Hover Blue #4C8DB4**
```css
fill: #4C8DB4;
stroke: #4C8DB4;
```

**Disabled Gray #BDBDBD**
```css
fill: #BDBDBD;
stroke: #BDBDBD;
opacity: 0.6;
```

**Accent Orange #FFAE02**
```css
fill: #FFAE02;
stroke: #FFAE02;
```

---

## Usage Guidelines

### Best Practices

✅ **DO:**
- Use appropriate size for context
- Maintain 2px stroke weight
- Use semantic colors (primary for actions, orange for alerts)
- Include label text for clarity in UI
- Scale proportionally
- Use consistent padding around icons
- Provide alternative text/labels for accessibility

❌ **DON'T:**
- Distort or skew icons
- Change stroke width arbitrarily
- Mix different stroke styles
- Use rotated versions (use specific directional icons)
- Apply effects/shadows without design guidance
- Use below 16px without testing readability
- Change colors arbitrarily

### Context Usage

#### Buttons
- **Primary Button:** Blue icon + white background
- **Secondary Button:** Blue icon + white background + stroke
- **Icon-Only Button:** Blue icon centered, 32px minimum
- **Disabled Button:** Gray icon, reduced opacity

#### Tables & Lists
- **Actions Column:** 24px icons, aligned left
- **Status Column:** 16-20px icons with labels
- **Interactive Rows:** 20px icons on hover

#### Forms
- **Input Prefix:** 16px, left-aligned
- **Validation:** 16px, right-aligned, color-coded
- **Help Text:** 16px info icon, gray color

#### Navigation
- **Menu Items:** 24px, left-aligned with padding
- **Breadcrumbs:** 16px directional arrows
- **Back Button:** 16px arrow + text label

---

## SVG Code Examples

### Basic 24px Icon Template

```html
<!-- Generic Icon 24px -->
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Add path here -->
</svg>
```

### Checkmark Icon (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 6L9 17L4 12" stroke="#016991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Back Arrow (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#016991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Settings / Cog (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="3" stroke="#016991" stroke-width="2"/>
  <path d="M12 1V3M12 21V23M23 12H21M3 12H1" stroke="#016991" stroke-width="2" stroke-linecap="round"/>
  <path d="M20.485 3.515L19.071 4.929M4.929 19.071L3.515 20.485M20.485 20.485L19.071 19.071M4.929 4.929L3.515 3.515" stroke="#016991" stroke-width="2" stroke-linecap="round"/>
</svg>
```

### Plus / Add (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 5V19M5 12H19" stroke="#016991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Delete / Trash (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 6L5 6M10 11V17M14 11V17M5 6L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 6" stroke="#016991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 6V4C9 2.89543 9.89543 2 11 2H13C14.1046 2 15 2.89543 15 4V6" stroke="#016991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Search (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="10" cy="10" r="6" stroke="#016991" stroke-width="2"/>
  <path d="M14.5 14.5L21 21" stroke="#016991" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Email (24px)

```html
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="2" stroke="#016991" stroke-width="2"/>
  <path d="M2 6L12 12L22 6" stroke="#016991" stroke-width="2" stroke-linejoin="round"/>
</svg>
```

---

## Icon Composition Patterns

### Icon + Badge
Position small badge (8-12px) in bottom-right corner:
- Success checkmark (green)
- Alert exclamation (orange)
- Info circle (blue)

### Icon + Label
Standard spacing: 6-8px between icon and text

### Icon + Count
Badge showing number (red for notifications, gray for inactive)

### Icon Disabled State
- Reduce opacity to 60%
- Use gray color (#BDBDBD)
- Consider strikethrough overlay for "reject" actions

---

## Implementation Checklist

- [ ] All 24px SVGs created and tested
- [ ] Icon variants for sizes (16, 20, 24, 32px) verified
- [ ] Color states documented (default, hover, pressed, disabled)
- [ ] Accessibility labels defined (aria-label)
- [ ] Animation states considered (hover, active)
- [ ] Dark mode variants defined
- [ ] RTL (right-to-left) considerations noted
- [ ] Performance optimized (minimal path complexity)
- [ ] Browser compatibility tested

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Initial release - comprehensive icon system |

---

## Next Steps

1. Create SVG files for all 40+ core icons
2. Implement icon system in CSS with custom icons
3. Add animation states (hover, loading)
4. Create Figma icon components
5. Build icon usage guide for design team
6. Set up icon auto-generation pipeline

