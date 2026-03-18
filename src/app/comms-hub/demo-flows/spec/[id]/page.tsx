'use client';

import { useParams } from 'next/navigation';
import { useRef, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import '../../../comms-hub.css';

// =============================================================================
// SPEC DATA
// =============================================================================

const SPECS: Record<string, { title: string; sections: { heading: string; content: string }[] }> = {
  'info-request': {
    title: 'Information Request — UI Pattern Specification',
    sections: [
      {
        heading: 'Overview',
        content: `The Information Request flow is a multi-step modal wizard that guides an adviser through requesting information and documents from a client. The flow has 3–4 steps depending on whether "Documents" is selected in Step 2.

Steps: Verify → Select → Documents (conditional) → Confirm and send

The modal title bar shows the communication type name (e.g. "Information Request") in muted grey text with a close button. Each step has a header zone (white) and a content zone (grey).`,
      },
      {
        heading: 'Modal Container',
        content: `• White background, 12px border-radius, 1px border (#EAECF0)
• Shadow: 0px 1px 3px rgba(16,24,40,0.1), 0px 1px 2px rgba(16,24,40,0.06)
• Title bar: communication type name, medium weight, #828282 text
• Close button: top-right, outlined icon`,
      },
      {
        heading: 'Stepper (Pill Pattern)',
        content: `• Horizontal row of step pills, each with a rounded-square badge (32×32px, 5px radius)
• Active step: orange pill (#EA8A2E background), badge (#F1B071), white text
• Upcoming steps: white pill, badge (#FDF3E8 background, #EA8A2E text), label #333
• Completed steps: white pill, badge (#C3F1C8 background, #1DB247 check icon), label #333
• Badge font: 12px Inter Medium, -0.5px letter-spacing
• Label font: 14px Inter Regular`,
      },
      {
        heading: 'Header Zone (White)',
        content: `• Background: white, padding 20px 24px
• Bottom border: 1px solid #D9E3EA
• Step title: 24px Inter Semibold, #1F2224, -0.12px letter-spacing
• Context lines below title:
  - "To:" label in #828282, value in #0E6A8F
  - "Type of communication:" label in #828282, value in #0E6A8F
  - Font: 14px Inter Regular`,
      },
      {
        heading: 'Content Zone (Grey)',
        content: `• Background: #F2F2F2, padding 30px 24px
• Contains white cards (8px border-radius) for form groups
• Cards: white background, 20px padding, 5px gap between items, 20px margin-bottom
• Form groups within cards have 0 margin-bottom (card padding handles spacing)`,
      },
      {
        heading: 'Form Inputs',
        content: `• Border: 1px solid #E0EBF2, 5px radius
• Padding: 10px 15px
• Font: 14px Inter Regular, #171818
• Focus: 2px solid #016991 border with #E8F3F8 box-shadow ring`,
      },
      {
        heading: 'Form Labels',
        content: `• Font: 14px Inter Regular (not medium), #171818
• 6px gap between label and input`,
      },
      {
        heading: 'Checkbox Pattern',
        content: `• Custom styled: 18×18px, 2px border (#D1D5DB), 4px radius
• Checked: #016991 fill with white checkmark
• Disabled/required: #BDBDBD fill, cursor default
• Gap between checkbox and label: 10px
• Label font: 14px Inter, bold prefix + regular rest (e.g. "Personal information")
• Gap between rows: 5px`,
      },
      {
        heading: 'Radio Button Pattern',
        content: `• Custom styled: 18×18px, 2px border (#D1D5DB), circular
• Checked: #016991 border with 8×8px #016991 inner dot
• Rows: 5px vertical padding, no divider lines
• Label font: 14px Inter Regular, #171818
• Gap between radio and label: 10px`,
      },
      {
        heading: 'Footer',
        content: `• Background: white, padding 15px 45px
• Top border: 1px solid #D9E3EA
• Cancel/Back button: outlined, 1px border #016991, 8px radius, 14px Inter Semibold, #016991 text, 40px height
• Next/Send button: filled #016991, 6px radius, 14px Inter Semibold, white text, 40px height
• Hover: Cancel → #E8F3F8 background, Next → #014A66 background`,
      },
      {
        heading: 'Inline Expand Pattern (Custom Documents)',
        content: `• "Add custom document" button triggers an inline form expansion within the white card
• Expand/collapse: max-height transition 650ms ease-out with 150ms delayed opacity fade
• Separator: 1px solid #EAECF0 border-top above expanded content
• Form title: 16px Inter Semibold, #1F2224
• Action buttons (Cancel + Add) sit below the form with 20px top margin`,
      },
      {
        heading: 'Conditional Steps',
        content: `• The "Documents" step only appears if the user checks "Documents" in the Select step
• Step count and stepper pills update dynamically (3 steps without, 4 with)`,
      },
      {
        heading: 'Send Confirmation',
        content: `• Standalone small modal (replaces the flow modal entirely)
• No stepper, no title bar — just white card content
• Title: "Message sent!" — 24px Inter Bold, #1F2224
• Message: 14px Inter Regular, #171818
• Close button: top-right, same position as card padding (32px inset)
• Footer row: "Delivered" status (left) + "Done" button (right)
• Delivered: 14px, #6B7280, done_all icon at 16px`,
      },
      {
        heading: 'Colour Reference',
        content: `• Primary blue: #016991
• Primary blue dark (hover): #014A66
• Orange (stepper active): #EA8A2E
• Orange badge (active): #F1B071
• Orange badge (upcoming): #FDF3E8
• Green badge (completed): #C3F1C8 bg, #1DB247 icon
• Grey background: #F2F2F2
• Border light: #E0EBF2 (inputs), #D9E3EA (dividers), #EAECF0 (cards)
• Text primary: #1F2224 / #171818
• Text muted: #828282
• Text link/value: #0E6A8F
• Disabled checkbox: #BDBDBD`,
      },
      {
        heading: 'Typography Reference',
        content: `• All body text: 14px Inter — standardised across labels, inputs, checkboxes, context lines
• Step title: 24px Inter Semibold
• Card section title: 24px Inter Semibold (e.g. "Standard documents")
• Modal title bar: 20px Inter Medium, #828282
• Buttons: 14px Inter Semibold
• Badge numbers: 12px Inter Medium`,
      },
    ],
  },
};

// =============================================================================
// PAGE
// =============================================================================

export default function SpecPage() {
  const params = useParams();
  const id = params.id as string;
  const spec = SPECS[id];
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (!spec || !contentRef.current) return;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${spec.title}</title>
<style>
  body { font-family: 'Inter', -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 24px; color: #1F2224; line-height: 1.6; }
  h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .meta { font-size: 14px; color: #828282; margin-bottom: 40px; }
  h2 { font-size: 18px; font-weight: 600; color: #016991; margin-top: 32px; margin-bottom: 8px; border-bottom: 1px solid #E0EBF2; padding-bottom: 8px; }
  p, li { font-size: 14px; white-space: pre-wrap; }
  .colour-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 3px; vertical-align: middle; margin-right: 4px; border: 1px solid #e5e7eb; }
</style>
</head>
<body>
<h1>${spec.title}</h1>
<p class="meta">Generated from Elite Wealth Communications Hub prototype — ${new Date().toLocaleDateString('en-ZA')}</p>
${spec.sections.map(s => `<h2>${s.heading}</h2>\n<p>${s.content}</p>`).join('\n')}
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}-ui-spec.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [spec, id]);

  if (!spec) {
    return (
      <AppLayout>
        <div className="comms-dashboard">
          <div className="page-header">
            <h1 className="page-title">Spec not found</h1>
          </div>
          <p>No UI specification exists for this flow yet.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="comms-dashboard">
        <div className="page-header">
          <h1 className="page-title">{spec.title}</h1>
          <button className="btn btn-primary" onClick={handleDownload}>
            <span className="material-icons-outlined" style={{ fontSize: '18px' }}>download</span>
            Download Spec
          </button>
        </div>

        <div ref={contentRef} className="spec-content">
          {spec.sections.map((section) => (
            <div key={section.heading} className="spec-section">
              <h2 className="spec-section-heading">{section.heading}</h2>
              <p className="spec-section-body">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
