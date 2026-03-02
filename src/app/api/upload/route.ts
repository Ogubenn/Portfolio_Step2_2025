import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// ✅ Cloudinary entegrasyonu - Production-ready file upload

export async function POST(request: NextRequest) {
  try {
    // Cloudinary config kontrolü
    const hasCloudinary = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;
    
    if (!hasCloudinary) {
      console.warn('Cloudinary credentials missing, using local storage fallback');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'portfolio'; // Default folder
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    console.log('Upload request:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder: folder
    });

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

    // Dosya boyutu kontrolü kaldırıldı - Cloudinary limitleri kullanılacak

    // Buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Cloudinary required for production (Vercel serverless doesn't support local filesystem)
    if (!hasCloudinary) {
      return NextResponse.json(
        { 
          error: 'Cloudinary yapılandırması gereklidir. Lütfen .env dosyasına Cloudinary bilgilerini ekleyin.',
          details: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET gerekli'
        },
        { status: 500 }
      );
    }
    
    try {
      // Cloudinary resource type belirle
      let resourceType: 'image' | 'video' | 'raw' = 'image';
      if (isVideo) resourceType = 'video';
      if (isDocument) resourceType = 'raw';
      
      // Cloudinary'ye yükle
      const result = await uploadToCloudinary(buffer, folder, resourceType);

      console.log('[CLOUDINARY UPLOAD SUCCESS]', {
        url: result.secure_url,
        size: result.bytes,
        format: result.format
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.name,
        type: isImage ? 'image' : isVideo ? 'video' : 'document',
        size: result.bytes,
        mimeType: file.type,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError);
      return NextResponse.json(
        { 
          error: 'Cloudinary yükleme hatası: ' + (cloudinaryError instanceof Error ? cloudinaryError.message : 'Bilinmeyen hata'),
          details: cloudinaryError instanceof Error ? cloudinaryError.stack : String(cloudinaryError)
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: typeof error,
      errorObject: error
    });
    
    return NextResponse.json(
      { 
        error: 'Dosya yüklenirken bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'),
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
