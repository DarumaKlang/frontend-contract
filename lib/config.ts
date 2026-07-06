// lib/config.ts – central config for backend connectivity

/**
 * Retrieves the first defined environment variable from the provided list.
 * Throws an error if none are defined, ensuring required configuration is present.
 * @param vars List of environment variable names to check in order.
 * @returns The first non-empty environment variable value.
 */
function getFirstEnvVar(...vars: string[]): string {
  for (const v of vars) {
    const val = process.env[v];
    if (val && val.trim() !== "") {
      return val.trim();
    }
  }
  // If we reach here, no env var was provided.
  throw new Error(`Missing required environment variable. Expected one of: ${vars.join(", ")}`);
}

/**
 * Returns the base URL for the backend API.
 * Uses the first defined environment variable among the supported options.
 * The returned URL is stripped of any trailing slashes.
 */
export function getBackendBaseUrl(): string {
  const rawUrl = getFirstEnvVar(
    "NEXT_PUBLIC_API_BASE_URL",
    "BACKEND_MANAGER_URL",
    "NEXT_PUBLIC_BACKEND_URL",
    "NEXT_PUBLIC_API_URL"
  );
  return rawUrl.replace(/\/+$/, "");
}

/**
 * Retrieves the default API key from environment variables.
 * Throws if not provided.
 */
export function getDefaultApiKey(): string {
  return getFirstEnvVar("NEXT_PUBLIC_DEFAULT_API_KEY", "DEFAULT_API_KEY");
}

export const API_URL = getBackendBaseUrl();
export const DEFAULT_API_KEY = getDefaultApiKey();
