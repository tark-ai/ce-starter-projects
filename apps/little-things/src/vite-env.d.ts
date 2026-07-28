/// <reference types="vite/client" />

declare module "@fontsource-variable/inter";

interface ImportMetaEnv {
  readonly VITE_STORE_ID: string;
  readonly VITE_API_KEY: string;
  readonly VITE_CE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
