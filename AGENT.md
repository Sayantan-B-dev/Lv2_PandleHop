# AGENT.md - Rules for AI and code agents working on PandalPass

## Current state

- The repository root will become the Next.js version of PandalPass. The Next.js app has not been created yet.
- `ref-basic/` is the completed static reference app. It is read-only. Use it to understand behaviour, layout, copy, data and visual detail.
- `ref-image/` contains the original design images. It is read-only.
- Do not import, copy, serve or depend on files from `ref-basic/` or `ref-image/` in the Next.js app. Rebuild the experience with React and Next.js.
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

## Planned stack

- Next.js App Router with TypeScript.
- React Server Components by default. Use client components only where interaction requires them: planner, route map, filters, share action, toast and local storage.
- Plain CSS: a global token and reset layer, plus component-level CSS Modules. No inline styles, no `<style>` blocks and no inline colour values.
- No UI framework or animation library unless the user approves it.
- Keep the dependency list small and justified.

A reasonable target structure is:

```
app/
  layout.tsx
  page.tsx
  globals.css
  planner/page.tsx
  pass/page.tsx
  route/page.tsx
  explore/page.tsx
  food/page.tsx
components/
  layout/
  ui/
  home/
  planner/
  pass/
  route/
  explore/
  food/
lib/
  data.ts
  types.ts
  itinerary.ts
  storage.ts
public/
```

Adapt the structure if needed, but keep route code, shared UI, data and logic separated.

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

## Data and logic

Move the reference data and itinerary engine into typed modules:

- 26 pandals with id, name, area, tagline, tags, crowd level, x/y map coordinates and other display data.
- 12 start points.
- 8 food stops.
- Vibe, time and travel-mode options.
- The generator scores pandals by selected vibes, crowd and distance, orders them from the start point, adds travel legs, wait and stay times, and inserts an optional food stop.

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

Before reporting work as complete:

1. Run the project lint command.
2. Run TypeScript checking.
3. Run a production build.
4. Exercise all six routes and the planner -> pass -> route flow in a browser.
5. Check desktop and mobile widths for horizontal overflow.
6. Check the browser console for errors.
7. Confirm `ref-basic/` and `ref-image/` were not modified.

Use the scripts defined in `package.json` once the app exists.

## Commit rules

- Split commits by part: documentation, project setup, data and engine, design system, shared components, each route or route group, tests and assets.
- Use `bash commit.js` from the repository root. It stages known groups and creates one commit per group.
- Commit subjects and descriptions must be plain: imperative, concise, no emojis, no AI or bot attribution, no generated-by lines and no tool watermarks.
- Do not amend, force-push or push unless the user explicitly asks.
- Do not commit changes to reference folders.

See `commit.md` for the full policy.
