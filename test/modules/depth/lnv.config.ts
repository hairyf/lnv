import { defineConfig } from '@hairy/lnv'

export default defineConfig({
  injects: {
    before: {
      TEST_ENV_VAR: 'test_value',
    },
  },
})
