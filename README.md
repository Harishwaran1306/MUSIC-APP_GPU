# TamilTune — Premium UI/UX frontend prototype

**Where Nature Meets Music, Forever.**

TamilTune is a responsive, interactive frontend prototype built with plain HTML, CSS, and JavaScript. The existing login/account page is preserved and includes a clearly labelled demo-entry action. The app uses the original project structure and does not require a frontend build step.

## Run locally

From this folder, run:

```bash
python -m http.server 8000
```

Then open:

- Login and account screens: http://localhost:8000/
- Main application: http://localhost:8000/home.html

Serving on `localhost` is recommended for microphone permissions. Audio capture requires a supported browser and explicit microphone permission.

## Included screens and interactions

- Login, create account, email-based password recovery, and a separate reset-form preview demonstration flow.
- Home, Explore Songs, Record Audio, dedicated Live Recognition, Upload Audio, Song Results/Lyrics preview, My Library, Playlists, History, Settings, Help, and About.
- Desktop sidebar collapse/expand and responsive mobile bottom navigation.
- Original botanical-wave logo assets: `tamiltune-logo.svg`, `tamiltune-mark.svg`, and `favicon.svg`.
- Sample-catalogue search suggestions and recent searches.
- Category, language, decade, and sort filters; grid/list switching.
- Local favourites and library state, playlist creation/rename/delete, adding/removing songs, history entries, and confirmation dialogs.
- English/Tamil interface translation layer for implemented navigation and common controls; Tamil is rendered with Unicode-safe system fallbacks.
- Settings preferences, reduced-motion support, text scaling preference, local data export, and clear-local-data confirmation.
- Real browser microphone capture and actual input waveform on the recording screen, where supported and permitted.
- Dedicated live microphone waveform using actual input only after Start is pressed; microphone tracks stop when listening ends or the user leaves the view.
- Local audio file selection, drag-and-drop, size/type checks, playback preview, and remove/replace flow.
- Clearly labelled sample song results and demo no-match states.

## Demo boundaries

This is a **frontend UI/UX prototype**, not a production music-recognition service. The project does not connect to a new backend, secure authentication provider, AI song-recognition engine, speech transcription, live music database, streaming service, or lyrics provider. Login, registration, and password recovery explain that no real account/email action occurs. The “Continue in demo mode” action opens the application without authenticating a user.

Sample catalogue entries are illustrative. No confidence score, real-time trending claim, genuine song match, or synchronised lyrics is fabricated. Lyrics content is original placeholder text. Audio selected or captured by the browser is not uploaded to a server.

Playlist, library, favourites, settings, searches, and history data are stored in the current browser when local storage is available. Do not use this demo for sensitive information. Passwords are not stored.

## Project files

- `index.html` — login, account creation, and password-reset screens.
- `home.html` — main application and core recording/upload interactions.
- `premium-enhancements.css` — additive responsive refinements and playlist/live/search styling.
- `premium-enhancements.js` — logo refinement, playlists, search suggestions, dedicated live-listening UI, and language refinements.
- `tamiltune-logo.svg`, `tamiltune-mark.svg`, `favicon.svg` — scalable brand assets.
- `backend/`, `tests/`, `API.md`, and `requirements.txt` — retained from the existing project; the new UI prototype does not require them.

## Verification notes

- JavaScript syntax checks pass for the inline scripts in `index.html` and `home.html`, and for `premium-enhancements.js`.
- Existing backend test suite: `PYTHONPATH=. pytest -q` — 5 tests passed.
- HTML was checked for duplicate IDs and referenced local assets.
- ZIP integrity was checked after packaging.
- Full visual screenshot and end-to-end browser QA could not be completed in this environment because headless Chromium navigation/rendering repeatedly timed out or was blocked. Therefore desktop/mobile visual verification, keyboard-only journey testing, and microphone/device-specific behaviour still need to be checked in a normal browser.
