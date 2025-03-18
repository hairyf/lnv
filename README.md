# @hairy/lnv

Loading custom env in next.js is very cumbersome, and dotenv runtime is not very user-friendly, so

I think it can solve some of the problems you encounter in next.js or dotenv or more.

- Multi-mode loading allow you to load `.env`, `.env.prod`, `.env.local` or more, and so on simultaneously in order.
- Support Monorepo, if the current directory is not found, perform a deep search upwards
- More comprehensive support for running any script or `.js` file with environment variables.
- Directly write to `process.env`, without saving locally, making it more discreet and secure.
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
    "dev:staging": "lnv staging -- next dev"
  }
}
```

Or run the script command:

```sh
# -r | --run | --
pnpm lnv staging --run next dev
# run .js file
pnpm lnv staging -- node xxx.js
# with args
pnpm lnv prod -r next dev --arg1 xxx
```

> it load .env.{mode} to runtime environment

## Default

The `lnv` command does not load the `.env` and `.env.local` files by default. You can enable this default loading by using `--default | -d`. This command is equivalent to `lnv env local`.

```sh
# loading .env.prod|.env.local|.env to runtime environment
lnv prod -d -r node index.js
# same as the following script
lnv local prod env -r node index.js
```

## Vault

If you want to load the environment from the [dotenv](https://www.dotenvx.com/) service, you can use `lnv vault`. The `vault` identifier is specially marked and will read the `DOTENV_KEY` field from `.env.key` to load the remote environment.

```sh
# write and save .env.key
echo "DOTENV_KEY=dotenv://:key_1234…vault?environment=production" > .env.key

# load dotenv-vault remote environment
npx lnv vault -- <command with arguments>
```

If you need to deploy on `vercel`, you must set the corresponding environment `key` using `npx vercel@latest env add DOTENV_KEY`.

## Monorepo

If you want to apply the .env file to all projects in a monorepo, try using `lnv <mode> --monorepo --expose`. This will distribute the configuration from the current running directory to each sub project.

> Warn: it is not recommended to use monorepo exports, as this increases the risk of variable exposure. You can load environment variables in subprojects by using `lnv <mode> -r <command>`, which will by default look for the config in the root directory.

## Options

```sh
lnv <mode> [args]

args:
  -r, --, --run      load runtime environment and run any scripts            [array]
  -m, --monorepo     apply to packages in the monorepo                       [boolean]
  -e, --expose       expose environment variables                            [boolean]
  -d, --default      the default environment (env|...|env.local) be loaded   [boolean]
  -h, --help         show help info                                          [boolean]
  -v, --version      show version                                            [boolean]
```
