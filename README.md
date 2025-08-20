# News Monitor Web

Voice-driven YouTube Shorts viewer with English/Dutch commands, keyboard navigation, responsive layout, glow visuals, and idle dimming overlay.

## Features

- Voice commands: "next" / "back" (also Dutch: "volgende", "terug", etc.)
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

## Getting Started

Install deps and run dev server:

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:3000). Allow microphone permission.

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
