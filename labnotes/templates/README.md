# Lab Notes templates

Use these files to add a new Lab Note through GitHub.

## Add a note

1. Copy `new-note-template.html` to `labnotes/posts/<slug>.html`.
2. Replace all `NOTE_*` placeholders.
3. Pick one category:
   - `Release Notes`
   - `Setup & Hardware`
   - `Telemetry Clarity / TCR`
   - `Support Baseline`
   - `Experiments`
4. Add matching tags in the visible pills near the top of the note.
5. Copy the JSON entry from the bottom of the note into `Resources/labnotes.json`.
6. Optionally add an RSS item to `Resources/labnotes.rss`.

## Category CSS classes

Use the matching class on the category pill:

- `cat-release` for `Release Notes`
- `cat-setup` for `Setup & Hardware`
- `cat-tcr` for `Telemetry Clarity / TCR`
- `cat-support` for `Support Baseline`
- `cat-experiments` for `Experiments`

## Security note

Do not put secrets, tokens, license internals, customer information, or private links in Lab Notes templates. Publishing stays GitHub-backed for now.
