import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Toast } from './types';

interface ContractToastStackProps {
  toasts: Toast[];
}

export function ContractToastStack({ toasts }: ContractToastStackProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto max-w-sm rounded-xl border bg-white p-4 shadow-xl ${toast.type === 'success' ? 'border-emerald-100' : toast.type === 'error' ? 'border-red-100' : 'border-blue-100'}`}
        >
          {toast.type === 'success' ? (
            <div className="mb-2 flex items-center gap-2 text-emerald-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          ) : toast.type === 'error' ? (
            <div className="mb-2 flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          ) : (
            <div className="mb-2 flex items-center gap-2 text-blue-700">
              <Info className="h-5 w-5" />
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
