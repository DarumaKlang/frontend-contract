import type { Language } from '../types';

export function formatDisplayDate(value: string | undefined, appLanguage: Language) {
  return value
    ? new Date(value).toLocaleDateString(appLanguage === 'th' ? 'th-TH' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '...........................';
}
