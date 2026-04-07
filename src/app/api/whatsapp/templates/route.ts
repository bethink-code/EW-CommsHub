/**
 * WhatsApp Templates API Route
 *
 * GET /api/whatsapp/templates
 * Fetches all registered message templates from Meta Business Manager.
 */

import { NextResponse } from 'next/server';
import { fetchMetaTemplates, META_TEMPLATE_MAP } from '@/lib/whatsapp';

export async function GET() {
  try {
    const templates = await fetchMetaTemplates();

    // Enrich each template with the internal commtype it maps to (if any)
    const enriched = templates.map(template => {
      const matchedCommType = Object.entries(META_TEMPLATE_MAP).find(
        ([, mapping]) => mapping.metaTemplateName === template.name
      );

      return {
        ...template,
        mappedCommType: matchedCommType ? matchedCommType[0] : null,
        mappedParameterOrder: matchedCommType ? matchedCommType[1].parameterOrder : null,
      };
    });

    return NextResponse.json({ success: true, templates: enriched });
  } catch (error) {
    console.error('Template fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}
