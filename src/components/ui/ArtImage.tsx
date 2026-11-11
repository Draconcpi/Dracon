'use client';

import Image, { type ImageProps } from 'next/image';
import { useState, type ReactNode } from 'react';
import { resolveImageUrl } from '@/lib/utils';

type ArtImageProps = Omit<ImageProps, 'src' | 'onError'> & {
  src: string | null | undefined;
  /** Shown when there is no image or it fails to load (e.g. a private Drive file). */
  fallback?: ReactNode;
};

/** Artwork image from an admin-provided URL: Google Drive link/ID, local upload or external URL. */
export default function ArtImage({ src, alt, fallback = null, ...props }: ArtImageProps) {
  const resolved = resolveImageUrl(src);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Seed data points to /images/portfolio/*, which doesn't exist
  if (!resolved || resolved.startsWith('/images/portfolio/') || failedSrc === resolved) {
    return <>{fallback}</>;
  }

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      // Arbitrary external hosts aren't in next.config remotePatterns, so let the browser load them directly
      unoptimized={!resolved.startsWith('/')}
      onError={() => setFailedSrc(resolved)}
    />
  );
}
