# Migration checklist (React JSX + Vite, UI unchanged)

> This checklist is step-by-step and should be executed in order. Do **not** change UI behavior or markup—only wiring/build setup.

## Step 1 — Confirm current entry + routing bootstrapping
1. Identify what file `frontend/index.html` loads (script src).
2. Identify what file actually renders the app (ReactDOM render/createRoot).
3. Identify where TanStack Router is initialized (where `RouterProvider`/router creation happens, or equivalent TanStack Start bootstrap).
4. Record the current navigation behavior (what routes exist: `/`, `/app`, etc.).

## Step 2 — Fix missing compile-time files (no UI changes)
1. Locate all import targets that are currently missing in the repo (example: `src/styles.css`, `src/lib/lovable-error-reporting.ts`, etc.).
2. Create minimal placeholder equivalents **only if** they are required for compilation (match expected exports if TypeScript types are used).
3. Ensure the app builds.

## Step 3 — Make `@/` imports work reliably
1. Inspect `tsconfig.json` (if present) for `paths` mapping.
2. Inspect `vite.config.js` for `resolve.alias`.
3. Ensure Vite can resolve `@/components/*`, `@/data/*`, etc.
4. Ensure TypeScript also agrees (so editor + build match).

## Step 4 — Add missing dependencies required by current code
1. Compare `frontend/package.json` dependencies vs what imports require:
   - `@tanstack/react-router`
   - `@tanstack/react-query`
   - `recharts`
   - any other runtime packages referenced by the code
2. Install missing dependencies.
3. Ensure lockfile consistency.

## Step 5 — Replace TanStack Router usage with React Router (UI unchanged)
1. Introduce React Router dependencies (already present `react-router-dom`, but ensure versions).
2. Replace routing layer only:
   - Convert route definitions (e.g., `createFileRoute`, `Outlet`) into React Router routes.
   - Preserve component tree shape and props expected by layout components (Sidebar/TopNav/Outlet patterns).
3. Ensure paths like `/app/jobs`, `/app/analytics`, etc. resolve identically.

## Step 6 — Convert TanStack “head/meta/shell” behavior to Vite/React equivalents
1. Identify what `head` logic is doing in TanStack routes.
2. Replace with either:
   - React Helmet / `document.title` updates
   - or Vite static metadata + runtime title updates
3. Do not change UI layout.

## Step 7 — Convert TS entry to JSX if needed (UI unchanged)
1. Decide the target: “React JSX + Vite”.
2. Convert `.tsx` to `.jsx` only where safe.
3. Keep UI output identical.

## Step 8 — Verify Tailwind/build pipeline
1. Confirm Tailwind config exists and is used by Vite.
2. If Tailwind files are missing, add the minimal required config.
3. Ensure generated styles match current look.

## Step 9 — End-to-end verification
1. Run `frontend` dev server.
2. Manually verify all routes load:
   - `/`
   - `/app/*` (all listed pages)
3. Verify sidebar active highlighting still works.
4. Verify charts render.
5. Verify theme toggle still persists.

---

### Progress tracking
- [ ] Step 1 — Confirm current entry + routing bootstrapping
- [ ] Step 2 — Fix missing compile-time files (no UI changes)
- [ ] Step 3 — Make `@/` imports work reliably
- [ ] Step 4 — Add missing dependencies required by current code
- [ ] Step 5 — Replace TanStack Router usage with React Router (UI unchanged)
- [ ] Step 6 — Replace TanStack “head/meta/shell” behavior
- [ ] Step 7 — Convert TS entry to JSX if needed
- [ ] Step 8 — Verify Tailwind/build pipeline
- [ ] Step 9 — End-to-end verification

