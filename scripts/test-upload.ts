import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testUpload() {
  console.log('Testing Cloudinary upload with credentials...\n');
  
  console.log('Config:', {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING',
  });

  try {
    // Test with a simple text upload
    const result = await cloudinary.uploader.upload('data:text/plain;base64,SGVsbG8gV29ybGQh', {
      folder: 'test',
      resource_type: 'raw',
      public_id: 'test_upload_' + Date.now()
    });
    
    console.log('\n✅ Upload successful!');
    console.log('Result:', {
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes
    });
    
    // Clean up
    await cloudinary.uploader.destroy(result.public_id, { resource_type: 'raw' });
    console.log('\n🗑️ Test file deleted');
    
  } catch (error: any) {
    console.error('\n❌ Upload failed!');
    console.error('Error:', error.message);
    console.error('Error code:', error.http_code);
    console.error('Full error:', error);
  }
}

testUpload();
