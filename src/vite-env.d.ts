/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_URL_SIGNUP: string;
  readonly VITE_API_URL_SIGNIN: string;

}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
