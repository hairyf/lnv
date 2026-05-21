declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HELLO?: string
      TEST_ENV_VAR?: string
    }
  }
}

export {}
