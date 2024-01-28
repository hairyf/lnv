const [mode] = process.argv.slice(2, 3)

if (mode)
  require('fs').copyFileSync(`.env.${mode}`, '.env')