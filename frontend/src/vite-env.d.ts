/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_AUTH_EMULATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

