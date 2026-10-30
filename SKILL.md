---
name: pandalpass-nextjs
description: Build or extend the PandalPass Next.js app from the completed ref-basic static reference. Use when implementing routes, components, styling, itinerary logic, browser checks, or the separate commit workflow.
---

# PandalPass Next.js build skill

## Purpose

Maintain and extend the production-quality Next.js app in the repository root. The static app in `ref-basic/` is the finished visual and behavioural reference. `ref-image/` holds the original design images. Both are read-only.

The root app already includes all six routes, JSON-backed data, the itinerary engine, local storage and API routes. Extend it without modifying the reference folders.

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
2. Confirm the data lives in root `data.json` and is read through `lib/data.ts`.
3. Update typed data and itinerary logic under `lib/` before wiring a new UI feature.
4. Update shared styles in `app/globals.css` and shared components in `components/`.
5. Build route-specific client or server components and pages, then verify against the matching reference page.
6. Check the affected flow only when the code and build cannot settle it.
7. Run `npm test` once.
8. Commit logical parts separately with `bash commit.js`.

## Implementation expectations

- Use React Server Components by default. Add `"use client"` only to interactive leaves or route pages that require state, effects or browser APIs.
- Keep data and engine code free of browser APIs. Guard storage access with `typeof window` checks or client-only modules.
- Use one global stylesheet for tokens, reset, layout, components and page styles. Do not add CSS Modules unless the user asks for that refactor.
- Use `components/Icon.tsx` and `lucide-react` for interface icons. Do not use emojis anywhere.
- Keep the same routes, copy, estimates and interactions as the reference.
- Preserve storage keys `pandalpass.prefs` and `pandalpass.pass`.
- Keep all dummy product data in root `data.json`.
- Use semantic HTML, labelled controls and keyboard support.
- Keep the design square, bordered, high-contrast and hard-shadowed. No soft shadows, rounded cards or glass effects.
- Keep all pages responsive and free of horizontal overflow.
- Do not add Bengali text, the old intro block, the old credit line or a phone mockup.

## Verification

Run one command:

```bash
npm test
```

It runs the type check and then the production build, in sequence, and stops on the first failure. That is the full gate.

Do not do intense testing. No repeated runs on unchanged files, no full browser sweeps of every route, no viewport matrices and no per-control interaction passes. Add a browser check only when a change cannot be judged from the code and the build, and then check only the affected route. Report checks that could not run as limitations, never as passes.

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
- `npm test` passes.
- No emojis appear in the interface, data, metadata or documentation.
- Reference folders are untouched.
- Work is split into clear commits with plain messages.
