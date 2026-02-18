# Elite Wealth Button System

**Version:** 1.0 | **Status:** Production Ready | **Date:** January 2025

---

## 📋 Button Variants Overview

Your design system includes **6 primary button types** with multiple states:

1. **Primary Blue** – Main CTAs (teal background, white text)
2. **Primary White** – Secondary actions (light gray background, teal text)
3. **Secondary** – Alternative actions (white background, blue border, blue text)
4. **Tertiary** – Minimal actions (text-only, blue text)
5. **Icon Button Blue** – Icon-only actions (blue background, white icon)
6. **Icon Button White** – Icon-only with stroke (white background, stroke, blue icon)

---

## 🎨 Color Specifications

### Primary Blue Button
| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | #016991 | White | – |
| Hover | #0D5A78 | White | – |
| Pressed | #114E72 | White | – |
| Disabled | #CBD5E1 | #94A3B8 | – |

### Primary White Button
| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | #F1F5F9 | #016991 | – |
| Hover | #E8EEF3 | #016991 | – |
| Pressed | #D9E3ED | #016991 | – |
| Disabled | #F8FAFC | #CBD5E1 | – |

### Secondary Button
| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | White | #016991 | #E2E8F0 |
| Hover | #F8FAFC | #016991 | #016991 |
| Pressed | #E8F4FA | #016991 | #016991 |
| Disabled | White | #CBD5E1 | #E8E8E8 |

### Tertiary Button (Text-Only)
| State | Background | Text | Border |
|-------|-----------|------|--------|
| Default | Transparent | #016991 | – |
| Hover | #F8FAFC | #016991 | – |
| Pressed | #E8F4FA | #016991 | – |
| Disabled | Transparent | #CBD5E1 | – |

### Icon Button Blue
| State | Background | Icon | Border |
|-------|-----------|------|--------|
| Default | #016991 | White | – |
| Hover | #0D5A78 | White | – |
| Pressed | #114E72 | White | – |
| Disabled | #CBD5E1 | #94A3B8 | – |

### Icon Button White
| State | Background | Icon | Border |
|-------|-----------|------|--------|
| Default | White | #016991 | #E6F0F5 |
| Hover | #E6F0F5 | #016991 | #4C8DB4 |
| Pressed | #4C8DB4 | White | #4C8DB4 |
| Disabled | White | #BDBDBD | #E8E8E8 |

---

## 📐 Sizing & Spacing

### Button Dimensions
| Size | Height | Padding (H) | Padding (V) | Font Size | Use Case |
|------|--------|------------|-----------|-----------|----------|
| Small | 32px | 12px | 8px | 12px | Compact UI |
| Medium (Default) | 40px | 16px | 12px | 14px | Standard |
| Large | 48px | 20px | 14px | 16px | Primary CTA |

### Icon Button Dimensions
| Size | Dimension | Icon Size | Padding |
|------|-----------|-----------|---------|
| Small | 32x32px | 16px | 8px |
| Medium | 40x40px | 20px | 10px |
| Large | 48x48px | 24px | 12px |

### Button Border Radius
- **All buttons:** 6px (consistent)

### Icon + Text Spacing
- **Gap between icon and text:** 8px

---

## 🔄 Button States

### Interactive States (All Buttons)
1. **Default** – Normal state
2. **Hover** – Mouse over (color shift)
3. **Pressed/Active** – Clicked or selected
4. **Disabled** – Inactive, not clickable
5. **Loading** – Processing state (optional)
6. **Focus** – Keyboard focus (outline)

### State Transitions
- **Hover to Default:** 150ms ease-out
- **Press animation:** 50ms (immediate feedback)
- **Disabled:** Instant (no animation)

---

## 📚 Button Hierarchy

### Level 1 (Primary)
- **Primary Blue** – Main call-to-action
- **Location:** Featured prominently
- **Usage:** Most important action per screen
- **Example:** "Send Request", "Submit", "Create New"

### Level 2 (Secondary)
- **Primary White** – Secondary action
- **Location:** Alongside primary
- **Usage:** Alternative important action
- **Example:** "Save Draft", "Review", "Refresh"

### Level 3 (Tertiary)
- **Secondary / Tertiary** – Supportive action
- **Location:** Grouped or toolbar
- **Usage:** Less important actions
- **Example:** "Cancel", "Skip", "Learn More"

### Level 4 (Minimal)
- **Icon Buttons** – Single action
- **Location:** Toolbar, header, inline
- **Usage:** Navigation, tools, quick actions
- **Example:** "Settings", "Delete", "Filter"

---

## 🧩 Special Button Types

### Step Number
- **Background:** Varies by step status
- **Size:** 32x32px circle
- **States:** 
  - Pending: Light gray background, gray number
  - Active: Orange background (#FFAE02), white number
  - Complete: Green background (#10B981), white checkmark

### Step Button
- **Combines:** Step number + text
- **Direction:** Vertical (number above, text below)
- **States:** Pending, active, complete

### Switcher Buttons
- **Type:** Segmented control / Tab group
- **Behavior:** Select one option
- **Sizes:** Large, Small
- **States:** Active (blue), Inactive (gray)

### Switcher (Multi-option)
- **Type:** Toggle between options
- **Behavior:** Mutual exclusion
- **States:** Active (blue), Inactive (gray background)

---

## 💻 HTML & CSS Implementation

### Basic Buttons

**Primary Blue Button**
```html
<button class="btn btn-primary">Create a new plan</button>
```

**Primary White Button**
```html
<button class="btn btn-primary-white">Create a new plan</button>
```

**Secondary Button**
```html
<button class="btn btn-secondary">Create a new plan</button>
```

**Tertiary Button (Text-Only)**
```html
<button class="btn btn-tertiary">Refresh data</button>
```

### Icon Buttons

**Icon Button Blue**
```html
<button class="btn-icon btn-icon-blue" title="Filter">
  <span class="material-icons">tune</span>
</button>
```

**Icon Button White with Stroke**
```html
<button class="btn-icon btn-icon-white" title="Settings">
  <span class="material-icons">settings</span>
</button>
```

### With Icons + Text

**Button with Left Icon**
```html
<button class="btn btn-primary">
  <span class="material-icons">add</span>
  Create new plan
</button>
```

**Button with Right Icon**
```html
<button class="btn btn-primary">
  Save
  <span class="material-icons">save</span>
</button>
```

### Sizes

```html
<!-- Small -->
<button class="btn btn-primary btn-sm">Create a new plan</button>

<!-- Medium (default) -->
<button class="btn btn-primary">Create a new plan</button>

<!-- Large -->
<button class="btn btn-primary btn-lg">Create a new plan</button>
```

### States

```html
<!-- Default (interactive) -->
<button class="btn btn-primary">Create a new plan</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Create a new plan</button>

<!-- Loading -->
<button class="btn btn-primary" disabled>
  <span class="material-icons icon-spin">refresh</span>
  Creating...
</button>

<!-- Active/Pressed -->
<button class="btn btn-primary active">Create a new plan</button>
```

---

## 📍 Button Placement Patterns

### Primary + Secondary
```html
<div class="button-group">
  <button class="btn btn-primary">Send</button>
  <button class="btn btn-primary-white">Save Draft</button>
</div>
```

### Primary + Secondary + Tertiary
```html
<div class="button-group">
  <button class="btn btn-primary">Submit</button>
  <button class="btn btn-secondary">Cancel</button>
  <button class="btn btn-tertiary">Learn More</button>
</div>
```

### Icon Button Group
```html
<div class="button-group">
  <button class="btn-icon btn-icon-white" title="Edit">
    <span class="material-icons">edit</span>
  </button>
  <button class="btn-icon btn-icon-white" title="Delete">
    <span class="material-icons">delete</span>
  </button>
  <button class="btn-icon btn-icon-white" title="More">
    <span class="material-icons">more_vert</span>
  </button>
</div>
```

---

## 🔄 Step Indicators

### Step Button States
- **Pending:** Light gray background with number
- **Active:** Orange background with number
- **Complete:** Green background with checkmark

### Step Button with Text

```html
<!-- Pending -->
<div class="step-button">
  <div class="step-number pending">1</div>
  <div class="step-label">Step Name</div>
</div>

<!-- Active -->
<div class="step-button">
  <div class="step-number active">2</div>
  <div class="step-label">Step Name</div>
</div>

<!-- Complete -->
<div class="step-button">
  <div class="step-number complete">✓</div>
  <div class="step-label">Step Name</div>
</div>
```

---

## 🎛️ Switcher / Segmented Controls

### Basic Switcher

```html
<!-- Large -->
<div class="switcher switcher-lg">
  <button class="switcher-btn active">Graph</button>
  <button class="switcher-btn">Table</button>
</div>

<!-- Small -->
<div class="switcher switcher-sm">
  <button class="switcher-btn active">Graph</button>
  <button class="switcher-btn">Table</button>
</div>
```

### Multi-Option Switcher

```html
<div class="switcher-multi">
  <button class="switcher-btn active">Graph</button>
  <button class="switcher-btn">Table</button>
  <button class="switcher-btn">List</button>
</div>
```

---

## ♿ Accessibility

### Keyboard Navigation
- Tab through buttons in logical order
- Space/Enter to activate
- Visible focus indicator (outline)

### ARIA Labels
```html
<!-- Icon-only button must have aria-label -->
<button class="btn-icon btn-icon-white" aria-label="Delete this item">
  <span class="material-icons">delete</span>
</button>

<!-- Or use title attribute -->
<button class="btn-icon btn-icon-white" title="Delete this item">
  <span class="material-icons">delete</span>
</button>
```

### Disabled State
```html
<!-- Clearly disabled -->
<button class="btn btn-primary" disabled aria-disabled="true">
  Create a new plan
</button>
```

### Focus Indicator
```css
.btn:focus,
.btn-icon:focus {
  outline: 2px solid #016991;
  outline-offset: 2px;
}
```

---

## 📱 Responsive Behavior

### Button Width
- **Desktop:** Fixed width or content-fit
- **Tablet:** Adaptive width
- **Mobile:** Full-width or stacked

### Button Stack (Mobile)
```html
<!-- Desktop: side-by-side -->
<div class="button-group">
  <button class="btn btn-primary">Submit</button>
  <button class="btn btn-secondary">Cancel</button>
</div>

<!-- Mobile: stacked (via CSS media query) -->
@media (max-width: 768px) {
  .button-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .btn {
    width: 100%;
  }
}
```

---

## 🎯 Usage Guidelines

### Primary Blue Button
**When to use:**
- Most important action on the page
- Call-to-action (CTA)
- Form submission
- Confirm/Save actions

**Avoid:**
- Using more than one per section
- Multiple primary buttons on one page
- Secondary content interactions

### Primary White Button
**When to use:**
- Secondary important action
- Alternative to primary
- Paired with primary button

**Avoid:**
- As only button (use Primary Blue instead)
- On light backgrounds (use Secondary instead)

### Secondary Button
**When to use:**
- Cancel, Back, Close
- Lower-priority actions
- Grouped alternatives
- Toolbar actions

**Avoid:**
- Main CTAs (use Primary instead)
- Overuse in UI

### Tertiary Button
**When to use:**
- Minimal, subtle actions
- "Learn More", "Skip"
- Help or additional info
- Least important action

**Avoid:**
- Important actions
- First-time users might miss

### Icon Buttons
**When to use:**
- Toolbar actions
- Navigation
- Space-constrained UI
- Quick actions (edit, delete)

**Avoid:**
- Without tooltip/aria-label
- With unclear icons
- As main CTAs (use text buttons)

---

## 🔗 Integration Checklist

- [ ] All 6 button variants implemented
- [ ] All 4 button states working (default, hover, pressed, disabled)
- [ ] Icon + text alignment correct (8px gap)
- [ ] Colors match Figma exactly
- [ ] Sizes and padding consistent
- [ ] Border radius 6px all buttons
- [ ] Focus indicator visible
- [ ] Icon buttons have aria-labels
- [ ] Disabled buttons not clickable
- [ ] Responsive on mobile
- [ ] Touch targets 40px+ minimum
- [ ] Hover/pressed animations smooth

---

## 📊 Button State Matrix

| Variant | Default | Hover | Pressed | Disabled |
|---------|---------|-------|---------|----------|
| **Primary Blue** | Teal bg, white text | Darker teal | Darkest teal | Gray bg |
| **Primary White** | Light gray bg | Lighter | Even lighter | Lighter gray |
| **Secondary** | White, blue border | Light blue bg | Blue bg, darker text | Light gray |
| **Tertiary** | Transparent | Light gray bg | Blue bg | Gray text |
| **Icon Blue** | Teal bg, white | Darker teal | Darkest | Gray |
| **Icon White** | White, stroke | Light stroke | Dark blue | Light gray |

---

## 🚀 Implementation Priority

### Phase 1 (Essential)
- Primary Blue button
- Secondary button
- Icon Button White
- Disabled states
- Focus indicators

### Phase 2 (Important)
- Primary White button
- Tertiary button
- Icon Button Blue
- Size variants (sm, lg)
- Icon + text combinations

### Phase 3 (Enhanced)
- Step buttons
- Switcher controls
- Loading states
- Animation refinements
- Hover transitions

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2025 | Complete button system documentation |

---

## 💡 Pro Tips

1. **Keep consistency:** Use same button types across app
2. **Progressive disclosure:** Stack buttons on mobile
3. **Clear hierarchy:** Use color to show importance
4. **Predictable actions:** Button text should clearly state action
5. **Touch-friendly:** Minimum 40x40px for touch targets
6. **Fast feedback:** Immediate visual response to clicks
7. **Accessibility first:** Always label icon buttons
8. **Performance:** Avoid complex hover animations

