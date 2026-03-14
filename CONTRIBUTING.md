# Contributing

## Branching

- Create short-lived feature or chore branches from `main`
- Use descriptive names such as `feature/checkout-polish` or `chore/dev-hardening`
- Merge back through clean commits or explicit merge commits when branch history matters

## Commit Style

Use focused commits with conventional prefixes when possible:

- `feat:` new functionality
- `fix:` bug fixes
- `chore:` tooling or maintenance
- `docs:` documentation changes
- `refactor:` internal cleanup without behavior change

Examples:

```text
feat(email): add runtime observability panel
chore(dev): add CI pipeline and hooks
docs(readme): add local setup guide
```

## Local Checks

Before pushing:

```bash
npm install
npm run prisma:generate
npm run typecheck
npm run check
```

If schema changes are involved:

```bash
npx prisma db push
npm run prisma:seed
```

## Environment

Keep secrets out of git.

Use `.env.local` for local configuration. Do not commit:

- API keys
- auth secrets
- local database files
- private service tokens

## Pull Requests

A good PR should include:

- concise description of the problem
- summary of the implementation
- screenshots for UI changes
- notes about env vars, migrations, or webhook setup
- confirmation that `npm run typecheck` passes
