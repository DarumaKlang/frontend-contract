// app/api/admin/templates/cache/clear/route.ts
// Admin endpoint for clearing the template cache

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { getTemplateCache } from '@/lib/cache/templateCache';
import os from 'os';

/**
 * POST /api/admin/templates/cache/clear
 * Clear the entire template cache
 * 
 * Requires admin authentication via JWT token.
 * Logs cache clear events for audit trails.
 * 
 * Response includes:
 * - success: boolean indicating if cache was cleared
 * - timestamp: ISO 8601 timestamp of when cache was cleared
 * - message: descriptive message like "Cache cleared successfully"
 * 
 * **Validates: Requirements 3.3**
 */
export async function POST(req: Request) {
  const adminCheck = await requireAdmin(req);
  if (adminCheck) return adminCheck;

  try {
    const now = new Date();
    const timestamp = now.toISOString();
    const machineId = process.env.MACHINE_ID || os.hostname();

    // Get cache instance and clear it
    const cache = getTemplateCache();
    cache.clear();

    // Log cache clear event for audit trail
    const adminUser = (req as any).adminUser;
    const logEntry = {
      timestamp,
      machineId,
      level: 'info' as const,
      category: 'cache-operation' as const,
      message: 'Template cache cleared by admin',
      metadata: {
        action: 'cache_clear',
        adminUserId: adminUser?.id,
        adminEmail: adminUser?.email,
      },
    };

    console.log(JSON.stringify(logEntry));

    return NextResponse.json({
      success: true,
      timestamp,
      message: 'Cache cleared successfully',
      clearedBy: {
        userId: adminUser?.id,
        email: adminUser?.email,
      },
    });
  } catch (error: any) {
    console.error('Cache clear error:', error);

    const now = new Date();
    const timestamp = now.toISOString();
    const machineId = process.env.MACHINE_ID || os.hostname();

    // Log error event
    const logEntry = {
      timestamp,
      machineId,
      level: 'error' as const,
      category: 'cache-operation' as const,
      message: 'Failed to clear template cache',
      metadata: {
        action: 'cache_clear',
        errorCode: 'CACHE_CLEAR_ERROR',
        errorMessage: error.message,
      },
    };

    console.error(JSON.stringify(logEntry));

    return NextResponse.json(
      {
        success: false,
        timestamp,
        message: 'Failed to clear cache',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
