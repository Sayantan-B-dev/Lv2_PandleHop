# PandalPass

PandalPass is a planning companion for Durga Pujo in Kolkata. It helps a group choose a starting point, pick the kind of night they want and generate a timed pandal-hopping route with travel legs, food stops, costs and crowd estimates.

Crowd levels, timings and costs are planning estimates, not live data.

## Repository status

The completed static reference app is in `ref-basic/`. The repository root contains the Next.js implementation of the same product, including all six routes, JSON-backed data and API routes.

`ref-basic/` and `ref-image/` are read-only references. The Next.js app does not import or serve files from either folder. All dummy product data lives in root `data.json`.

## What the product includes

- A home page with an introduction, route preview, stats, steps, pandal picks and food highlights.
- A four-step planner covering start point, vibes, available time and travel mode.
- A generated Pujo Pass with a timeline, travel legs, wait and stay times, food stop and night summary.
- A stylised SVG route map with numbered stops, crowd markers, metro lines and stop details.
- A filterable pandal directory.
- A food-stop directory with rough per-person prices.
- Local storage for planner preferences and the generated pass.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home |
| `/planner` | Route builder |
| `/pass` | Generated itinerary |
| `/route` | Route map |
| `/explore` | Pandal directory |
| `/food` | Food stops |

API routes:

| Route | Purpose |
|---|---|
| `GET /api/data` | Full JSON data set |
| `POST /api/pass` | Generate a pass from planner preferences |

## Stack

- Next.js App Router
- TypeScript
- React
- Plain CSS with global design tokens and shared styles
- SVG interface icons through `lucide-react`

The visual system is a Neo-Brutalist festival style with square corners, thick ink borders, hard offset shadows, maroon and cream surfaces, and bright gold, pink, blue, lime and orange accents. There are no emojis in the interface, data or copy.

## Repository layout

```
AGENT.md       Engineering rules for agents
DESIGN.md      Design system
SKILL.md       Build and verification workflow
commit.md      Commit policy
commit.js      Separate-commit helper, run with bash
README.md      This file
data.json      Single source of dummy product data
app/           Next.js App Router routes and global styles
components/    Shared UI and interactive client components
lib/           Typed data loading, itinerary, storage and formatting
ref-basic/     Finished static reference app
ref-image/     Original reference images
```

## Run locally

```bash
npm install
npm run dev
```

Production check (type check, then build, in sequence):

```bash
npm test
```

Serve the build with `npm run start`.

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.

Open `http://localhost:3000`. The planner flow is `/planner` -> `/pass` -> `/route`.

## Reference app

The static reference can be opened directly from `ref-basic/index.html`, or served with any static file server. It is plain HTML, CSS and JavaScript and has no build step.

## Commit workflow

Once changes are ready, run:

```bash
bash commit.js
```

The helper groups related files and creates a separate commit for each group. It skips empty groups, does not push, and does not amend history.

Commit messages and descriptions must be plain and simple. Do not use emojis, AI or bot attribution, generated-by lines or tool watermarks.

Use `bash commit.js --dry-run` to preview the groups without committing.

See `commit.md` for the full policy.

## Working with agents

Agents should read `AGENT.md`, `DESIGN.md`, `SKILL.md` and `commit.md` before making changes. The reference folders are read-only, and the Next.js app must be written from scratch rather than assembled from the static files. Do not run intense or repeated testing; `npm test` once is the check.
