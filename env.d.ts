/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_PORT: string
    // more env variables...
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }