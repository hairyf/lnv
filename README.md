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
