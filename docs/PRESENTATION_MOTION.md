# Route-specific Motion Presentations

Date: 2026-09-05
Generator: `einfachhausen-de/einfachhausen-presentation-generator`

The public website consumes 25 static Remotion outputs. No Remotion package is
added to the website runtime.

## Integration

`src/components/marketing/motion-presentation.tsx` is the shared web player.
It consumes `/media/presentations/<id>.mp4` and `<id>.jpg`, is muted and inline,
uses metadata preloading, and pauses automatically when the visitor requests
reduced motion. Manual play/pause remains available.

The component is inserted additively. No existing website section is removed.
Shared integration points cover all 12 service-detail pages and the four
product-story pages; nine additional marketing routes opt in directly.

## Regeneration

Change route content or motion design in the generator, run `npm run render:site`,
and replace the complete generated asset set plus `manifest.json` together.
Never hand-edit individual website MP4s.
