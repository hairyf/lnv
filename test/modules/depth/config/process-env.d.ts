declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TEST_ENV_VAR?: string
    }
  }
}

export {}
