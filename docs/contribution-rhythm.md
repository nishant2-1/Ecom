# Contribution Rhythm

Use this lightweight routine to keep contribution history active while shipping useful changes.

## Daily 10-20 Minute Loop

1. Pull latest main.
2. Pick one small improvement:
   - bug fix
   - UI polish
   - docs improvement
   - test addition
   - refactor with no behavior change
3. Run quality checks:

```bash
npm run ci:check
```

4. Commit with a clear message:

```bash
git add -A
git commit -m "chore: short meaningful summary"
git push origin main
```

## Contribution Ideas That Count

- Improve product descriptions, metadata, and accessibility labels
- Add loading states and error boundaries
- Add validation and edge-case handling in API routes
- Add unit/integration tests for checkout, auth, and cart flows
- Improve README and setup docs for contributors
- Small visual improvements and responsive fixes

## Weekly Cadence

- 3-5 meaningful commits per week
- 1 merged PR per week (if using branch workflow)
- Keep CI green on every push

## Simple Weekly Commit Menu

- Monday: one UI polish ticket
- Tuesday: one docs clarity update
- Wednesday: one API validation or error handling improvement
- Thursday: one performance or accessibility tweak
- Friday: one test or refactor cleanup

## Important GitHub Graph Rules

- The commit email must match your GitHub account email.
- Contributions on default branch (`main`) count directly.
- Private repo commits count only if private contributions are enabled in profile settings.

## Quick Verification

```bash
git config user.name
git config user.email
```

If the email does not match GitHub, update it:

```bash
git config --global user.email "your-github-email@example.com"
```
