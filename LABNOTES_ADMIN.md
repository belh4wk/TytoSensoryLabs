# Lab Notes publishing workflow

This site stays static and GitHub-backed for now. There is no website login, no client-side secret, and no database.

## Add a new note

1. Create a new file in `labnotes/posts/` using `labnotes/templates/new-note-template.html` as the starting point.
2. Add the note metadata to `Resources/labnotes.json`.
3. Optionally add an RSS item to `Resources/labnotes.rss`.
4. Commit through GitHub.

## Update an existing note

Use GitHub's edit flow on the note page or edit the file directly in the repo. GitHub history is the rollback mechanism.

## Contributions

Public feedback should start as GitHub issues. TCR observations and setup reports should be triaged before becoming public website content.

## Security rule

Never place GitHub tokens, API keys, passwords, or publishing secrets in website HTML, CSS, or JavaScript. If a future website-based admin exists, it should use a serverless backend and GitHub/Passkey authentication, not client-side secrets.
