## Frontend conventions (`vgm-fe`)

### Separation of concerns
- Put business logic and side effects in `src/services/**`, `src/hooks/**`, `src/lib/**`, `src/lib/api/**`.
- Keep `src/app/**` thin (routing + minimal params wiring only).
- Keep `src/components/ui/**` presentational (props only).
- Allow `src/components/features/**` to call hooks, but keep state management/side effects inside `src/hooks/**` and `src/services/**`.
- If a page needs hook wiring, create a single-purpose container in `src/components/features/**/containers/**` and import it from the page.

### One file, one responsibility
- Prefer adding small modules (helpers in `src/lib/**`, API clients in `src/services/**`) over embedding logic in UI files.
- Avoid “god” modules; keep functions/types close to where they’re used.

### When making changes
- Do not introduce new logic into `src/app/**` as part of unrelated fixes.
- Do not add hook/service calls to `src/components/ui/**`.
- If an existing file violates these rules, isolate the change to the minimum required and optionally propose a follow-up refactor.
