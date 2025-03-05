## Automation UI

This package (`@automation-ui`) contains the UI components for the Automation UI.
While it's not actually a separate package right now, the plan is to eventually split it out into its own package.

The problem right now is that the Automation UI is a monorepo, and right now the UI is in the same `@tdata/web` package. This is not ideal, and we'd like to eventually split it out into its own package. Shadcn support for monorepo is still experimental, so we're not doing that right now.

The plan:

- [ ] Split out the UI into its own package
- [ ] Split automation-ui into its own package
