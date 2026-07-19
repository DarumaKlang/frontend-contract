// lib/sanitize.ts - XSS Protection
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 * Allows only safe HTML tags and attributes for contract display
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'blockquote', 'pre', 'code',
    ],
    ALLOWED_ATTR: ['class', 'style'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}

/**
 * Sanitize HTML for blog/article content (more permissive)
 */
export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'div', 'span', 'section', 'article',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'blockquote', 'pre', 'code',
      'a', 'img',
    ],
    ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Strip all HTML tags (for plain text only)
 */
export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
