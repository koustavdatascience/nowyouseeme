# Live Invisibility Cloak Application Checklist

- [x] Replace the instructional guide route with the live application interface.
- [x] Load MediaPipe Tasks Vision from a browser CDN and initialize the Hand Landmarker for two hands.
- [x] Request the webcam stream, mirror the rendering canvas, and safely handle camera-permission failures.
- [x] Capture an aligned background snapshot and provide a retake-background control.
- [x] Draw a four-corner polygon from index-finger and thumb tips when two hands are detected.
- [x] Fill the polygon using the matching region from the background snapshot and feather its edges.
- [x] Add smoothing, live status feedback, orientation guidance, and responsive controls.
- [x] Validate the production build and check the non-camera, permission, and active-camera states.
- [x] Save a checkpoint and deliver the application.

## Retro-OS UI Redesign

- [x] Replace the dark technical shell with the supplied white, gray, blue, and red Retro-OS visual system.
- [x] Convert the header, camera stage, controls, and status region into crisp bordered desktop-window components.
- [x] Apply bitmap-style typography, square icon controls, classic blue buttons, and 1px black outlines.
- [x] Preserve webcam startup, background recapture, two-hand tracking status, and cloak rendering behavior.
- [x] Verify desktop and mobile layouts, then validate the production build.
- [x] Save and deliver the redesigned application.

## External Hosting Preparation

- [ ] Select the external static hosting provider and confirm HTTPS support for webcam access.
- [ ] Prepare the build configuration and repository handoff for the selected provider.
- [ ] Deploy or guide the provider-specific deployment process.
- [ ] Verify the deployed site can request a webcam over HTTPS.

## GitHub to Cloudflare Pages

- [x] Add Cloudflare Pages build configuration and repository handoff documentation.
- [ ] Create a dedicated GitHub repository and push the complete application source.
- [ ] Connect the repository to Cloudflare Pages and start the production deployment.
- [ ] Verify the public `pages.dev` address and HTTPS webcam availability.
