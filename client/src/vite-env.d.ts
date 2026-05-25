/// <reference types="vite/client" />

// Compile-Time-Konstante aus vite.config.ts (`define`). ISO-8601 UTC-Zeitstempel
// des letzten Builds — wird bei jedem Coolify-Deploy neu gesetzt.
declare const __BUILD_DATE__: string;
