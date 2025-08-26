# News Monitor Web

Voice-driven YouTube Shorts viewer with English commands, keyboard navigation, responsive layout, glow visuals, and idle dimming overlay.

Watch the final result on Vimeo: https://vimeo.com/1113295145/7aa2ef3583?share=copy

[![Watch the video on Vimeo](public/Thumbnail_video.jpg)](https://vimeo.com/1113295145/7aa2ef3583?share=copy)

## Features

- Voice commands: "next" / "go back" or "back"
- Keyboard: ArrowRight / ArrowLeft
- Randomized (shuffled) playlist of Shorts, each loops until you switch
- Responsive layout with mobile button repositioning
- Visual glow feedback on video switch & navigation buttons
- Idle dark overlay that fades in after a delay
- Background video + blurred glass center panel

## Tech Stack

- Vite + Vanilla JS
- Web Speech API
- YouTube iframe embeds (/embed/ + loop + autoplay)
- Pure CSS animations & custom properties

## Prerequisites

- Node.js 18+ (Vite 5 requires Node >= 18)
- npm 9+ (or pnpm/yarn if you prefer)
- Recommended browsers for voice: Chrome or Edge (Web Speech API support)

## Getting Started

Install deps and run dev server:

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:3000). Allow microphone permission.

Need HTTPS locally (optional, for stricter mic policies)?

```bash
npm run dev-https
```

Your browser may prompt to trust a self-signed certificate once.

## Build for Production

```bash
npm run build
npm run preview
```

`dist/` contains the production build.

## Deploy (GitHub Pages quick method)

Build and push the `dist` directory to a `gh-pages` branch:

```bash
npm run build
git add dist -f
git commit -m "Add build"
git subtree push --prefix dist origin gh-pages
```

Enable Pages on the `gh-pages` branch in repository settings.

If deploying under a repo subpath (https://<user>.github.io/<repo>/):

- Set a base path in `vite.config.js`:
    - `export default defineConfig({ base: '/News-monitor-web/', ... })`
- Avoid leading slashes for public assets in `index.html` (use `Render_02_compressed.mp4` and `banknote.png`, not `/Render_02_compressed.mp4` or `/banknote.png`).
  This ensures assets load correctly on GitHub Pages.

## Configuration Tweaks

- Overlay fade duration: edit `--overlay-fade-duration` in `src/style.css`.
- Idle delay (currently 8000ms): adjust timeout in `loadCurrentVideo()` in `src/main.js`.
- Add/remove videos: edit `SHORTS_LIST` in `src/main.js`.

## Large Files

Avoid committing >100MB files; compress media placed in `public/`.

## License

MIT (see LICENSE file).

---

Feel free to request enhancements or open issues.

## Pitfalls

- Browser mic permissions: Voice commands need microphone access; if blocked, only keyboard works. Check site settings and HTTPS context.
- SpeechRecognition quirks: Some browsers (iOS Safari, older Edge) have limited Web Speech API support; the app falls back gracefully.
- YouTube embed params: Loop requires adding `playlist=VIDEO_ID` alongside `loop=1`. The code handles this; avoid pasting non-embed watch URLs.
- Autoplay policies: Muted autoplay is generally allowed; if audio plays, some browsers may block autoplay. The iframe uses autoplay with site muted.
- Large assets: GitHub blocks files >100MB. Keep `public/` media compressed (use the provided `Render_02_compressed.mp4`).
- Mobile layout: Buttons reposition around the video at <=680px; custom CSS changes can affect their positioning—verify on small screens.
- Idle overlay: The dark overlay animates in after ~8s idle on a video. If you adjust the duration/timeout, keep animations smooth.

## Tips

- Add or remove videos by editing `SHORTS_LIST` in `src/main.js` (use `/embed/VIDEO_ID` form).
- Tune visuals via CSS variables and classes in `src/style.css` (e.g., `--overlay-fade-duration`, `.money-pit.highlight`).
- Keyboard is fastest for testing: Left/Right arrows switch videos without using the mic.
- The green "money-pit" banner: copy and palette are easy to tweak—look for `.money-pit` rules and `updateMoneyPitLead()` in `src/main.js`.
- Prevent repetitive platforms: Logic avoids three identical platform picks in a row; adjust platform list in `updateMoneyPitLead()`.
- If speech stops: The recognizer restarts automatically and alternates `en-US` / `nl-NL`; open DevTools console for transcripts and errors.

## Maker files

- `index.html` — Shell markup, loads fonts, `src/style.css`, and `src/main.js`; defines the video iframe, money-pit banner, and buttons.
- `src/main.js` — Core app logic: playlist, YouTube embed URL building, voice commands (EN), keyboard handlers, money-pit lead/counter, layout tweaks.
- `src/style.css` — Layout and effects: glass panel, idle overlay, button and video glow, responsive rules, money-pit styles.
- `public/Render_02_compressed.mp4` — Background video asset (compressed for Git).
- `public/banknote.png` — Icon for the money-pit banner.
- `vite.config.js` — Dev server/build config.
- `package.json` — Scripts (`dev`, `build`, `preview`) and deps.

## Code explanation

High-level flow:

- On `DOMContentLoaded`, a `NewsMonitor` instance is created (`src/main.js`). It shuffles the Shorts list, loads the current video, binds keyboard/button events, starts voice recognition, and positions side buttons.
- Voice: `setupVoiceCommands(this)` uses the Web Speech API in continuous mode, alternating `en-US` and `nl-NL`. Recognized phrases route to `handleVoiceCommand('next'|'back')`. Unknown speech shows a brief prompt in `#voice-error` with a glow animation.
- Navigation: `nextVideo()` / `previousVideo()` adjust the index, call `loadCurrentVideo()`, flash the corresponding nav button, and increment the revenue counter.
- Video loading: `loadCurrentVideo()` builds a YouTube `/embed/` URL and ensures `autoplay=1&loop=1&playlist=VIDEO_ID` so each video loops until the user switches. It triggers a glow on the video frame, updates and highlights the green money-pit banner, resets the idle overlay, and schedules the overlay to fade in after ~8s.
- Money-pit banner: `updateMoneyPitLead()` picks a platform label from `[Facebook, Instagram, YouTube, TikTok]` while preventing three identical picks in a row (tracks `_lastPlatform` and `_repeatCount`). `bumpRevenue()` increases a running total by a small random amount and formats it as EUR. `highlightMoneyPit()` temporarily raises the banner background opacity.
- Layout: `updateSideButtonsPosition()` centers buttons above/below the video on narrow screens (<=680px) and floats them midway toward the video on larger screens. CSS handles responsive spacing and visual effects.

Key functions in `src/main.js`:

- `setupVoiceCommands(instance)` — Starts/restarts SpeechRecognition; routes results to next/back; shows transient hints.
- `shuffleArray(arr)` — Fisher–Yates shuffle for randomized playlist order.
- `handleVoiceCommand(cmd)` — Calls `nextVideo` or `previousVideo`.
- `bindEvents()` — Keyboard arrows, button clicks, hover glow, and window resize.
- `loadCurrentVideo()` — Computes embed URL with autoplay+loop; triggers glow/overlay; updates money-pit and button positions.
- `updateMoneyPitLead()` / `highlightMoneyPit()` — Platform label logic and visual emphasis.
- `flashNavButton(dir)` — Temporary glow on the pressed nav button.
- `bumpRevenue()` / `randomRevenueDelta()` / `formatCurrency()` — Counter logic and EUR formatting.

Styling (`src/style.css`):

- `.money-pit` has a low default background opacity that bumps on highlight; green glow pulses idly.
- `#bg-overlay` uses a CSS variable (`--overlay-fade-duration`) for the dimming fade; fast fade-out on interaction.
- Buttons and video frame use gradient-border glow, radial hover light, idle drift, and pulse animations.
- Mobile breakpoint at 680px repositions buttons and adjusts spacing below the video.

Markup (`index.html`):

- Loads fonts and `src/style.css`, then runs `src/main.js` as a module. Contains the background video, overlay, Shorts iframe, money-pit banner (lead + counter + icon), and side buttons.
- If deploying to a subpath (GitHub Pages), either set Vite `base` or make asset paths relative in the HTML as noted above.

## Secrets & environment

This project doesn’t require secret keys out of the box. If you add APIs later:

- Store keys in `.env` files (already ignored by `.gitignore`).
- With Vite, expose only variables prefixed with `VITE_` to the frontend.
- Never commit real secrets; commit an `.env.example` with placeholders instead.

Example:

```
# .env (do not commit)
VITE_API_BASE_URL=https://api.example.com
VITE_PUBLIC_TOKEN=placeholder

# usage in code
const apiBase = import.meta.env.VITE_API_BASE_URL;
```
