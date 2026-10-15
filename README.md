# HexCore Tower V4.11 — Menu/Transit Stability

Base: the ZIP provided by the user, V4.10.

Changes:
- Removed the network-transit loading bar, numeric percentage, and progress status block entirely.
- Network cinematic runs alone for 1.6 seconds before starting geometry preparation.
- Reduced cinematic pixel ratio and packet/gateway draw counts to lower startup overhead.
- Prevented repeated geometry preparation attempts at the 10-second mark.
- Startup failures are now reported visibly instead of looping indefinitely.
- Preserved both portal options, main menu choices, existing characters, lobby/world, and Legal dialogue.

Remaining limitation: scene building is still on the main browser thread, which can cause frame hitches. Browser/device tests remain necessary; this is not a guaranteed cure for every crash.

Install: unzip contents into GitHub repository root, replace, commit and push.
