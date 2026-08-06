# Contributing to NodeTopicss

Thanks for your interest in contributing! 🎉

## Quick start

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Install dependencies: `npm install`
3. Make your changes. Keep the philosophy: **minimal, stateless, scalable**.
4. Run checks before committing:
   ```bash
   npm run lint && npm test
   ```
5. Open a Pull Request with a clear description.

## Guidelines

- **No heavy dependencies.** Every new package must justify its existence.
- **Stateless by default.** Nothing that breaks horizontal scaling.
- **Thin controllers, fat services.** Business logic belongs in `src/api/services/`.
- Follow the existing code style (Prettier + ESLint are configured).

## Reporting bugs

Open an issue with steps to reproduce, expected vs actual behavior, and your Node.js version.
