# Purva Birthday Surprise ❤️

A static romantic birthday surprise built with HTML, CSS, and vanilla JavaScript.

## Files

- `index.html` — page structure and content
- `style.css` — responsive romantic design and animations
- `script.js` — password, countdown, calendar, birthday unlock, gallery, music and confetti
- `images/README.md` — instructions for adding photos
- `audio/README.md` — instructions for adding optional music

## Personalization

### Photos

Put your photos here:

- `images/photo1.jpg`
- `images/photo2.jpg`
- `images/photo3.jpg`
- `images/photo4.jpg`

The site detects missing files and keeps working normally.

### Music

Optional:

`audio/our-song.mp3`

Music never starts automatically. The music button starts/stops it manually.

## Birthday logic

The countdown targets September 2, 2026 using the visitor's local browser time. On September 2 or later, the countdown is replaced automatically by the birthday celebration.

## GitHub Pages

This repository is already structured as a static site. In GitHub:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch containing these files and the `/ (root)` folder.
4. Save.

No server, database, framework, or build step is required.

## Important

The password is intentionally client-side because this is a romantic surprise rather than real security. Anyone who inspects the JavaScript can discover it.
