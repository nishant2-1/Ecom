# Security Policy

## Supported Versions

This repository is actively maintained on the `main` branch.

| Version | Supported |
| --- | --- |
| main | Yes |
| older snapshots | No |

## Reporting a Vulnerability

Please do not open public GitHub issues for security vulnerabilities.

Report security concerns privately with:

- affected area or route
- reproduction steps
- impact summary
- screenshots or request samples if relevant
- any suggested remediation

Until a dedicated security contact is published, use GitHub private reporting if enabled for the repository, or coordinate directly with the repository owner.

## Response Expectations

A good-faith report should expect:

- acknowledgment after review
- triage based on severity and exploitability
- remediation planning before public disclosure
- a fix deployed to `main` when confirmed

## Scope

Security-sensitive areas in this project include:

- authentication and session handling
- admin authorization
- Stripe payment and webhook flows
- Redis-backed rate limiting and cart state
- Prisma data access
- email-based magic-link authentication
