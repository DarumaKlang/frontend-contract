// lib/config.ts – central config for backend connectivity
export function getBackendBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.BACKEND_MANAGER_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).replace(/\/+$/, "");
}

export function getDefaultApiKey() {
  return process.env.NEXT_PUBLIC_DEFAULT_API_KEY || process.env.DEFAULT_API_KEY || "";
}

export const API_URL = getBackendBaseUrl();
export const DEFAULT_API_KEY = getDefaultApiKey();
