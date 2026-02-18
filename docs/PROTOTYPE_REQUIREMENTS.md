# Communications Hub - Prototype Requirements

**Purpose:** Single source of truth for prototype scope and priorities
**Last Updated:** February 2025
**Status:** Active

---

## Context

### Stakeholder Feedback
- Direction approved, but prototype must **acknowledge current reality**
- Must show how existing "Interactions" system fits into new framework
- Not a replacement that ignores the past — an evolution that builds on it

### Anchor Use Cases
The project exists because of two specific communication needs:
1. **Elite Wealth Portal Onboarding** (New Client Onboarding)
2. **Elite Wealth Portal Invite**

Everything else is exploration. These two must work beautifully.

---

## Build Priority

| Priority | Deliverable | Status |
|----------|-------------|--------|
| **P1** | Interactions Baseline | Not started |
| **P2** | Portal Onboarding Commtype | Not started |
| **P3** | Portal Invite Commtype | Not started |
| **P4** | Global Notes (context-aware) | Not started |
| **P5** | Campaigns, Templates, Settings | Placeholder |

---

## P1: Interactions Baseline

### What It Is
The existing "Interactions" system in Elite Wealth — a log of adviser-client interactions.

### Requirements

#### Interaction History View
- Client-centric list: "Interaction history for: [Client Name]"
- Date range filtering (from/to)
- Option to include deleted interactions
- Table columns:
  - Entity (client name)
  - Interaction type
  - Description
  - Documents attached (count)
  - Interaction date
  - Created by
  - Date loaded
  - Last modified by
  - Last modified date
- Refresh and Report actions

#### Interaction Detail/Entry Form
- Interaction date (date picker)
- Interaction type (dropdown)
- Description (text field)
- Details (text area)
- Attachments section
- Record audit link

#### Interaction Types (from current system)
Must support these existing types:
- Email
- Email - Annual Review
- Fax
- Gift
- Invitation
- Mail (post)
- Meeting (Ad-hoc)
- Meeting (Annual)
- Meeting (Introduction)
- Meeting (Proposal)
- Meeting (Review)
- Other
- Personal
- Quarterly Statements
- Regular report
- SMS
- Telephonic
- WhatsApp

#### Integration Point
- This becomes the "log" layer that commtypes build upon
- When a commtype communication happens, it creates an interaction record
- Manual interactions (calls, meetings) can still be logged the traditional way

---

## P2: Portal Onboarding (Client Information Requests)

### Clarification
**This is NOT portal access.** It's a standalone data-gathering questionnaire that collects client information to pre-populate their profile. Separate from actual portal access.

### Archetype
Workflow — configurable multi-step data collection with client actions

### Purpose
Gather client information (contact details, family, employment, financial, tax, documents) to build their profile.

---

### ADVISER EXPERIENCE

#### 2.1 Client List View ("Client Information Requests")
- Title: "Client Information Requests"
- Subtitle: "Request information and documents from your clients. This is separate from their Wealth Portal access."
- "Request Information" button (bulk action)
- Table columns:
  | Column | Description |
  |--------|-------------|
  | Checkbox | Multi-select |
  | Client | Name |
  | Email | Contact |
  | Mobile | Contact (SA format: +27) |
  | Status | Badge: Not Requested / Requested / In Progress / Complete |
  | Last Activity | Timestamp or "—" |
  | Actions | "View" link |

#### 2.2 Client Detail Panel (slide-out)
- Client name + status badge
- **Information Gathered** section: progress indicator (Not started / X of Y sections)
- **Documents** section: list of requested/received documents
- **Activity** section: timeline of events
- Primary action: "Send Request" button

#### 2.3 Confirm Contact Details Modal
- Title: "Confirm Contact Details"
- Verify email + mobile before sending
- Editable fields
- Warning: "These details will be used to send the request and for client verification."
- Actions: Cancel, Confirm & Continue

#### 2.4 Configure Request Modal
- Title: "Configure Request"
- **Always Included (locked):**
  - Contact details
- **Optional Sections (checkboxes):**
  - Family members
  - Employment information
  - Financial information
  - Tax information
  - Insurance (short-term, life, medical)
  - Will & testament
- **Documents (Optional) - chip selector:**
  - ID Document
  - Proof of Address
  - Bank Statement
  - Tax Certificate
  - Payslip
  - Marriage Certificate
- **Notes** text area: special instructions for client
- Actions: Cancel, Next: Compose Message

#### 2.5 Compose Message Modal
- Channel selector: SMS / WhatsApp / Email (toggle cards)
- Editable message template with tokens:
  - `{FirstName}` — client first name
  - `{Link}` — secure form URL
- Live phone preview (shows rendered message)
- Character count
- Channel-specific templates:
  - **SMS**: Short, direct (~400 chars)
  - **WhatsApp**: Conversational, bullet points
  - **Email**: Formal, detailed
- Actions: Back, Send Request

#### 2.6 Status Flow
```
Not Requested → Requested → In Progress → Complete
                   ↓              ↓
              (sent)      (client started form)
```

---

### CLIENT EXPERIENCE (New)

#### 2.7 Receives Message
- Via chosen channel (SMS/WhatsApp/Email)
- Personalised: adviser name, client name
- Contains secure link
- Sets expectations: "~10 minutes", "save progress and return"

#### 2.8 OTP Verification
- "Verify Your Identity"
- 6-digit code sent to mobile
- Masked number display (+27 82 *** 6717)
- "Verify & Continue" button
- "Didn't receive a code? Resend" link

#### 2.9 Multi-Step Form
- Step indicator (numbered, showing progress 1-6)
- Dynamic steps based on adviser configuration
- Standard sections:
  1. **Contact Details**: First name, Surname, Email, Mobile, Residential Address
  2. **Family Members**: (TBD)
  3. **Employment Information**: (TBD)
  4. **Financial Information**: Monthly Gross Income, Monthly Expenses, Total Assets, Total Liabilities
  5. **Tax Information**: (TBD)
  6. **Documents**: Upload requested documents
- Navigation: ← Back, Next: [Section Name] →

#### 2.10 Completion
- Placeholder confirmation: "Thank you! Your information has been submitted."
- **Do NOT build actual portal interface** — it exists separately

---

### RETURNING CLIENT EXPERIENCE

#### 2.11 Reminder Message
- "Thanks for starting — you're almost there!"
- "Pick up exactly where you left off — your progress has been saved"
- Link to resume

#### 2.12 OTP Verification (same as new client)

#### 2.13 Welcome Back Screen
- "Welcome Back, [Name]"
- "You've made progress. Pick up where you left off."
- Progress checklist:
  - ✓ Completed sections (green check)
  - → Current section ("Continue here" badge)
  - ○ Remaining sections (grey circle)
- Actions: Continue, Start over

#### 2.14 Resume from Current Section
- Form opens at the section where they left off

---

### Statuses
| Status | Meaning |
|--------|---------|
| Not Requested | No request sent yet |
| Requested | Sent, awaiting client action |
| In Progress | Client has started but not completed |
| Complete | All requested info submitted |

---

## P3: Portal Invite Commtype

### Clarification
**This IS portal access.** Invites client to create account and access the Elite Wealth Portal where they can view investments, status updates, etc.

### Archetype
Workflow — invitation with password setup

### Purpose
Grant client access to the Elite Wealth Portal.

### Key Difference from Portal Onboarding
- Instead of OTP verification → **Password creation**
- Instead of data collection form → **Account activation flow**
- End state: Client has portal login credentials

### Stages
1. Not Invited
2. Invited (sent)
3. Opened (clicked link)
4. Password Set
5. Activated (logged in successfully)

### Requirements (to be detailed when screenshots arrive)
- Similar adviser flow: client list, status tracking, send invite
- Similar channel selection: SMS/WhatsApp/Email
- Client flow: receive invite → click link → create password → confirmation
- **Do NOT build actual portal interface** — just placeholder confirmation

### Scope Boundary
- We orchestrate the invitation and track status
- We hand off to the real portal for actual login/functionality
- Prototype shows: "Welcome to the Elite Wealth Portal" placeholder only

---

## P4: Global Notes

### What It Is
Context-aware note-taking for advisers — the "memory layer"

### Requirements

#### Global Notes Button
- Persistent UI element (FAB or header action)
- Always accessible from any screen
- Icon: `note_add` or similar

#### Context Detection
| Clicked From | Note Attaches To |
|--------------|------------------|
| Activity dashboard (no selection) | Prompts for client/context |
| Communication detail view | That specific communication |
| Contact page (viewing client) | That client |
| Commtype workflow | That commtype instance |

#### Note Modal
- Pre-fills detected context
- Allows context override
- Simple text entry
- Save/Cancel actions

#### Note Display
- Notes visible in communication detail view
- Notes visible in contact/client view
- Notes searchable (future)
- Notes don't clutter main timeline — parallel layer

---

## P5: Campaigns, Templates, Settings

### Status
Placeholder pages — "Coming Soon"

### Purpose
Show the vision of where the hub is going without distracting from core demo.

### Campaigns
- Bulk communication management
- One-to-many messaging
- Segment targeting

### Templates
- Reusable message templates
- Per-commtype templates
- Personalisation tokens

### Settings
- Channel preferences
- Notification settings
- Integration configuration

---

## Design Principles (from Vision Brief)

Every decision must align with:

1. **Adviser voice, not platform voice**
2. **Context over templates**
3. **Silence is a valid choice**
4. **Compliance confidence**
5. **Progressive disclosure**
6. **Relationship-first metrics**
7. **Respect the attention budget**

---

## Technical Notes

### Existing Infrastructure
- Next.js 16.1.4 + React 19 + TypeScript
- Tailwind CSS 4 + Elite Wealth design system
- 14 primitive components ready
- Mock data system in place
- Routes: `/comms-hub/*`

### Type System
- `src/types/communications.ts` — domain model
- Archetypes, Commtypes, Stages, Health, Channels defined
- Needs extension for:
  - Interactions (legacy type)
  - Notes

---

## Open Questions

1. ~~What are the exact stages for Portal Onboarding workflow?~~ ✅ Answered
2. ~~What are the exact stages for Portal Invite workflow?~~ ✅ Partially answered (password setup flow)
3. ~~What templates/content are used for these commtypes?~~ ✅ Answered (channel-specific templates)
4. How do SLA/health thresholds work for these commtypes? (e.g., when does "Requested" become "at-risk"?)
5. ~~Is there a client-side portal experience we need to mock?~~ ✅ Answered: NO — placeholder only

---

## Document History

| Date | Change |
|------|--------|
| Feb 2025 | Initial requirements captured from stakeholder discussion |
| Feb 2025 | Added detailed Portal Onboarding spec from prototype screenshots |
| Feb 2025 | Clarified Portal Invite vs Portal Onboarding distinction |
| Feb 2025 | Added scope boundary: no actual portal interface |
