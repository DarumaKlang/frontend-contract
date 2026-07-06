import React from 'react';

export function RevenueChart({ data }: { data: any }) {
  // Simple inline chart using SVG: show a single bar proportional to total
  const total = Number(data.total || 0) / 100; // assume cents
  const max = Math.max(total, 1);
  const width = Math.min(600, Math.round((total / max) * 600));

  return (
    <div>
      <div className="text-sm text-slate-600">Revenue (approx)</div>
      <svg width="100%" height="60" viewBox="0 0 600 60" preserveAspectRatio="none">
        <rect x="0" y="10" width={`${Math.max(1, (total / max) * 580)}`} height="30" fill="#0f172a" rx="6" />
      </svg>
      <div className="mt-2 text-sm text-slate-700">{total.toFixed(2)} {data.currency?.toUpperCase()}</div>
    </div>
  );
}
