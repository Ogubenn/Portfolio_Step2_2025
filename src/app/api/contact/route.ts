import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, isValidEmail, checkRateLimit } from '@/lib/email'

// Force dynamic route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tüm alanlar gereklidir' },
        { status: 400 }
      )
    }

    // Name validation
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'İsim çok uzun' },
        { status: 400 }
      )
    }

    // Email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi' },
        { status: 400 }
      )
    }

    // Message validation
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Mesaj çok kısa (minimum 10 karakter)' },
        { status: 400 }
      )
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Mesaj çok uzun (maksimum 500 karakter)' },
        { status: 400 }
      )
    }

    // Rate limiting check
    if (!checkRateLimit(email, 5)) {
      return NextResponse.json(
        { error: 'Çok fazla mesaj gönderdiniz. Lütfen 5 dakika bekleyin.' },
        { status: 429 }
      )
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email servisi yapılandırılmamış. Lütfen site sahibiyle iletişime geçin.' },
        { status: 500 }
      )
    }

    // Send email
    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    })

    if (!result.success) {
      console.error('Email send failed:', result.error)
      return NextResponse.json(
        { error: 'Email gönderilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mesajınız başarıyla gönderildi!' 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Beklenmeyen bir hata oluştu' },
      { status: 500 }
    )
  }
}

// GET method - not allowed
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
