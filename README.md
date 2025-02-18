# @hairy/lnv

Loading custom env in next.js is very cumbersome, and dotenv runtime is not very user-friendly, so

I think it can solve some of the problems you encounter in next.js or dotenv, maybe.

- More comprehensive support for running any script or `.js` file with environment variables.
- Directly write to `process.env`, without saving locally, making it more discreet and secure.
- Supports Monorepo, automatically reading configuration from the root directory in a Monorepo.
- Based on dotenv, and supports managing configurations using [vault.dotenv](https://vault.dotenv.org/ui/ui1/project/b0Cgew/env-vault).

## Install

```sh
# with pnpm
pnpm add @hairy/lnv

# with yarn
yarn add @hairy/lnv
```

## Usage

Modify the script in `package.json`:

```json
{
  "scripts": {
    "dev:staging": "lnv staging -r next dev"
  }
}
```

Or run the script command:

```sh
pnpm lnv staging -r next dev
```

Or run any .js file:

```sh
pnpm lnv staging -r node xxx.js
```

> it load .env.{mode} to runtime environment

## Dotenv

If you want to load the environment from the [dotenv](https://www.dotenvx.com/) service, you can use `lnv dotenv`. The `dotenv` identifier is specially marked and will read the `DOTENV_KEY` field from `.env` or `.env.key` to load the remote environment.

```sh
# write and save .env.key
echo "DOTENV_KEY=dotenv://:key_1234…vault?environment=production" > .env.key

# load dotenv-vault remote environment
npx lnv dotenv --run <command>
```

If you need to deploy on `vercel`, you must set the corresponding environment `key` using `npx vercel@latest env add DOTENV_KEY`.

## Monorepo

If you want to apply the .env file to all projects in a monorepo, try using `lnv <mode> --monorepo --expose`. This will distribute the configuration from the current running directory to each sub project.

> Warn: it is not recommended to use monorepo exports, as this increases the risk of variable exposure. You can load environment variables in subprojects by using `lnv <mode> -r <command>`, which will by default look for the config in the root directory.

## Options

```sh
lnv <mode> [args]

args:
  -r, --run       load runtime environment and run any scripts            [array]
  -m, --monorepo  apply to packages in the monorepo                       [boolean]
  -e, --expose    expose environment variables                            [boolean]
  -h, --help      show help info                                          [boolean]
  -v, --version   show version                                            [boolean]
```
