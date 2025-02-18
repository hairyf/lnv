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
    "dev:staging": "lnv staging -r next dev"
  }
}
```

Or run the script command:

```sh
pnpm lnv staging -r next dev
```

> it load .env.{mode} to runtime environment

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
npx lnv dotenv --run <command>
```

## monorepo

If you want to apply the .env file to all projects in a monorepo, try using `lnv <mode> --monorepo --expose`. This will distribute the configuration from the current running directory to each sub project.

> Warn: it is not recommended to use monorepo exports, as this increases the risk of variable exposure. You can load environment variables in subprojects by using `lnv <mode> -r <command>`, which will by default look for the config in the root directory.

## options

```sh
lnv <mode> [args]

args:
  -r, --run       load runtime environment and run any scripts            [array]
  -m, --monorepo  apply to packages in the monorepo                       [boolean]
  -e, --expose    expose environment variables                            [boolean]
  -h, --help      show help info                                          [boolean]
  -v, --version   show version                                            [boolean]
```