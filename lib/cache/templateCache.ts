// lib/cache/templateCache.ts
// In-memory cache for contract templates with TTL-based expiration

import type { ContractTemplate, ContractType, TemplateLanguage } from '@/lib/types/template';

/**
 * Individual cache entry with timestamp metadata
 */
interface CacheEntry {
  template: ContractTemplate;
  cachedAt: number; // Unix timestamp in milliseconds
  expiresAt: number; // Unix timestamp in milliseconds
}

/**
 * Cache statistics interface
 */
export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  entries: Array<{
    key: string;
    cachedAt: Date;
    expiresAt: Date;
    isExpired: boolean;
  }>;
}

/**
 * TemplateCache manages in-memory storage of contract templates
 * with TTL-based expiration (10 minutes).
 * 
 * Thread-safe for read operations; assumes single-threaded execution for mutations
 * (typical Node.js environment).
 * 
 * **Validates: Requirements 3.1, 3.2, 3.6**
 */
export class TemplateCache {
  private static readonly TTL_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
  private cache: Map<string, CacheEntry>;
  private stats: {
    hits: number;
    misses: number;
  };

  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
    };
  }

  /**
   * Generate cache key from contract type and language.
   * Cache key format: `contractType:language`
   * 
   * @param contractType - The contract type (e.g., 'lease', 'vehicle-sale')
   * @param language - The template language ('th' or 'en')
   * @returns Formatted cache key
   */
  private getCacheKey(contractType: ContractType, language: TemplateLanguage): string {
    return `${contractType}:${language}`;
  }

  /**
   * Check if a cache entry exists and is not expired.
   * 
   * @param contractType - The contract type
   * @param language - The template language
   * @returns The cached template if found and not expired, null otherwise
   */
  get(contractType: ContractType, language: TemplateLanguage): ContractTemplate | null {
    const key = this.getCacheKey(contractType, language);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if entry is expired
    const now = Date.now();
    if (now > entry.expiresAt) {
      // Entry is expired, remove it
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Cache hit
    this.stats.hits++;
    return entry.template;
  }

  /**
   * Store a template in the cache with TTL-based expiration.
   * 
   * @param contractType - The contract type
   * @param language - The template language
   * @param template - The template object to cache
   */
  set(
    contractType: ContractType,
    language: TemplateLanguage,
    template: ContractTemplate
  ): void {
    const key = this.getCacheKey(contractType, language);
    const now = Date.now();

    const entry: CacheEntry = {
      template,
      cachedAt: now,
      expiresAt: now + TemplateCache.TTL_MS,
    };

    this.cache.set(key, entry);
  }

  /**
   * Invalidate a specific cache entry.
   * Used when a template is published or updated.
   * 
   * @param contractType - The contract type
   * @param language - The template language
   */
  invalidate(contractType: ContractType, language: TemplateLanguage): void {
    const key = this.getCacheKey(contractType, language);
    this.cache.delete(key);
  }

  /**
   * Clear all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Get cache statistics for monitoring and observability.
   * 
   * @returns Cache statistics including size, hit rate, and entry metadata
   */
  getStats(): CacheStats {
    const now = Date.now();
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;

    // Build entries array with expiration status
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      cachedAt: new Date(entry.cachedAt),
      expiresAt: new Date(entry.expiresAt),
      isExpired: now > entry.expiresAt,
    }));

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      entries,
    };
  }

  /**
   * Reset statistics without clearing the cache.
   * Useful for testing or metric reset operations.
   */
  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Get the static TTL duration in milliseconds.
   * Exposed for testing purposes.
   * 
   * @returns TTL duration in milliseconds (600,000 ms = 10 minutes)
   */
  static getTTL(): number {
    return this.TTL_MS;
  }
}

// Singleton instance for application-wide use
let cacheInstance: TemplateCache | null = null;

/**
 * Get or initialize the singleton cache instance.
 * 
 * @returns The template cache singleton
 */
export function getTemplateCache(): TemplateCache {
  if (!cacheInstance) {
    cacheInstance = new TemplateCache();
  }
  return cacheInstance;
}

/**
 * Reset the singleton instance (for testing).
 */
export function resetCacheInstance(): void {
  cacheInstance = null;
}
