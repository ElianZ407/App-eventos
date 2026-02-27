/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // añadir más variables de entorno si es necesario
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
