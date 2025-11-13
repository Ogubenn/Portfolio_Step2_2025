import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya türü kontrolü
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);
    
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Sadece resim (jpg, png, webp, gif) veya video (mp4, webm, ogg, mov) dosyaları yüklenebilir' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü
    const maxImageSize = 20 * 1024 * 1024; // 20MB for images
    const maxVideoSize = 541 * 1024 * 1024; // 541MB for videos
    const maxSize = isVideo ? maxVideoSize : maxImageSize;
    
    if (file.size > maxSize) {
      const sizeLimit = isVideo ? '541MB' : '20MB';
      return NextResponse.json(
        { error: `Dosya boyutu ${sizeLimit}'dan küçük olmalıdır` },
        { status: 400 }
      );
    }

    // Dosya adını temizle ve benzersiz yap
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const fileName = `${timestamp}-${originalName}`;

    // Buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Public klasörüne kaydet (resimler thumbnails/, videolar videos/ klasörüne)
    const folder = isImage ? 'thumbnails' : 'videos';
    const filePath = path.join(process.cwd(), 'public', 'projects', folder, fileName);
    await writeFile(filePath, buffer);

    // URL'i döndür
    const fileUrl = `/projects/${folder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      type: isImage ? 'image' : 'video'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
