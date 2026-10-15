# HexCore Tower V4.13 — Rollback recovery

V4.12 introduced tower appearance changes and a first-frame purple freeze. This package restores the V4.11 application source and initialization order instead of continuing V4.12's experimental staged-build and cached-scene changes.

- V4.11 tower geometry and entrance construction order restored.
- V4.11 pre-arrival first render restored.
- V4.12 extra staged build and department scene caching removed.
- Existing two-choice portal, holographic site and no-loading-bar cinematic retained.

This is a conservative recovery rollback, **not a verified freeze elimination**. Initial world building still runs on the browser main thread and may stutter. Browser run/performance verification is needed.

Unzip contents at repository root.
