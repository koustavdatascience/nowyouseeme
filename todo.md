# Live Invisibility Cloak Application Checklist

- [x] Replace the instructional guide route with the live application interface.
- [x] Load MediaPipe Tasks Vision from a browser CDN and initialize the Hand Landmarker for two hands.
- [x] Request the webcam stream, mirror the rendering canvas, and safely handle camera-permission failures.
- [x] Capture an aligned background snapshot and provide a retake-background control.
- [x] Draw a four-corner polygon from index-finger and thumb tips when two hands are detected.
- [x] Fill the polygon using the matching region from the background snapshot and feather its edges.
- [x] Add smoothing, live status feedback, orientation guidance, and responsive controls.
- [x] Validate the production build and check the non-camera, permission, and active-camera states.
- [ ] Save a checkpoint and deliver the application.
