# @hairy/lnv

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Loading environment variables in Next.js and other frameworks can be quite cumbersome, and using dotenv or vault at runtime is also inconvenient. That's why my created this tool

I think it can solve some of the problems you encounter in next.js or dotenv or more. 🛠️

## ✅ Features

- 🔄 Multi-mode support, allowing you to load `.env|.env.prod|.env.local` simultaneously
- 🔐 Support for [vault.dotenv](https://vault.dotenv.org/ui/ui1/project/b0Cgew/env-vault) remote environment variable loading and multi-environment switching
- 🛡️ Direct writing to process.env, no local storage, more secure and reliable
- 📁 Environment variables lookup, naturally supports monorepo architecture
- 🏃‍♂️ Run any JS and scripts with environment variables
- 📜 Define your integration config with `lnv.config.ts`

## 📦 Install

```bash
npm install @hairy/lnv
# or globally
npm install -g @hairy/lnv
```

## 🚀 Usage

Modify the scripts field in your `package.json`:

```json
{
  "scripts": {
    "dev": "lnv staging -- next dev"
  }
}
```

This will launch `next dev` with the `.env.staging` environment variables. ✨

You can also include any run parameters, for example:

```sh
lnv prod -- next dev --turbopack
```

## 🌿 Default Environment Variables

You don't need any action, the `.env.local` and `.env` environment variables will be automatically loaded by default.

## 🔒 Vault Environment Variables

<details>

<summary>Before loading variables from vault, you need to connect to the vault environment variable repository in your project</summary><br>

```sh
npx dotenv-vault@latest new
npx dotenv-vault@latest vlt_...
```

```sh
npx dotenv-vault@latest pull
npx dotenv-vault@latest build
```sh
# Create and connect to vault repository
npx dotenv-vault@latest new
# Connect to an existing vault repository
npx dotenv-vault@latest vlt_...

# And encrypt your environment variables:
npx dotenv-vault@latest pull
# or
npx dotenv-vault@latest build
```

Next, you need to create a `.env.key` or `.env.keys` file in your project root directory and write the [DOTENV_KEY](https://www.dotenv.org/docs/security/dotenv-key):

```sh
# .env.key
DOTENV_KEY = dotenv://...?environment=development

# or

# .env.keys
DOTENV_KEY_DEVELOPMENT = dotenv://...?environment=development
DOTENV_KEY_CI = dotenv://:...?environment=ci
DOTENV_KEY_STAGING = dotenv://:...?environment=staging
DOTENV_KEY_PRODUCTION = dotenv://:...?environment=production
```

Finally, you can use the `lnv` command to include vault environment variables:

```sh
# Load environment variables based on .env.vault and .env.key
lnv vault -- node index.js
# Load ci environment variables based on .env.vault and .env.keys
lnv vault:ci -- node index.js
```

<br></details>

## 🚢 Vercel with Vault

If you need to deploy on Vercel, you need to add environment variables in your Vercel project:

```sh
npx vercel@latest env add DOTENV_KEY
```

lnv vault will automatically load environment variables based on .env.vault. 🎉

## ✍️ Manual with environment variables

You can manual load environment variables with the `-v|--value` parameter:

```sh
lnv -v KEY1=value1 -v KEY2=value2 -- node index.js
```

By adding the $prefix, you can reference the value of an environment variable in the settings or command line:

```sh
lnv -v KEY1=value1 -v KEY2=value1 -v KEY3=$KEY1_$KEY2 -- node index.js
## or
lnv -v KEY1=value1 -- node -e 'console.log($KEY1)'
```

## 📝 Define Your integration Config

`lnv.config.ts ` is used to add actionable command-line scripts and default injected environment variables.

```ts
import fs from 'node:fs/promises'
import { defineConfig } from '@hairy/lnv'

const config = defineConfig({
  /**
   * Environment variable injection, applied to all LNV scripts
   */
  injects: {
    /**
     * Inject before reading environment variables
     */
    before: {
      DB_TYPE: 'mysql',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'root',
    },

    /**
     * Default loaded environment variable entries
     */
    entries: ['local', 'vault', 'remote'],

    /**
     * Inject after reading environment variables
     */
    after: {
      DATABASE_URL: '$DB_TYPE://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME',
    },
  },
  /**
   * LNV scripts configuration
   */
  scripts: {
    // npm run lnv deploy
    deploy: {
      message: 'Deploy the application',
      prompts: [
        {
          key: 'network',
          message: 'Select Your Network',
          options: [
            { value: 'moonchain', label: 'Moonchain' },
            { value: 'moonchainGeneva', label: 'Moonchain Geneva' },
          ],
        },
        {
          key: 'modulePath',
          message: 'Select the module you want to deploy',
          options: async () => {
            const files = await fs.readdir('./ignition/modules')
            return files.map(file => ({
              value: `./ignition/modules/${file}`,
              label: file.replace('.ts', ''),
            }))
          },
        },
      ],
      command: 'hardhat --build-profile production ignition deploy $modulePath --network $network',
    },
    // npm run lnv dev
    dev: {
      message: 'Run the development server',
      command: {
        message: 'Select the project you want to run',
        options: [
          {
            value: 'cd packages/project-1 && npm run dev',
            label: 'project-1',
          },
          {
            value: 'cd packages/project-2 && npm run dev',
            label: 'project-2',
          },
        ],
      },
    },
  },
})

export default config
```

## 🔍️ Options

```sh
lnv <entry|script> [args]

args:
      --version       show version                                               [boolean]
  -v, --value         set environment variables                                  [array]
  -e, --entry         Explicit loading of entry, same as lnv <entry>             [string]
  -r, --run           load runtime environment and run any scripts               [string]
      --write         expose and write environment variables                     [boolean]
  -d, --depth         depth find and merge environment variables                 [boolean]
  -h, --help          show help                                                  [boolean]
```

## 📄 License

[MIT](./LICENSE) License © [Hairyf](https://github.com/hairyf)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@hairy/lnv?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@hairy/lnv
[npm-downloads-src]: https://img.shields.io/npm/dm/@hairy/lnv?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@hairy/lnv
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@hairy/lnv?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@hairy/lnv
[license-src]: https://img.shields.io/github/license/hairyf/lnv.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/hairyf/lnv/blob/main/LICENSE.md
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@hairy/lnv
