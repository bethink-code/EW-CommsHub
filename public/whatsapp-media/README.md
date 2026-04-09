# WhatsApp Template Media

This folder contains header media files for Meta-registered WhatsApp templates.

These files are served as public static assets at:
`https://ew-comms-hub.vercel.app/whatsapp-media/<filename>`

Meta requires public HTTPS URLs for template header media when sending.

## Required files

| Filename | Type | Used by template |
|----------|------|------------------|
| `portal-invite.jpg` | image | ew_portal_invite |
| `info-request.jpg` | image | ew_info_request |
| `onboarding.jpg` | image | ew_onboarding |
| `document-request.jpg` | image | ew_document_request |
| `share-document.jpg` | image | ew_share_document |
| `password-reset.pdf` | document | ew_password_reset |

## Updating images

1. Drop the new file in this folder (overwriting if it exists)
2. Commit and push
3. Vercel will redeploy and the new media will be served automatically

The files must match the same content/dimensions as the images uploaded to Meta when the templates were registered, otherwise WhatsApp may reject them.

## Image requirements (Meta)

- **Format**: JPG or PNG for images
- **Max size**: 5MB
- **Recommended dimensions**: 1080x566 (16:9 aspect ratio)
- **Documents**: PDF, max 100MB
