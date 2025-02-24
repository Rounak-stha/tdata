## Shared Packages

As the name suggests, the package contains shared configs, styles, and other files that are used across multiple packages.

## DB

We use drizzle for our database. The schema and confis are under `src/db`. To generate migrations, run `yarn drizzle:generate` from the root. This will generate a migration file in `src/db/drizzle`.

In the drizzle config file, the path to schema and out dir are set to be relative to the root. This is because the CWD will be the package root (`packages/shared`) as the process are run relative to the package.json file where we add the scripts.
