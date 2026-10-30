---
name: pandalpass-nextjs
description: Build or extend the PandalPass Next.js app from the completed ref-basic static reference. Use when implementing routes, components, styling, itinerary logic, browser checks, or the separate commit workflow.
---

# PandalPass Next.js build skill

## Purpose

Turn PandalPass into a production-quality Next.js app in the repository root. The static app in `ref-basic/` is the finished visual and behavioural reference. `ref-image/` holds the original design images. Both are read-only.

The Next.js app does not exist yet. When the user starts the build, create it in the root without replacing or modifying the reference folders.

## Required reading

1. `README.md` for repository context.
2. `AGENT.md` for engineering rules.
3. `DESIGN.md` for the complete Neo-Brutalist design system.
4. `commit.md` before committing.

## Reference policy

- Do not copy HTML, CSS or JavaScript files from `ref-basic/` into the Next.js app.
- Do not import or link to `ref-basic/` or `ref-image/` at runtime.
- Use the reference to verify layout, copy, data, interaction and visual detail only.
- Do not edit, move or delete either reference folder.
- Exclude `ref-basic/` and `ref-image/` from lint, type checking and build inputs.

## Build workflow

Work in small vertical slices, in this order.

1. Inspect `ref-basic/` pages and `ref-basic/app.js` to understand structure, content, state and flow.
2. Create the Next.js App Router project with TypeScript.
3. Add global tokens, reset, typography and shared layout styles from `DESIGN.md`.
4. Port the data and itinerary engine into typed modules under `lib/`.
5. Build the shared shell: header, mobile navigation, footer, buttons, panels, cards, badges and toast.
6. Build `/` and verify it against `ref-basic/index.html`.
7. Build `/planner` and `/pass`, including live summary, generation, storage and share feedback.
8. Build `/route`, including the landscape SVG map, route line, markers, stop detail, locate action and ordered stop list.
9. Build `/explore` and `/food`, including filters, counts, badges and page calls to action.
10. Run the full quality gate.
11. Commit logical parts separately with `bash commit.js`.

## Implementation expectations

- Use React Server Components by default. Add `"use client"` only to interactive leaves or route pages that require state, effects or browser APIs.
- Keep data and engine code free of browser APIs. Guard storage access with `typeof window` checks or client-only modules.
- Use CSS Modules for component styles and a single global stylesheet for tokens, reset and base elements.
- Keep the same routes, copy, estimates and interactions as the reference.
- Preserve storage keys `pandalpass.prefs` and `pandalpass.pass`.
- Use semantic HTML, labelled controls and keyboard support.
- Keep the design square, bordered, high-contrast and hard-shadowed. No soft shadows, rounded cards or glass effects.
- Keep all pages responsive and free of horizontal overflow.
- Do not add Bengali text, the old intro block, the old credit line or a phone mockup.

## Verification

Run the commands that exist in `package.json`, expected to include:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Then check in a browser:

- All six routes load without console errors.
- Home stat counts, picks and food teasers render.
- Planner requires a vibe before continuing.
- Planner summary updates on every choice.
- Generate creates a pass and lands on `/pass`.
- Pass metrics, timeline, food stop and summary render.
- Route map has the correct marker count, route line, stop detail and locate toast.
- Explore filters update the count and cards.
- Food page renders all eight cards.
- Header navigation and mobile menu work.
- No horizontal overflow at 390px, 768px, 1024px and 1440px.

## Commit workflow

- Run `bash commit.js` from the repository root.
- The script stages known groups and creates one commit per group.
- Do not stage everything into one commit.
- Do not push, amend or force-push unless the user asks.
- Commit subjects and descriptions must be plain and imperative.
- No emojis, AI or bot attribution, generated-by lines, tool names or watermarks.

## Definition of done

- The Next.js app matches the reference in content, layout and behaviour.
- The implementation is native to Next.js and React, with no reference files in the runtime.
- The Neo-Brutalist design system is applied consistently.
- Lint, type check and production build pass.
- Desktop and mobile browser checks pass.
- Reference folders are untouched.
- Work is split into clear commits with plain messages.
