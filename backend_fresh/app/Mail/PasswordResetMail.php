<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $name,
        public readonly string $resetUrl,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Your Password – Lakemba GMP Admin');
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function buildHtml(): string
    {
        $name      = htmlspecialchars($this->name);
        $resetUrl  = htmlspecialchars($this->resetUrl);
        $expiry    = '60 minutes';

        return <<<HTML
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
            <tr><td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

                <!-- Header -->
                <tr><td style="background:linear-gradient(135deg,#0D3858 0%,#1B72B5 100%);border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.5);">ADMIN PANEL</p>
                  <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Lakemba General<br>Medical Practice</h1>
                  <div style="margin:16px auto 0;width:40px;height:2px;background:#6BBE44;border-radius:2px;"></div>
                </td></tr>

                <!-- Body -->
                <tr><td style="background:#ffffff;padding:36px 32px;">
                  <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0D3858;">Reset Your Password</h2>
                  <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
                    Hi <strong style="color:#1B72B5;">{$name}</strong>, we received a request to reset your password.
                    Click the button below to set a new one.
                  </p>

                  <!-- CTA Button -->
                  <div style="text-align:center;margin:28px 0;">
                    <a href="{$resetUrl}"
                      style="display:inline-block;padding:14px 36px;background:#6BBE44;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.2px;">
                      Reset My Password
                    </a>
                  </div>

                  <!-- Expiry notice -->
                  <div style="background:#FEF9C3;border:1px solid #FDE047;border-radius:10px;padding:12px 16px;margin:24px 0;">
                    <p style="margin:0;font-size:13px;color:#854D0E;">
                      ⚠️ This link expires in <strong>{$expiry}</strong>. If you didn't request a reset, you can safely ignore this email.
                    </p>
                  </div>

                  <!-- Fallback URL -->
                  <p style="font-size:12px;color:#94a3b8;margin:20px 0 0;line-height:1.6;">
                    If the button doesn't work, copy and paste this link:<br>
                    <a href="{$resetUrl}" style="color:#1B72B5;word-break:break-all;">{$resetUrl}</a>
                  </p>
                </td></tr>

                <!-- Footer -->
                <tr><td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">Lakemba General Medical Practice &nbsp;|&nbsp; (02) 9759 1234</p>
                  <p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;">This is an automated message. Please do not reply.</p>
                </td></tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
        HTML;
    }
}
