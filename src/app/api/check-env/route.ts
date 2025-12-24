import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env_check: {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'MISSING',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET (***' + process.env.CLOUDINARY_API_KEY.slice(-4) + ')' : 'MISSING',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET (***' + process.env.CLOUDINARY_API_SECRET.slice(-4) + ')' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL || 'false',
    },
    message: 'All three variables must be SET for upload to work'
  });
}
