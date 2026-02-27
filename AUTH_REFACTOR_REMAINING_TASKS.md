# Auth Refactor Remaining Tasks

## High Priority
- [ ] Replace `catch (err: any)` with `unknown` + type-safe error handling in:
  - `src/hooks/auth/challenge/useChallengeLogic.ts`
  - `src/hooks/auth/login/useLogin.ts`
  - `src/hooks/auth/signup/useSignup.ts`
  - `src/hooks/auth/challenge/useChallengeResend.ts`
- [ ] Remove `window as any` usages by introducing a typed auth log utility and migrate:
  - `src/hooks/auth/login/useLogin.ts`
  - `src/hooks/auth/signup/useSignup.ts`
  - `src/hooks/auth/challenge/useChallengeResend.ts`

## Challenge Flow Simplification
- [ ] Reduce `if` chain in `src/hooks/auth/challenge/useChallengeLogic.ts` by centralizing result handling from `submitChallenge`.
- [ ] Validate challenge transition behavior (`email`, `totp`, `password`, `email_mfa`, action verification) after refactor.
- [ ] Review `src/service/auth/challenge/submit-challenge.ts` return union and split if needed for stricter single-responsibility.

## Type and DTO Consistency
- [ ] Scan auth modules for remaining `any` and replace with DTO/domain types.
- [ ] Ensure all challenge-related callback signatures are typed consistently across components/hooks.
- [ ] Recheck DTO/domain boundaries (UI/hooks should not directly depend on raw/provider shapes).

## Optional Cleanup
- [ ] Normalize Japanese text corruption in auth-related files where mojibake still exists.
- [ ] Add minimal tests for challenge submit branching and recovery flow critical paths.

## Verification Checklist (per task batch)
- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] Manual smoke check: login/signup/challenge/recovery key paths
