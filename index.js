#!/usr/bin/env node

const mode = process.argv.slice(2, 3)[0]

if (mode)
  require('fs').copyFileSync(`.env.${mode}`, '.env')