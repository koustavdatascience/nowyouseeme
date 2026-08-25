# Reference-Driven Design Specification

## Ground-Truth Reference

The supplied Invisibility Cloak Guide website is the source-of-truth for this build. The implementation should preserve its instructional single-page experience, dark technical-editorial tone, vertical storytelling order, lime-green signal color, prompt-copy workflow, and compact, readable mobile behavior. Fidelity to the reference takes priority over alternative visual exploration.

## Chosen Design Direction: Field Manual for Browser Magic

**Design Movement:** A contemporary developer field manual, blending editorial documentation with the restrained, luminous mood of experimental creative-coding tools.

**Core Principles:** The page is deliberately focused, with one clear reading path; bright green is used as a semantic signal for actions and labels; instructional content is formatted as tangible technical artifacts; and the tone turns an impressive visual effect into an approachable build session.

**Color Philosophy:** A near-black canvas creates concentration and lets the content panels feel like illuminated work surfaces. Charcoal cards separate instructional beats without breaking the page into a dashboard. Acid-lime green is reserved for labels, step numbers, interaction confirmations, and the “Invisibility Cloak” emphasis, creating a recognizable signal layer.

**Layout Paradigm:** A tall editorial runway leads from a compact manifesto-style hero into sequential guide cards. The content stays intentionally narrow for concentration, while asymmetric micro-details—left labels, right-aligned copy actions, and a horizontal effect pipeline—prevent the composition from reading as a generic centered landing page.

**Signature Elements:** Fluorescent-green rectangular section tags, terminal-style prompt panels with an integrated copy action, and small tactile chips that summarize the required ingredients.

**Interaction Philosophy:** Interactions should be useful and quiet. Copy controls acknowledge success in-place, the hero action scrolls directly to the build instruction, and surfaces respond with a small shift rather than theatrical effects.

**Animation:** Page elements may enter with brief upward fades and staggered timing; cards lift by a few pixels on hover; buttons press down slightly on activation. All nonessential motion respects reduced-motion preferences.

**Typography System:** Space Grotesk provides assertive, compact display headings. IBM Plex Mono handles prompts, labels, and technical notes, while a clean sans-serif body face supports longer explanatory text. Large display type is used only in the hero; headings become deliberately compact deeper in the guide.

**Brand Essence:** A practical creative-coding field guide for makers who want cinematic browser effects without a complex toolchain. Personality: **curious, capable, unpretentious**.

**Brand Voice:** Headlines are direct and maker-focused. CTAs describe the next tangible action instead of selling abstract value. Example lines: “Build the effect, then make it yours.” and “Take the empty-room snapshot before you step back in.”

**Wordmark & Logo:** A small green aperture mark made from four open corner brackets surrounds a dark center, evoking both a camera frame and a window cut through visibility. The wordmark uses wide-tracked monospace lettering rather than a default logo font.

**Signature Brand Color:** Signal Lime — `#7CFF6B`.

## Style Decisions

The build should maintain strong visual contrast, never use purple gradients or generic “startup” surfaces, and keep text legible on every panel. Generated artwork is used as a discreet visual texture or brand asset, not as a replacement for the instructional content. The guide remains frontend-only and does not itself request webcam access.

## Current Ground-Truth UI Reference: Retro-OS Kit

The supplied Retro-OS UI kit is the visual source-of-truth for the current live application redesign. Fidelity to its desktop-era utility styling overrides the previous dark field-manual direction while the live webcam and hand-tracking behavior remains unchanged.

**Reference rules:** Use an off-white workspace with fine horizontal scanline texture; assemble the interface from hard-edged white and pale-gray panels; use 1px black outlines plus simple dark offset shadows; reserve saturated OS blue (`#0078D7`) for window title bars and primary buttons; use red (`#E81123`) only for destructive or close affordances; retain 4px or smaller corner radii; and render headings and labels in compact bitmap-like or strongly monospace type. The camera should become the main “application window,” controls should read as classic system buttons, and status text should appear in square utility strips. Avoid gradients, glass effects, broad soft shadows, oversized rounded rectangles, or neon styling.
