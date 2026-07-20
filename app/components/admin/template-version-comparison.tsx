'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import type { ContractTemplate } from '@/lib/types/template';

interface VersionComparisonProps {
  versions: ContractTemplate[];
  currentVersion?: ContractTemplate;
}

interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber?: number;
  oldLineNumber?: number;
  newLineNumber?: number;
}

/**
 * Calculate longest common subsequence to find unchanged lines
 */
function getLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * Backtrack through LCS table to find matching lines
 */
function getMatchingLines(a: string[], b: string[], dp: number[][]): Set<number> {
  const matched = new Set<number>();
  let i = a.length;
  let j = b.length;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      matched.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return matched;
}

/**
 * Generate intelligent diff using LCS algorithm
 * Shows context lines and highlights changes
 */
function generateDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const diff: DiffLine[] = [];

  // Calculate LCS to find matching lines
  const dp = getLCS(oldLines, newLines);
  const matchedNewLines = getMatchingLines(oldLines, newLines, dp);

  // Track position in old and new
  let oldIdx = 0;
  let newIdx = 0;

  // Build diff with context lines
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (oldIdx < oldLines.length && newIdx < newLines.length && oldLines[oldIdx] === newLines[newIdx]) {
      // Context line (unchanged)
      diff.push({
        type: 'context',
        content: oldLines[oldIdx],
        oldLineNumber: oldIdx + 1,
        newLineNumber: newIdx + 1,
      });
      oldIdx++;
      newIdx++;
    } else if (oldIdx < oldLines.length && !matchedNewLines.has(newIdx)) {
      // Line was removed
      diff.push({
        type: 'remove',
        content: oldLines[oldIdx],
        oldLineNumber: oldIdx + 1,
      });
      oldIdx++;
    } else if (newIdx < newLines.length) {
      // Line was added
      diff.push({
        type: 'add',
        content: newLines[newIdx],
        newLineNumber: newIdx + 1,
      });
      newIdx++;
    } else {
      break;
    }
  }

  return diff;
}

export function TemplateVersionComparison({
  versions,
  currentVersion,
}: VersionComparisonProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(
    new Set(currentVersion ? [currentVersion.id] : [])
  );
  const [comparisonPair, setComparisonPair] = useState<{
    from?: ContractTemplate;
    to?: ContractTemplate;
  }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFullDiff, setShowFullDiff] = useState(false);

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedVersions(newExpanded);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const diff =
    comparisonPair.from && comparisonPair.to
      ? generateDiff(comparisonPair.from.template_html, comparisonPair.to.template_html)
      : [];

  // Count changes
  const additions = diff.filter(line => line.type === 'add').length;
  const removals = diff.filter(line => line.type === 'remove').length;
  const contextLines = diff.filter(line => line.type === 'context').length;

  // Show limited diff by default, full on demand
  const displayDiff = showFullDiff ? diff : diff.slice(0, 50);
  const hasMoreLines = diff.length > 50;

  return (
    <div className="space-y-4">
      {/* Version List */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Template Versions</h3>
          <p className="text-sm text-slate-600 mt-1">
            {sortedVersions.length} version{sortedVersions.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedVersions.map((version, idx) => (
            <div key={version.id} className="p-4 hover:bg-slate-50 transition">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpanded(version.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  {expandedVersions.has(version.id) ? (
                    <ChevronUp size={20} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={20} className="text-slate-400" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded">
                        v{String(version.version).padStart(3, '0')}
                      </span>
                      {version.is_active && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          ✓ Active
                        </span>
                      )}
                      {version.is_draft && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                          ✎ Draft
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {version.name}
                      {version.description && (
                        <>
                          <span className="text-slate-300 mx-2">•</span>
                          <span className="text-slate-500">{version.description}</span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Updated: {new Date(version.updated_at).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {expandedVersions.has(version.id) && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {/* Version Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-3 rounded">
                    <div>
                      <span className="text-slate-500 text-xs uppercase font-medium">Created by</span>
                      <p className="text-slate-900 font-medium mt-1">
                        {version.created_by || 'System'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase font-medium">Created</span>
                      <p className="text-slate-900 font-medium mt-1">
                        {new Date(version.created_at).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase font-medium">Variables</span>
                      <p className="text-slate-900 font-medium mt-1">
                        {version.variables?.length || 0}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs uppercase font-medium">HTML Size</span>
                      <p className="text-slate-900 font-medium mt-1">
                        {(version.template_html.length / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (comparisonPair.to?.id === version.id) {
                          setComparisonPair({});
                        } else {
                          setComparisonPair({
                            from: sortedVersions[0],
                            to: version,
                          });
                        }
                      }}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition ${
                        comparisonPair.to?.id === version.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {comparisonPair.to?.id === version.id ? '📊 Comparing...' : '📊 Compare'}
                    </button>
                    <button
                      onClick={() => copyToClipboard(version.template_html, version.id)}
                      className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium rounded-lg transition flex items-center gap-2"
                      title="Copy template HTML to clipboard"
                    >
                      {copiedId === version.id ? (
                        <>
                          <Check size={16} />
                          <span className="hidden sm:inline">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="hidden sm:inline">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Diff Viewer */}
      {comparisonPair.from && comparisonPair.to && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900 text-base">
                📋 Diff: v{String(comparisonPair.from.version).padStart(3, '0')} → v{String(comparisonPair.to.version).padStart(3, '0')}
              </h3>
              <button
                onClick={() => setComparisonPair({})}
                className="text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-red-200 border border-red-400"></span>
                <span className="text-slate-700">{removals} removed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-200 border border-green-400"></span>
                <span className="text-slate-700">{additions} added</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-slate-200 border border-slate-400"></span>
                <span className="text-slate-700">{contextLines} unchanged</span>
              </div>
            </div>
          </div>

          {/* Diff Table */}
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <tbody>
                {displayDiff.map((line, idx) => (
                  <tr
                    key={idx}
                    className={
                      line.type === 'add'
                        ? 'bg-green-50 hover:bg-green-100'
                        : line.type === 'remove'
                          ? 'bg-red-50 hover:bg-red-100'
                          : 'bg-white hover:bg-slate-50'
                    }
                  >
                    <td
                      className={`w-10 px-2 py-1 text-right user-select-none border-r font-semibold ${
                        line.type === 'add'
                          ? 'bg-green-100 text-green-700'
                          : line.type === 'remove'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
                    </td>
                    <td className="px-3 py-1 text-slate-600 border-r w-12 text-right">
                      {line.oldLineNumber}
                    </td>
                    <td className="px-3 py-1 text-slate-600 border-r w-12 text-right">
                      {line.newLineNumber}
                    </td>
                    <td className="px-3 py-1 text-slate-900 break-words max-w-2xl">
                      <code>{line.content || ' '}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Load More Button */}
            {hasMoreLines && !showFullDiff && (
              <div className="p-4 border-t border-slate-200 text-center bg-slate-50">
                <button
                  onClick={() => setShowFullDiff(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Show all {diff.length} lines
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-sm text-slate-600">
            <span className="font-semibold">{diff.length}</span> line{diff.length !== 1 ? 's' : ''} changed
            {diff.length > displayDiff.length && (
              <span className="text-slate-500 ml-2">
                ({displayDiff.length} shown)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
