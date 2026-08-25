# Invisibility Cloak

A browser-based invisibility-cloak effect built with React, a local webcam stream, and MediaPipe hand tracking. The app captures an empty-room background, detects the tips of two index fingers and two thumbs, and paints the matching snapshot region inside the resulting four-point polygon.

## Run locally

Use Node.js 22 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local address shown by Vite, click **Start camera**, approve camera permission, and make sure you are out of frame for the initial background capture.

## Cloudflare Pages deployment

Create a Cloudflare Pages project from this GitHub repository, then use the following settings.

| Setting | Value |
| --- | --- |
| Framework preset | None / Vite |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Node.js version | `22` |

Cloudflare Pages provides a `*.pages.dev` address with HTTPS. HTTPS is required for browsers to request webcam permission outside localhost.

## How the effect works

The live view is mirrored to a canvas. After the initial background snapshot, MediaPipe tracks up to two hands. The app builds a polygon from both index-finger tips and both thumb tips, smooths those coordinates, clips the saved snapshot inside that polygon, and feathers its edge for a less cut-out appearance.
