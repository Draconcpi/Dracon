import { NextRequest, NextResponse } from 'next/server';

const DRIVE_ID = /^[\w-]{10,200}$/;
const RASTER_IMAGE = /^image\/(jpeg|png|webp|gif|avif)/;
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Tried in order. Files that aren't public are redirected to Google's sign-in page (HTML).
const driveSources = (id: string) => [
  `https://drive.google.com/thumbnail?id=${id}&sz=w2000`,
  `https://drive.usercontent.google.com/download?id=${id}&export=view`,
  `https://lh3.googleusercontent.com/d/${id}=w2000`,
];

/**
 * Serves a publicly shared Google Drive image from our own origin
 * (browsers block Drive hotlinks). Usage: /api/image-proxy?driveId=FILE_ID
 */
export async function GET(request: NextRequest) {
  const driveId = request.nextUrl.searchParams.get('driveId');
  if (!driveId || !DRIVE_ID.test(driveId)) {
    return NextResponse.json({ error: 'Parâmetro "driveId" ausente ou inválido.' }, { status: 400 });
  }

  for (const source of driveSources(driveId)) {
    try {
      const upstream = await fetch(source, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'image/avif,image/webp,image/*;q=0.8' },
        redirect: 'follow',
        // Next 14 caches fetch() by default — a cached sign-in page would outlive a sharing fix
        cache: 'no-store',
        signal: AbortSignal.timeout(10_000),
      });
      const contentType = upstream.headers.get('content-type') ?? '';

      if (!upstream.ok || !RASTER_IMAGE.test(contentType) || !upstream.body) {
        await upstream.body?.cancel();
        // Redirected to sign-in: the file isn't public, the other sources would fail too
        if (new URL(upstream.url).hostname === 'accounts.google.com') break;
        continue;
      }

      return new NextResponse(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
          'Content-Security-Policy': "default-src 'none'; sandbox",
          'X-Content-Type-Options': 'nosniff',
        },
      });
    } catch (error) {
      console.error('Image proxy error:', source, error);
    }
  }

  return NextResponse.json(
    {
      error:
        'Imagem não encontrada ou privada. No Google Drive, compartilhe o arquivo como "Qualquer pessoa com o link" (Leitor).',
    },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  );
}
