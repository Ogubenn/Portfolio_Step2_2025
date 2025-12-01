import { NextRequest, NextResponse } from 'next/server';

// ⚠️ WORKAROUND: Vercel ephemeral filesystem - base64 storage kullanıyoruz
// TODO: Cloudinary entegrasyonu ile değiştirilecek

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya türü kontrolü
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);
    const isDocument = allowedDocTypes.includes(file.type);
    
    if (!isImage && !isVideo && !isDocument) {
      return NextResponse.json(
        { error: 'Sadece resim (jpg, png, webp, gif), video (mp4, webm, ogg, mov) veya doküman (pdf, doc, docx) dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    const maxImageSize = 5 * 1024 * 1024; // 5MB for images (base64 için küçültüldü)
    const maxVideoSize = 10 * 1024 * 1024; // 10MB for videos
    const maxDocSize = 5 * 1024 * 1024; // 5MB for documents
    
    let maxSize = maxImageSize;
    if (isVideo) maxSize = maxVideoSize;
    if (isDocument) maxSize = maxDocSize;
    
    if (file.size > maxSize) {
      const sizeLimit = isVideo ? '10MB' : '5MB';
      return NextResponse.json(
        { error: `Dosya boyutu ${sizeLimit}'dan küçük olmalıdır` },
        { status: 400 }
      );
    }

    // Buffer'a çevir ve base64 encode
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    // Data URL oluştur
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: file.name,
      type: isImage ? 'image' : isVideo ? 'video' : 'document',
      size: file.size,
      mimeType: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
