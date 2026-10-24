# HexCore V6.0.34 — Stage 1 CMS

This is the COMPLETE prior V6.0.33 website plus the Stage 1 dashboard upgrade. Open `admin/index.html`. Authenticate with a fine-grained GitHub token restricted to this repository and Contents: read/write. Token remains in page memory (not embedded in GitHub files).

**New:** two-site management home, searchable/filterable/sortable post editor, categories, tags, drafts/published/archived, featured flag, site targeting, image covers, YouTube link validation, retained original NPC/department/media editors, JSON backup. Public post presentation and integration with the separate traditional website are Stage 2 and NOT connected yet. Selecting Traditional in the dashboard organizes records but does not publish to that second site's repository.

Content publishing updates `data/managed-content.json` on the connected GitHub repository. Existing original FAQ, media, and 3D assets remain untouched. GitHub authorization is not equivalent to full account-management or custom password login. Only browse this interface on trusted devices; revoke tokens you no longer use.

To deploy, upload the ZIP contents to the existing GitHub repo root without flattening folders. Back up the existing repository first. All original files are included.
