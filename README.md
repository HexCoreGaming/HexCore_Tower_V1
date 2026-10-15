# HexCore Tower V4.12 — Stability groundwork

Based on the user's uploaded V4.11 source. Existing visuals, portal menu, and no-loading-bar cinematic retained.

## Changes
- Split the large plaza construction function into nine sequential construction steps, scheduled across animation frames.
- Removed the forced WebGL full-scene render from the loading sequence.
- Keep exterior and lobby together as a pinned scene.
- Cache the two most recently visited department 3D scenes so revisiting them does not rebuild all meshes. Evict older departments to limit memory growth.
- Emit console timing for slow world-construction steps (>24 ms) to identify remaining stalls.

## Limits
No live browser or GPU performance verification has been completed. A single stage or a first-time department build can still cause frame drops; no zero-lag promise.
