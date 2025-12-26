import { NextResponse } from 'next/server';

// Test endpoint - does upload route exist?
export async function GET() {
  return NextResponse.json({
    status: 'Upload route is accessible',
    message: 'POST /api/upload is ready',
    timestamp: new Date().toISOString()
  });
}
