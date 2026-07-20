// lib/errorLogStore.ts
// In-memory error log store for aggregation and retrieval

import type { StructuredErrorLog } from '@/lib/services/templateService';

/**
 * Global in-memory store for error logs
 * Stores logs with a maximum capacity to prevent memory bloat
 */
class ErrorLogStore {
  private logs: StructuredErrorLog[] = [];
  private readonly maxLogs = 10000; // Maximum logs to keep in memory

  /**
   * Add a log entry to the store
   */
  addLog(log: StructuredErrorLog): void {
    this.logs.push(log);
    
    // Remove oldest logs if exceeding max capacity
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Get logs with optional filtering and pagination
   */
  getLogs(options?: {
    category?: StructuredErrorLog['category'][];
    level?: StructuredErrorLog['level'][];
    limit?: number;
    offset?: number;
    startTime?: string; // ISO 8601 timestamp
    endTime?: string; // ISO 8601 timestamp
  }): {
    logs: StructuredErrorLog[];
    total: number;
    limit: number;
    offset: number;
  } {
    const {
      category,
      level,
      limit = 100,
      offset = 0,
      startTime,
      endTime,
    } = options || {};

    // Clamp limit to reasonable values
    const clampedLimit = Math.min(Math.max(1, limit), 1000);
    const clampedOffset = Math.max(0, offset);

    let filtered = [...this.logs];

    // Filter by category
    if (category && category.length > 0) {
      filtered = filtered.filter((log) => category.includes(log.category));
    }

    // Filter by level
    if (level && level.length > 0) {
      filtered = filtered.filter((log) => level.includes(log.level));
    }

    // Filter by time range
    if (startTime) {
      const startDate = new Date(startTime).getTime();
      filtered = filtered.filter(
        (log) => new Date(log.timestamp).getTime() >= startDate
      );
    }

    if (endTime) {
      const endDate = new Date(endTime).getTime();
      filtered = filtered.filter(
        (log) => new Date(log.timestamp).getTime() <= endDate
      );
    }

    // Reverse to show newest first
    filtered.reverse();

    const total = filtered.length;

    // Apply pagination
    const paginatedLogs = filtered.slice(clampedOffset, clampedOffset + clampedLimit);

    return {
      logs: paginatedLogs,
      total,
      limit: clampedLimit,
      offset: clampedOffset,
    };
  }

  /**
   * Clear all logs
   */
  clear(): void {
    this.logs = [];
  }

  /**
   * Get statistics about stored logs
   */
  getStats(): {
    totalLogs: number;
    maxCapacity: number;
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
  } {
    const stats = {
      totalLogs: this.logs.length,
      maxCapacity: this.maxLogs,
      byCategory: {} as Record<string, number>,
      byLevel: {} as Record<string, number>,
    };

    // Count by category
    for (const log of this.logs) {
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
    }

    return stats;
  }
}

// Export singleton instance
export const errorLogStore = new ErrorLogStore();

/**
 * Convenience function to add a log to the global store
 * (typically called from logging functions in templateService and other services)
 */
export function addErrorLog(log: StructuredErrorLog): void {
  errorLogStore.addLog(log);
}
