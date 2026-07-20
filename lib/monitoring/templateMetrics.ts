// lib/monitoring/templateMetrics.ts
// Template performance monitoring and metrics collection

export interface TemplateMetrics {
  cacheHitRate: number; // 0-100 percentage
  cacheHits: number;
  cacheMisses: number;
  databaseQueries: number;
  fallbackUsage: number; // count
  fallbackUsageRate: number; // 0-100 percentage
  averageRenderTime: number; // milliseconds
  errorRate: number; // 0-100 percentage
  totalContractsGenerated: number;
  timestamp: string; // ISO 8601
}

export interface RenderMetrics {
  templateId?: string;
  source: 'database' | 'fallback';
  renderTimeMs: number;
  success: boolean;
  errorMessage?: string;
  cached: boolean;
  contractType: string;
  language: string;
  timestamp: string;
}

/**
 * In-memory metrics collector
 * Tracks template performance metrics
 */
class TemplateMetricsCollector {
  private cacheHits = 0;
  private cacheMisses = 0;
  private databaseQueries = 0;
  private fallbackUsage = 0;
  private renderTimes: number[] = [];
  private errors = 0;
  private totalGenerated = 0;
  private renderLog: RenderMetrics[] = [];
  private readonly maxLogSize = 10000; // Keep last 10k renders
  private startTime = Date.now();

  /**
   * Record cache hit
   */
  recordCacheHit(): void {
    this.cacheHits++;
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(): void {
    this.cacheMisses++;
  }

  /**
   * Record database query
   */
  recordDatabaseQuery(): void {
    this.databaseQueries++;
  }

  /**
   * Record fallback usage
   */
  recordFallbackUsage(): void {
    this.fallbackUsage++;
  }

  /**
   * Record render time
   */
  recordRenderTime(timeMs: number): void {
    this.renderTimes.push(timeMs);
    // Keep only last 1000 samples to avoid memory bloat
    if (this.renderTimes.length > 1000) {
      this.renderTimes.shift();
    }
  }

  /**
   * Record error
   */
  recordError(): void {
    this.errors++;
  }

  /**
   * Record contract generated
   */
  recordContractGenerated(): void {
    this.totalGenerated++;
  }

  /**
   * Log render operation
   */
  logRender(metrics: RenderMetrics): void {
    this.renderLog.push({
      ...metrics,
      timestamp: new Date().toISOString(),
    });

    // Keep only last N entries
    if (this.renderLog.length > this.maxLogSize) {
      this.renderLog.shift();
    }
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): TemplateMetrics {
    const totalAttempts = this.cacheHits + this.cacheMisses;
    const cacheHitRate = totalAttempts > 0 ? (this.cacheHits / totalAttempts) * 100 : 0;
    const fallbackUsageRate =
      this.totalGenerated > 0 ? (this.fallbackUsage / this.totalGenerated) * 100 : 0;
    const errorRate =
      this.totalGenerated > 0 ? (this.errors / this.totalGenerated) * 100 : 0;

    const renderTimes = this.renderTimes.length > 0 ? this.renderTimes : [0];
    const averageRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;

    return {
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      databaseQueries: this.databaseQueries,
      fallbackUsage: this.fallbackUsage,
      fallbackUsageRate: Math.round(fallbackUsageRate * 100) / 100,
      averageRenderTime: Math.round(averageRenderTime),
      errorRate: Math.round(errorRate * 100) / 100,
      totalContractsGenerated: this.totalGenerated,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get recent render logs
   */
  getRecentRenders(limit = 100): RenderMetrics[] {
    return this.renderLog.slice(-limit);
  }

  /**
   * Get render logs filtered by criteria
   */
  filterRenders(criteria: {
    source?: 'database' | 'fallback';
    contractType?: string;
    successOnly?: boolean;
    lastHours?: number;
  }): RenderMetrics[] {
    let results = [...this.renderLog];

    if (criteria.source) {
      results = results.filter(r => r.source === criteria.source);
    }

    if (criteria.contractType) {
      results = results.filter(r => r.contractType === criteria.contractType);
    }

    if (criteria.successOnly) {
      results = results.filter(r => r.success);
    }

    if (criteria.lastHours) {
      const cutoffTime = Date.now() - criteria.lastHours * 60 * 60 * 1000;
      results = results.filter(r => new Date(r.timestamp).getTime() > cutoffTime);
    }

    return results;
  }

  /**
   * Get performance alerts
   */
  getAlerts(): string[] {
    const alerts: string[] = [];
    const metrics = this.getMetrics();

    if (metrics.cacheHitRate < 80) {
      alerts.push(`⚠️  Cache hit rate is low: ${metrics.cacheHitRate}%`);
    }

    if (metrics.averageRenderTime > 200) {
      alerts.push(`⚠️  Average render time is high: ${metrics.averageRenderTime}ms`);
    }

    if (metrics.errorRate > 1) {
      alerts.push(`⚠️  Error rate is high: ${metrics.errorRate}%`);
    }

    if (metrics.fallbackUsageRate > 5) {
      alerts.push(`⚠️  Fallback usage is high: ${metrics.fallbackUsageRate}%`);
    }

    if (metrics.cacheHitRate < 60) {
      alerts.push(`🚨 CRITICAL: Cache hit rate critical: ${metrics.cacheHitRate}%`);
    }

    if (metrics.averageRenderTime > 500) {
      alerts.push(`🚨 CRITICAL: Rendering performance critical: ${metrics.averageRenderTime}ms`);
    }

    if (metrics.errorRate > 5) {
      alerts.push(`🚨 CRITICAL: Error rate critical: ${metrics.errorRate}%`);
    }

    return alerts;
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.databaseQueries = 0;
    this.fallbackUsage = 0;
    this.renderTimes = [];
    this.errors = 0;
    this.totalGenerated = 0;
    this.renderLog = [];
    this.startTime = Date.now();
  }

  /**
   * Get uptime
   */
  getUptime(): {
    seconds: number;
    minutes: number;
    hours: number;
    formatted: string;
  } {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let formatted: string;
    if (days > 0) {
      formatted = `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      formatted = `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      formatted = `${minutes}m ${seconds % 60}s`;
    } else {
      formatted = `${seconds}s`;
    }

    return { seconds, minutes, hours, formatted };
  }
}

// Global metrics instance
let metricsCollector: TemplateMetricsCollector | null = null;

/**
 * Get global metrics collector instance
 */
export function getMetricsCollector(): TemplateMetricsCollector {
  if (!metricsCollector) {
    metricsCollector = new TemplateMetricsCollector();
  }
  return metricsCollector;
}

/**
 * Helper to measure rendering time
 */
export async function measureRenderTime<T>(
  operation: () => Promise<T>,
  contractType: string,
  language: string,
  source: 'database' | 'fallback',
  templateId?: string
): Promise<{ result: T; timeMs: number }> {
  const startTime = performance.now();
  try {
    const result = await operation();
    const timeMs = Math.round(performance.now() - startTime);

    const collector = getMetricsCollector();
    collector.recordRenderTime(timeMs);
    collector.recordContractGenerated();
    collector.logRender({
      templateId,
      source,
      renderTimeMs: timeMs,
      success: true,
      contractType,
      language,
      timestamp: new Date().toISOString(),
      cached: false,
    });

    return { result, timeMs };
  } catch (error) {
    const timeMs = Math.round(performance.now() - startTime);
    const collector = getMetricsCollector();
    collector.recordError();
    collector.logRender({
      templateId,
      source,
      renderTimeMs: timeMs,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      contractType,
      language,
      timestamp: new Date().toISOString(),
      cached: false,
    });
    throw error;
  }
}

/**
 * Export metrics summary for monitoring
 */
export function exportMetricsSummary(): {
  metrics: TemplateMetrics;
  alerts: string[];
  uptime: string;
} {
  const collector = getMetricsCollector();
  return {
    metrics: collector.getMetrics(),
    alerts: collector.getAlerts(),
    uptime: collector.getUptime().formatted,
  };
}
