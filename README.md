# HexCore Tower V4.9 — Choice Portal & Lobby Obstruction Correction

Targeted correction based on the V4.7 screenshot and V4.8 failure report.

- The original two-choice launch portal is preserved as the homepage. Clicking 3D navigates to `headquarters.html?from=portal`, and a direct old link to `headquarters.html` returns to the portal.
- The real underlying problem was tower-facade structural solids intersecting the same volume as the open lobby. The exterior build now culls intrusive large structural boxes before adding the lobby contents.
- The existing lobby desks, NPCs, globe, floor transit and mobile controls remain.
- This is a geometry-level correction and no changes to the portal styling were made.

Note: A live graphical browser test has not been completed. Verify both the menu and lobby in the deployed website.
