# @hairy/lnv

loading custom env in next.js is very cumbersome, so

## Installation

```sh
# with pnpm
pnpm add @hairy/lnv

# with yarn
yarn add @hairy/lnv
```

## Modify scripts

```json
{
  "scripts": {
    "dev:staging": "lnv staging && next dev"
  }
}
```

> it just copies the copy .env.{mode} to .env

## dotenv

If you want to load the environment from the dotenv service, you can use `lnv dotenv`. The `dotenv` identifier is specially marked and will read the `DOTENV_KEY` field from `.env` or `.env.key` to load the remote configuration.

## Monorepo

If you want to apply the .env file to all projects in a monorepo, try using `-r` or `--recursive`. This will distribute the configuration from the current running directory to each sub project.