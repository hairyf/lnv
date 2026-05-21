declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_ENV_VAR?: string
      TEST_VAR_1?: string
      TEST_VAR_2?: string
    }
  }
}

export {}
