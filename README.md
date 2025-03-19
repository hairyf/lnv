# @hairy/lnv 🚀

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Loading environment variables in Next.js and other frameworks can be quite cumbersome, and using dotenv or vault at runtime is also inconvenient. That's why we created this tool! ✨

I think it can solve some of the problems you encounter in next.js or dotenv or more. 🛠️

## ✅ Features

- 🔄 Multi-mode support, allowing you to load `.env|.env.prod|.env.local` simultaneously
- 🔐 Support for [vault.dotenv](https://vault.dotenv.org/ui/ui1/project/b0Cgew/env-vault) remote environment variable loading and multi-environment switching
- 🛡️ Direct writing to process.env, no local storage, more secure and reliable
- 📁 Environment variables lookup, naturally supports monorepo architecture
- 🏃‍♂️ Run any JS and scripts with environment variables

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

## 🔍 Default Environment Variables

You can include default environment variables using the `--default|-d` parameter:

```sh
# Will include .env.local and .env environment variables
lnv -d -- node index.js
# Equivalent to
lnv local env -- node index.js
```

## 🔒 Vault Environment Variables

Before loading variables from vault, you need to connect to the vault environment variable repository in your project:

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
lnv --vlt -- node index.js
# Load ci environment variables based on .env.vault and .env.keys
lnv --vlt ci -- node index.js
```

## 🚢 Vercel with Vault

If you need to deploy on Vercel, you need to add environment variables in your Vercel project:

```sh
npx vercel@latest env add DOTENV_KEY
```

lnv vault will automatically load environment variables based on .env.vault. 🎉

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
