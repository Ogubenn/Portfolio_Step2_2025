import { Resend } from 'resend'

// Initialize Resend - optional during build
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface ContactEmailData {
  name: string
  email: string
  message: string
}

/**
 * Send contact form email
 */
export async function sendContactEmail(data: ContactEmailData) {
  const { name, email, message } = data

  // Email template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #14B8A6 0%, #A855F7 100%);
            color: white;
            padding: 30px;
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 12px 12px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #14B8A6;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .value {
            color: #111827;
            font-size: 16px;
            padding: 10px;
            background: #f9fafb;
            border-left: 3px solid #14B8A6;
            border-radius: 4px;
          }
          .message-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #14B8A6;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #14B8A6 0%, #A855F7 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 Yeni İletişim Mesajı</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Gönderen</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">E-posta</div>
            <div class="value">
              <a href="mailto:${email}" style="color: #14B8A6; text-decoration: none;">${email}</a>
            </div>
          </div>
          
          <div class="field">
            <div class="label">Mesaj</div>
            <div class="message-box">${message}</div>
          </div>

          <a href="mailto:${email}" class="cta-button">
            📧 Yanıtla
          </a>
        </div>
        
        <div class="footer">
          <p>Bu mesaj portfolio contact formu üzerinden gönderildi.</p>
          <p>Gönderim zamanı: ${new Date().toLocaleString('tr-TR')}</p>
        </div>
      </body>
    </html>
  `

  const textContent = `
Yeni İletişim Mesajı

Gönderen: ${name}
E-posta: ${email}

Mesaj:
${message}

---
Gönderim zamanı: ${new Date().toLocaleString('tr-TR')}
  `.trim()

  try {
    // Check if Resend is initialized
    if (!resend) {
      return { 
        success: false, 
        error: 'Email service not configured' 
      }
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || email, // Kendi email adresiniz
      replyTo: email, // Kullanıcının emaili
      subject: `Portfolio İletişim: ${name}`,
      html: htmlContent,
      text: textContent,
    })

    return { success: true, data: response }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Rate limiting check (simple in-memory cache)
 * Production'da Redis kullanılmalı
 */
const rateLimitCache = new Map<string, number>()

export function checkRateLimit(email: string, limitMinutes: number = 5): boolean {
  const now = Date.now()
  const lastSent = rateLimitCache.get(email)

  if (lastSent && now - lastSent < limitMinutes * 60 * 1000) {
    return false // Rate limit exceeded
  }

  rateLimitCache.set(email, now)
  
  // Cleanup old entries (her 10 dakikada bir)
  if (rateLimitCache.size > 100) {
    const tenMinutesAgo = now - 10 * 60 * 1000
    for (const [key, value] of rateLimitCache.entries()) {
      if (value < tenMinutesAgo) {
        rateLimitCache.delete(key)
      }
    }
  }

  return true
}
