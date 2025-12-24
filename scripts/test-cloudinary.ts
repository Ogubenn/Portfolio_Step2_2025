// Test Cloudinary connection
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load .env file
config();

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function testCloudinary() {
  console.log('Testing Cloudinary connection...\n');
  
  console.log('Config:', {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'MISSING',
  });

  try {
    // Test API ping
    const result = await cloudinary.api.ping();
    console.log('\n✅ Cloudinary connection successful!');
    console.log('Response:', result);
    
    // Get usage stats
    const usage = await cloudinary.api.usage();
    console.log('\n📊 Usage Stats:');
    console.log(`  Storage: ${(usage.storage.usage / 1024 / 1024).toFixed(2)} MB / ${(usage.storage.limit / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Bandwidth: ${(usage.bandwidth.usage / 1024 / 1024).toFixed(2)} MB / ${(usage.bandwidth.limit / 1024 / 1024).toFixed(2)} MB`);
    
  } catch (error) {
    console.error('\n❌ Cloudinary connection failed!');
    console.error('Error:', error);
  }
}

testCloudinary();
