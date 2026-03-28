import { NextRequest, NextResponse } from 'next/server';

/**
 * Image proxy that fetches images from Google Drive (or any external URL)
 * server-side to avoid CORS/referrer blocking in the browser.
 *
 * Usage: /api/image-proxy?url=ENCODED_URL
 *    or: /api/image-proxy?driveId=FILE_ID
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const driveId = searchParams.get('driveId');
  const rawUrl = searchParams.get('url');

  let targetUrl: string | null = null;

  if (driveId) {
    // Try multiple Google Drive URL formats in order of reliability
    targetUrl = `https://drive.google.com/uc?export=view&id=${driveId}`;
  } else if (rawUrl) {
    targetUrl = rawUrl;
  }

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing "driveId" or "url" parameter' },
      { status: 400 }
    );
  }

  try {
    // Fetch the image server-side (no CORS issues)
    const response = await fetch(targetUrl, {
      headers: {
        // Mimic a browser request
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow', // Follow Google's redirects
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Only proxy image content types
    if (!contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
      // Google may return HTML (sign-in page) if file isn't shared properly
      return NextResponse.json(
        { error: 'O arquivo não é uma imagem pública. Verifique se o compartilhamento está como "Qualquer pessoa com o link".' },
        { status: 400 }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800', // Cache 1d browser, 7d CDN
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar imagem' },
      { status: 500 }
    );
  }
}
