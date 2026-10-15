# HexCore Tower V4.10 — Network Transit and Menu Responsiveness

- Retains two-choice landing portal with holographic website and 3D headquarters.
- Removes automatic expensive 3D scene construction 20 ms after character selection appears; begins the scene build during the cinematic instead.
- Replaces flat repeating CSS rings with a perspective network-flight canvas: angular gateways, receding network lanes, depth-separated light packets and a luminous terminal.
- Adds a readable loading progress bar, percentage, and world-preparation status. The percentage is a **preparation indicator** combining the 10-second cinematic and scene readiness, not bytes downloaded.
- Preserves the authorization message and welcome-user arrival beam.

## Caveat
World construction still runs on the JavaScript main thread and some frames may hitch while meshes are built. This update does not guarantee stutter-free startup. Full elimination requires progressive scene generation and/or offline-prepared assets. Visually test on GitHub Pages.

Extract archive contents into the GitHub Pages repository root.
