import { defineConfig } from '@hairy/lnv'

export default defineConfig({
  dts: true,
  injects: {
    before: {
      TEST_ENV_VAR: 'test_value',
    },
  },
})
