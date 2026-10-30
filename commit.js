#!/usr/bin/env bash
# Separate-commit helper for PandalPass.
# This file is intentionally named commit.js but must be run with bash:
#   bash commit.js
#   bash commit.js --dry-run
# It is not a Node.js script.

set -euo pipefail

usage() {
  echo "Usage: bash commit.js [--dry-run]"
  echo
  echo "Stages known project groups and creates one commit per group."
  echo "Empty groups are skipped. Nothing is pushed or amended."
}

dry_run=0

case "${1:-}" in
  "")
    ;;
  --dry-run)
    dry_run=1
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    echo "Unknown option: $1"
    usage
    exit 1
    ;;
esac

root="$(git rev-parse --show-toplevel 2>/dev/null || true)"

if [ -z "$root" ]; then
  echo "Not inside a git repository."
  exit 1
fi

cd "$root"

if ! git diff --cached --quiet; then
  echo "There are already staged changes. Commit or unstage them before running this script."
  exit 1
fi

if [ -n "$(git status --porcelain -- ref-basic ref-image)" ]; then
  echo "Warning: ref-basic or ref-image has changes. Reference folders are excluded from commits."
  echo
fi

commit_group() {
  local message="$1"
  shift

  local paths=()
  local path

  for path in "$@"; do
    if [ -e "$path" ] || git ls-files --error-unmatch "$path" >/dev/null 2>&1; then
      paths+=("$path")
    fi
  done

  if [ "${#paths[@]}" -eq 0 ]; then
    return 0
  fi

  if [ -z "$(git status --porcelain -- "${paths[@]}")" ]; then
    return 0
  fi

  echo "Part: $message"

  if [ "$dry_run" -eq 1 ]; then
    git status --short -- "${paths[@]}"
    echo
    return 0
  fi

  git add -A -- "${paths[@]}"

  if git diff --cached --quiet; then
    echo "No staged changes for this part."
    echo
    return 0
  fi

  git commit -m "$message"
  echo "Committed: $message"
  echo
}

# Documentation
commit_group "docs: document the project and Next.js migration plan" \
  AGENT.md DESIGN.md README.md

commit_group "docs: add agent build skill" \
  SKILL.md

commit_group "chore: add separate commit helper" \
  commit.md commit.js

# Next.js setup
commit_group "chore: initialize Next.js project" \
  package.json package-lock.json pnpm-lock.yaml yarn.lock bun.lockb \
  next.config.js next.config.mjs next.config.ts \
  tsconfig.json jsconfig.json next-env.d.ts \
  eslint.config.js eslint.config.mjs eslint.config.ts \
  .eslintrc .eslintrc.json .eslintrc.js .eslintignore \
  postcss.config.js postcss.config.mjs postcss.config.ts \
  tailwind.config.js tailwind.config.ts \
  .gitignore .editorconfig

# Data and logic
commit_group "feat: add typed PandalPass data and itinerary engine" \
  lib src/lib data src/data

# Global design system
commit_group "style: add Neo-Brutalist design system" \
  app/globals.css src/app/globals.css styles

# Shared shell and UI
commit_group "feat: add shared layout and interface components" \
  app/layout.tsx src/app/layout.tsx \
  app/layout.module.css src/app/layout.module.css \
  components/layout components/ui components/shared \
  components/site-header.tsx components/site-header.module.css \
  components/site-footer.tsx components/site-footer.module.css \
  components/nav-toggle.tsx components/nav-toggle.module.css \
  components/toast.tsx components/toast.module.css

# Routes
commit_group "feat: build the home page" \
  app/page.tsx src/app/page.tsx \
  components/home

commit_group "feat: build the planner route" \
  app/planner src/app/planner \
  components/planner

commit_group "feat: build the pass route" \
  app/pass src/app/pass \
  components/pass

commit_group "feat: build the route map" \
  app/route src/app/route \
  components/route

commit_group "feat: build the explore route" \
  app/explore src/app/explore \
  components/explore

commit_group "feat: build the food route" \
  app/food src/app/food \
  components/food

# Tests and static assets
commit_group "test: add end-to-end coverage" \
  tests e2e playwright.config.js playwright.config.ts

commit_group "chore: add static assets" \
  public \
  app/favicon.ico app/icon.png app/apple-icon.png \
  src/app/favicon.ico src/app/icon.png src/app/apple-icon.png

echo "Commit groups complete."
echo

if [ -n "$(git status --porcelain)" ]; then
  echo "Remaining changes:"
  git status --short
else
  echo "Working tree clean."
fi
