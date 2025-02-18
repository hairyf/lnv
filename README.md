# @hairy/lnv

loading custom env in next.js is very cumbersome, so

## Install

```sh
# with pnpm
pnpm add @hairy/lnv

# with yarn
yarn add @hairy/lnv
```

## modify

Modify the script in `package.json`:

```json
{
  "scripts": {
    "dev:staging": "lnv staging && next dev"
  }
}
```

Or run the script command:

```sh
pnpm lnv staging
```

> it just load .env.{mode} to .env

## dotenv

If you want to load the environment from the [dotenv](https://www.dotenvx.com/) service, you can use `lnv dotenv`. The `dotenv` identifier is specially marked and will read the `DOTENV_KEY` field from `.env` or `.env.key` to load the remote environment.

```sh
# Connect to this project env vault
npx dotenv-vault@latest new vlt_...

# or creating your project's env
npx dotenv-vault@latest new

# encrypt your .env.vault file and get you env key
npx dotenv-vault@latest build
npx dotenv-vault@latest keys

# write and save .env.key
echo "DOTENV_KEY=dotenv://:key_1234…vault?environment=production" > .env.key

# load dotenv-vault remote environment
npx lnv dotenv
```

## monorepo

If you want to apply the .env file to all projects in a monorepo, try using `-r` or `--recursive`. This will distribute the configuration from the current running directory to each sub project.

```sh
# or
npx lnv staging -r
```

After success, the following information will be output:

```sh
Successfully loaded .env.staging to packages by
 - packages/project-1/.env
 - packages/project-2/.env
```