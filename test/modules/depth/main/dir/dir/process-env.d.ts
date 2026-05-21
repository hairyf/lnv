declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_ENV_VAR?: string
      TEST_VAR?: string
    }
  }
}

export {}
