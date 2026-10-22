# TamilTune API contract (development)

Base URL for local development: `http://localhost:8001`

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | API status and provider configuration flags |
| GET | `/api/config` | Supported languages, upload limit, integration flags |
| GET | `/api/categories` | Discovery category list (catalog availability is explicit) |
| GET | `/api/songs/search?q=...&language=ta&page=1&limit=20` | Search catalog; empty response when no catalog is configured |
| POST | `/api/recognition/identify` | Multipart audio validation and recognition integration boundary |
| GET / PUT | `/api/settings` | Development guest preferences |
| GET / POST | `/api/library` | List or save a song in the development guest library |
| DELETE | `/api/library/{song_id}` | Remove saved song |
| GET / POST / DELETE | `/api/history` | List, add, or clear guest history |
| GET | `/api/songs/{song_id}` | Song details (503 until a catalog adapter exists) |
| GET | `/api/songs/{song_id}/lyrics` | Lyrics (503 until a licensed provider adapter exists) |

`POST /api/recognition/identify` accepts `file` (multipart file), `input_method` (`recording`, `humming`, `whistle`, `upload`, or `live`) and `language`. Upload limit defaults to 20 MiB. The API checks file size, extension/content type, and several common audio container signatures; this is not a substitute for a full codec parser or malware scanning. Valid audio receives a clear `503 recognition_not_configured` response until a tested provider adapter is implemented.

All endpoints currently operate on a shared `guest` identity. Do not deploy publicly or use with sensitive user data until authentication and per-user authorization are implemented.
