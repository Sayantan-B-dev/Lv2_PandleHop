# AGENT.md - Rules for AI and code agents working on PandalPass

## Current state

- The repository root contains the working Next.js version of PandalPass, with App Router, TypeScript, JSON-backed data and API routes.
- `ref-basic/` is the completed static reference app. It is read-only. Use it to understand behaviour, layout, copy, data and visual detail.
- `ref-image/` contains the original design images. It is read-only.
- Do not import, copy, serve or depend on files from `ref-basic/` or `ref-image/` in the Next.js app.
- Do not modify `ref-basic/` or `ref-image/` unless the user explicitly asks.

Read `DESIGN.md` before changing any UI. Read `SKILL.md` for the build workflow.

## Product

PandalPass is a Kolkata Durga Pujo route planner. A user picks a start point, vibes, available time and travel mode, and the app generates a timed pandal-hopping route with walking or transit legs, wait and stay times, an optional food stop, costs and crowd estimates.

The experience has six routes:

| Route | Purpose |
|---|---|
| `/` | Home and product introduction |
| `/planner` | Four-step route builder |
| `/pass` | Generated itinerary and night summary |
| `/route` | Stylised SVG route map |
| `/explore` | Filterable pandal directory |
| `/food` | Food-stop directory |

Crowd levels, timings and costs are always planning estimates. Never present them as live data.

## Stack

- Next.js App Router with TypeScript.
- React Server Components by default. Client components handle the planner, route map, filters, share action, toast and local storage.
- Plain CSS: one global stylesheet for tokens, reset, layout, components and page styles. No inline styles, no `<style>` blocks and no inline colour values.
- `lucide-react` supplies SVG interface icons through `components/Icon.tsx`. No UI framework or animation library.
- `data.json` in the repository root is the single source of dummy product data. It is read on the server through `lib/data.ts`.

Scripts:

- `npm run dev` starts the dev server.
- `npm run build` builds for production.
- `npm run start` serves the production build.
- `npm run typecheck` runs `tsc --noEmit`.
- `npm test` runs typecheck then build sequentially. Use this as the single check.

Current structure:

```
app/
  api/data/route.ts
  api/pass/route.ts
  layout.tsx
  page.tsx
  globals.css
  icon.svg
  planner/page.tsx
  pass/page.tsx
  route/page.tsx
  explore/page.tsx
  food/page.tsx
components/
  Header.tsx
  Footer.tsx
  Icon.tsx
  Marquee.tsx
  PandalCard.tsx
  FoodCard.tsx
  Toast.tsx
  PlannerClient.tsx
  PassClient.tsx
  RouteClient.tsx
  RouteMap.tsx
  ExploreClient.tsx
lib/
  data.ts
  types.ts
  itinerary.ts
  storage.ts
  format.ts
data.json
```

Keep route code, shared UI, data and logic separated.

## Hard rules

1. Reference only. `ref-basic/` is a specification, not source material. Write fresh components, styles and logic.
2. Match the finished reference visually and behaviourally, including the Neo-Brutalist design in `DESIGN.md`.
3. Do not use the old phone-frame, `.stage` or `.stage__intro` layout.
4. Do not add Bengali text, the old intro block, the old credit line or a desktop mockup frame.
5. No `<style>` blocks and no `style=""` attributes. State is expressed with classes such as `is-selected`, `is-on`, `is-active`, `is-done` and `is-visible`.
6. Keep all six routes responsive from 360px to wide desktop widths.
7. Preserve the product copy and the honest-estimate disclaimers.
8. Keep accessibility: semantic landmarks, labels, keyboard-operable map markers, visible focus, and colour plus text for status.
9. Never commit secrets, environment files or generated build output.
10. Commit separate parts separately. Follow `commit.md` and run `bash commit.js` only when the user asks for commits.
11. Do not use emojis anywhere: not in the interface, data, copy, metadata, documentation or commit messages. Use `components/Icon.tsx`, Lucide SVG icons or inline SVG instead.
12. Keep all dummy product data in root `data.json`. Do not duplicate pandals, starts, foods, options, map labels or defaults in components.

## Data and logic

Root `data.json` holds the product data:

- 26 pandals with id, name, area, tagline, tags, crowd level, x/y map coordinates and other display data.
- 12 start points.
- 8 food stops.
- Vibe, time and travel-mode options.
- Site copy, storage keys, default preferences, home picks, crowd and tag labels, map area labels and engine constants.

`lib/data.ts` reads and caches the JSON on the server. `lib/itinerary.ts` contains the typed generator: it scores pandals by selected vibes, crowd and distance, orders them from the start point, adds travel legs, wait and stay times, and inserts an optional food stop. `lib/storage.ts` handles browser storage. `lib/format.ts` handles shared display formatting.

API routes:

- `GET /api/data` returns the full data set.
- `POST /api/pass` accepts planner preferences and returns a generated pass.

The planner posts preferences to `/api/pass` and stores the result locally, falling back to local generation only if the request fails.

Keep the existing storage keys unless the user asks to rename them:

- `pandalpass.prefs`
- `pandalpass.pass`

Read and write storage safely, and guard against malformed stored data.

## Expected routes and flow

Home -> Planner -> Pass -> Route or Food. Explore is reachable from Home and the header.

The planner must:

- Require at least one vibe before continuing.
- Update the live summary as choices change.
- Generate a fresh pass and navigate to `/pass`.
- Preserve choices when the user returns to edit the plan.

The pass and route pages must read the current plan and fall back to a sensible generated plan when no pass exists.

## Quality gates

Run one command before reporting work as complete:

```bash
npm test
```

`npm test` runs the checks in order and stops at the first failure:

1. `npm run typecheck`
2. `npm run build`

That is the whole gate. Do not run separate checks, do not repeat the same command on unchanged files, and do not do intense or exhaustive testing: no page-by-page browser sweeps, no viewport matrices, no clicking through every control, no test suites. Only add a browser check when a specific change cannot be judged from the code and the build, and then check just the affected route.

No lint script is configured. Do not add lint tooling unless the user asks for it.

## Commit rules

- Split commits by part: documentation, project setup, data and engine, design system, shared components, each route or route group, tests and assets.
- Use `bash commit.js` from the repository root. It stages known groups and creates one commit per group.
- Commit subjects and descriptions must be plain: imperative, concise, no emojis, no AI or bot attribution, no generated-by lines and no tool watermarks.
- Do not amend, force-push or push unless the user explicitly asks.
- Do not commit changes to reference folders.

See `commit.md` for the full policy.
