// lib/components/TemplateMetadataDisplay.tsx
// Display template metadata in developer mode
// Shows template source (database or fallback), version, and ID

import React from 'react';
import { Database, AlertCircle, Info } from 'lucide-react';

export interface TemplateMetadata {
  source: 'database' | 'fallback';
  templateId?: string;
  version?: number;
  contractType: string;
  language: string;
}

interface TemplateMetadataDisplayProps {
  metadata: TemplateMetadata;
  isDeveloperMode?: boolean;
  className?: string;
}

/**
 * Display template metadata in developer mode
 * Shows whether template came from database or fallback
 */
export function TemplateMetadataDisplay({
  metadata,
  isDeveloperMode = false,
  className = '',
}: TemplateMetadataDisplayProps) {
  // Only show in developer mode
  if (!isDeveloperMode) {
    return null;
  }

  return (
    <div
      className={`
        bg-slate-900 text-white rounded-lg p-4 mb-6 font-mono text-sm
        border-2 ${
          metadata.source === 'database'
            ? 'border-green-500 bg-green-950'
            : 'border-amber-500 bg-amber-950'
        }
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {metadata.source === 'database' ? (
          <>
            <Database size={16} className="text-green-400" />
            <span className="font-bold text-green-400">Template from Database</span>
          </>
        ) : (
          <>
            <AlertCircle size={16} className="text-amber-400" />
            <span className="font-bold text-amber-400">Using Fallback Template</span>
          </>
        )}
      </div>

      {/* Metadata Details */}
      <div className="space-y-2 text-slate-300">
        {/* Source */}
        <div className="flex gap-2">
          <span className="text-slate-400 min-w-[120px]">Source:</span>
          <span className={metadata.source === 'database' ? 'text-green-300' : 'text-amber-300'}>
            {metadata.source === 'database' ? 'Active Database Template' : 'Hardcoded Fallback'}
          </span>
        </div>

        {/* Contract Type */}
        <div className="flex gap-2">
          <span className="text-slate-400 min-w-[120px]">Contract Type:</span>
          <span>{metadata.contractType}</span>
        </div>

        {/* Language */}
        <div className="flex gap-2">
          <span className="text-slate-400 min-w-[120px]">Language:</span>
          <span className="uppercase">{metadata.language}</span>
        </div>

        {/* Version (if available) */}
        {metadata.version !== undefined && (
          <div className="flex gap-2">
            <span className="text-slate-400 min-w-[120px]">Version:</span>
            <span>{metadata.version}</span>
          </div>
        )}

        {/* Template ID (if available) */}
        {metadata.templateId && (
          <div className="flex gap-2">
            <span className="text-slate-400 min-w-[120px]">Template ID:</span>
            <code className="text-green-300 break-all">{metadata.templateId}</code>
          </div>
        )}

        {/* Fallback Reason */}
        {metadata.source === 'fallback' && (
          <div className="mt-3 pt-3 border-t border-amber-700">
            <div className="flex gap-2 text-amber-300">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span className="text-xs">
                Using fallback because no active template exists. Update templates in Admin panel.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
        This information is only visible in Developer Mode
      </div>
    </div>
  );
}

/**
 * Hook to check if developer mode is enabled
 */
export function useDeveloperMode(): boolean {
  const [isDeveloperMode, setIsDeveloperMode] = React.useState(false);

  React.useEffect(() => {
    // Check URL parameter or localStorage
    const searchParams = new URLSearchParams(window.location.search);
    const urlDevMode = searchParams.get('dev') === 'true';
    const storageDevMode = localStorage.getItem('developerMode') === 'true';
    setIsDeveloperMode(urlDevMode || storageDevMode);

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'developerMode') {
        setIsDeveloperMode(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return isDeveloperMode;
}

/**
 * Enable/disable developer mode
 */
export function setDeveloperMode(enabled: boolean): void {
  localStorage.setItem('developerMode', String(enabled));
  window.dispatchEvent(new StorageEvent('storage', { key: 'developerMode' }));
}
