// lib/components/TemplateErrorDisplay.tsx
// Display user-friendly error messages for template rendering failures

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface TemplateErrorDisplayProps {
  errorMessage?: string;
  onRetry?: () => void;
  isDeveloperMode?: boolean;
  technicalDetails?: string;
}

/**
 * Display user-friendly error message when template rendering fails
 */
export function TemplateErrorDisplay({
  errorMessage = 'Unable to generate contract',
  onRetry,
  isDeveloperMode = false,
  technicalDetails,
}: TemplateErrorDisplayProps) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
      {/* Error Icon and Title */}
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900">
            {errorMessage || 'Unable to Generate Contract'}
          </h3>
          <p className="text-sm text-red-700 mt-1">
            There was an issue rendering your contract. Please try again.
          </p>
        </div>
      </div>

      {/* Technical Details (Developer Mode Only) */}
      {isDeveloperMode && technicalDetails && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded font-mono text-xs text-red-800">
          <details>
            <summary className="cursor-pointer font-semibold mb-2">Technical Details</summary>
            <pre className="overflow-auto whitespace-pre-wrap break-words max-h-40">
              {technicalDetails}
            </pre>
          </details>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={() => {
            // Send error report to support
            if (technicalDetails) {
              console.error('Template Rendering Error:', technicalDetails);
            }
          }}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Contact Support
        </button>
      </div>

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
        <p className="text-sm text-amber-900">
          <strong>What to do:</strong> This error is likely temporary. Try generating the contract again. 
          If the problem persists, please contact support with the details above.
        </p>
      </div>
    </div>
  );
}

/**
 * Simple loading state while template is being rendered
 */
export function TemplateLoadingDisplay() {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
        <div>
          <h3 className="font-semibold text-blue-900">Generating Contract</h3>
          <p className="text-sm text-blue-700">Please wait while we render your contract...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Success confirmation
 */
export function TemplateSuccessDisplay() {
  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-green-900">Contract generated successfully</p>
      </div>
    </div>
  );
}
