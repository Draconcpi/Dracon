import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Simple rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

/**
 * Converts Google Drive URLs or file IDs into a direct-embed image URL.
 * Accepts:
 *   - Raw file ID: "1ABCxyz..."
 *   - Share link: "https://drive.google.com/file/d/1ABCxyz.../view?usp=sharing"
 *   - Old direct link: "https://drive.google.com/uc?id=1ABCxyz..."
 *   - Open link: "https://drive.google.com/open?id=1ABCxyz..."
 *   - Already a thumbnail link: returned as-is
 *   - Any other URL: returned as-is
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already a lh3 / googleusercontent thumbnail → pass through
  if (trimmed.includes('lh3.googleusercontent.com')) return trimmed;

  // Extract Google Drive file ID from various URL formats
  let fileId: string | null = null;

  // Format: https://drive.google.com/file/d/FILE_ID/...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) fileId = fileMatch[1];

  // Format: https://drive.google.com/uc?id=FILE_ID or open?id=FILE_ID
  if (!fileId) {
    const idParam = trimmed.match(/drive\.google\.com\/(?:uc|open)\?.*id=([^&]+)/);
    if (idParam) fileId = idParam[1];
  }

  // Format: raw file ID (alphanumeric + hyphens/underscores, typically 25-60 chars)
  if (!fileId && /^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    fileId = trimmed;
  }

  if (fileId) {
    // Use the thumbnail endpoint which works without auth for shared files
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
  }

  // Not a Google Drive URL → return as-is
  return trimmed;
}
