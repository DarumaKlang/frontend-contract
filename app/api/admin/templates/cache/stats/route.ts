// app/api/admin/templates/cache/stats/route.ts
// Cache statistics endpoint for monitoring and observability

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getTemplateCache } from '@/lib/cache/templateCache';

/**
 * GET /api/admin/templates/cache/stats
 * Returns cache statistics including size, hit rate, and entry details
 * 
 * Requires admin authentication via JWT token.
 * 
 * **Validates: Requirements 3.7**
 */
export async function GET(req: Request) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const cache = getTemplateCache();
    const stats = cache.getStats();

    // Transform the stats to include more readable format
    const response = {
      size: stats.size,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: parseFloat((stats.hitRate * 100).toFixed(2)), // Convert to percentage
      entries: stats.entries.map(entry => ({
        key: entry.key,
        cachedAt: entry.cachedAt.toISOString(),
        expiresAt: entry.expiresAt.toISOString(),
        isExpired: entry.isExpired,
      })),
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get cache stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get cache statistics' },
      { status: 500 }
    );
  }
}
