import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'project', 'cv', 'test', etc.
    
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
    const maxImageSize = 20 * 1024 * 1024; // 20MB for images
    const maxVideoSize = 541 * 1024 * 1024; // 541MB for videos
    const maxDocSize = 50 * 1024 * 1024; // 50MB for documents
    
    let maxSize = maxImageSize;
    if (isVideo) maxSize = maxVideoSize;
    if (isDocument) maxSize = maxDocSize;
    
    if (file.size > maxSize) {
      const sizeLimit = isVideo ? '541MB' : isDocument ? '50MB' : '20MB';
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

    // Klasör yapısını belirle
    let folder = 'thumbnails';
    let basePath = 'projects';
    
    if (type === 'heroImage') {
      basePath = 'images';
      folder = 'hero';
    } else if (isVideo) {
      folder = 'videos';
    } else if (isDocument) {
      if (type === 'cv') {
        basePath = 'files';
        folder = 'cv';
      } else if (type === 'test') {
        basePath = 'files';
        folder = 'tests';
      } else {
        basePath = 'files';
        folder = 'documents';
      }
    }

    const filePath = path.join(process.cwd(), 'public', basePath, folder, fileName);
    await writeFile(filePath, buffer);

    // URL'i döndür
    const fileUrl = `/${basePath}/${folder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      type: isImage ? 'image' : isVideo ? 'video' : 'document'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
