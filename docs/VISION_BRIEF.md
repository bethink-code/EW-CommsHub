# Elite Wealth Communications Hub
## Developer Vision Brief

**Purpose:** Get developers aligned on WHY we're building this before they write a line of code.
**Read time:** 5 minutes

---

## The Problem We're Solving

Elite Wealth currently has **47 different message types** scattered across the platform. Each workflow has its own communications logic. The result:

- **Fragmented experience** — Client receives disconnected messages that don't feel like a relationship
- **Channel chaos** — Email here, SMS there, no coherent strategy
- **Platform voice** — Messages sound like a system, not their trusted adviser
- **No memory** — Each communication starts from zero context
- **Compliance anxiety** — Advisers unsure what they can say, so they say less

**The adviser experience today:** "I know I need to communicate with clients, but the tools make it hard, so I do the minimum."

**The client experience today:** "I get random emails from Elite Wealth. I don't know if they're important."

---

## The Vision: Communications as the Nervous System

The Communications Hub is not a messaging feature bolted onto Elite Wealth.
It is the **orchestration layer** that sits above all other platform functions.

### Mental Model Shift

| Old Model | New Model |
|-----------|-----------|
| Communications as plumbing | Communications as orchestration |
| Scattered across workflows | Centralised hub |
| Channel-centric (email tool, SMS tool) | Relationship-centric |
| 47 disconnected messages | One continuous conversation |
| Platform voice | Adviser voice, Elite Wealth delivery |

### The Nervous System Metaphor

Think of how your nervous system works:
- It connects everything
- It carries context (you don't forget you touched a hot stove)
- It knows when to signal urgently vs. when to stay quiet
- It's invisible when working well

That's what the Communications Hub should be for Elite Wealth.

---

## Why Financial Services is Different

We're not building Mailchimp. We're not building Intercom. Financial services communications have unique requirements:

### 1. Decades-Long Relationships
A client relationship spans accumulation → retirement → estate planning. That's 30+ years. Every communication is a chapter in that story.

### 2. Life Events Drive Everything
Marriage, children, divorce, death, retirement, retrenchment — these moments trigger financial needs. Communications must be sensitive to context.

### 3. Regulatory Weight
FAIS, POPIA, FICA, COFI — every message has compliance implications. Advisers need to feel confident, not scared.

### 4. Trust is the Product
Clients aren't buying policies. They're buying peace of mind. Communications build or erode that trust.

### 5. Adviser is the Brand
The client's relationship is with Rassie, their adviser — not "Elite Wealth." Communications must feel personal, not corporate.

---

## Key Concepts to Internalise

| Concept | What It Means |
|---------|---------------|
| **Conversation Continuity** | The client experiences one ongoing relationship across all channels and time. Not isolated messages. |
| **Relationship Graph** | The hub understands full context — history, life events, preferences, pending matters. |
| **Communication Budget** | Every message costs client attention. Don't become noise. Silence is sometimes the right choice. |
| **Channel Intelligence** | Learn preferences — Mrs. Govender responds to WhatsApp in minutes; Mr. van der Merwe checks email Tuesdays and Fridays. |
| **Context Awareness** | The same message lands differently based on context. Don't send a birthday email the day after a claim rejection. |

---

## The 7 Design Principles

These guide every decision:

1. **Adviser voice, not platform voice**
   Communications should feel like they come from a person, not a system.

2. **Context over templates**
   Smart defaults with human judgment. Templates are starting points, not prisons.

3. **Silence is a valid choice**
   Not sending is sometimes the right action. The system should support thoughtful restraint.

4. **Compliance confidence**
   Advisers should feel safe, not scared. Make the right thing easy.

5. **Progressive disclosure**
   Simple surface, depth available. Calm and clean at first glance; complexity earned through drill-down.

6. **Relationship-first metrics**
   Measure health of relationships, not volume sent. "Messages sent" is not a success metric.

7. **Respect the attention budget**
   Every message costs client attention. Treat that attention as precious.

---

## What Success Looks Like

**For Advisers:**
"I feel like I have superpowers. I know exactly what's happening with every client relationship, and I can communicate confidently without worrying about compliance."

**For Clients:**
"My adviser really knows me. Communications feel personal and arrive at the right time through my preferred channel."

**For Stakeholders:**
"I've never seen client communications visualized like this before."

---

## The Core Technical Concept: Commtypes

Everything flows from this: a **commtype** is a category of communication with its own templates, workflow, channel logic, and client-side experience.

### The Mantra

> **"Look like a chat but don't be a chat"**

| What It IS | What It ISN'T |
|------------|---------------|
| Stateful conversation flows | Free-form chat |
| Predefined states with clear progression | Open-ended back-and-forth |
| Structured responses | Arbitrary text replies |
| Clear beginning and end | Endless thread |
| Platform-managed follow-ups | Adviser manually chasing |

### Seven Archetypes

Every commtype inherits from one of these patterns:

| Archetype | Purpose | Example |
|-----------|---------|---------|
| **Workflow** | Multi-step process with client actions | Onboarding, document collection |
| **Request** | Ask client for something specific | Document request, information update |
| **Notification** | Inform client of something | Policy update, system notification |
| **Alert** | Urgent, requires acknowledgment | Security alert, time-sensitive matter |
| **Broadcast** | One-to-many, marketing-aware | Newsletter, market update |
| **Touchpoint** | Relationship building, personal | Birthday, anniversary, milestone |
| **Conversation** | Free-form but tracked | Ad-hoc adviser communication |

---

## What You're Building

A high-fidelity prototype that demonstrates the vision to stakeholders. This is not production code — it's a proof of concept that shows what's possible.

**Tech stack:**
- Next.js + React + TypeScript
- Tailwind CSS
- Existing Elite Wealth design system (14 primitives ready)

**Your job:**
- Bring the vision to life visually
- Make stakeholders say "yes, this is what we need"
- Create something that feels like the future of adviser communications

---

## Questions to Ask Yourself

When building any screen or component:

1. Does this feel like it comes from a person or a system?
2. Does this respect the client's attention budget?
3. Is compliance confidence built in, or bolted on?
4. Is the simple case simple? Is depth available when needed?
5. Does this serve the relationship, or just the transaction?

---

## Further Reading

| Document | What It Contains |
|----------|------------------|
| `ew-comms-hub-functional-spec-v1.md` | Full functional specification with user roles, channels, state flows, content model |
| `01_ELITE_WEALTH_BRAND_SYSTEM_MASTER_SUMMARY.md` | Brand system overview |
| `INTEGRATION_GUIDE.md` | Design system quick-start for implementation |
| `elite_wealth_communications_hub_v2.html` | Dashboard prototype reference |
| `elit_wealth_data_gathering.html` | Onboarding flow prototype reference |

---

**Document Version:** 1.0
**Last Updated:** February 2025
**Status:** Ready for developer onboarding
