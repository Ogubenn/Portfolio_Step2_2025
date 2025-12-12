import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Proxy route for downloading files from Cloudinary with proper filename
 * Solves cross-origin download attribute issue
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download.pdf';

    if (!url) {
      return NextResponse.json(
        { error: 'URL parametresi gerekli' },
        { status: 400 }
      );
    }

    // Cloudinary URL'den dosyayı fetch et
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Dosya indirilemedi' },
        { status: response.status }
      );
    }

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // Proper headers ile response döndür
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { error: 'Dosya indirme hatası' },
      { status: 500 }
    );
  }
}
