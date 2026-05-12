<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageReply extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ContactMessage $contactMessage,
        public string $replyBody
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->contactMessage->subject
            ? 'Re: ' . $this->contactMessage->subject
            : 'Re: Your enquiry – Lakemba General Medical Practice';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function buildHtml(): string
    {
        $name        = e($this->contactMessage->name);
        $replyBody   = nl2br(e($this->replyBody));
        $originalMsg = nl2br(e($this->contactMessage->message));
        $date        = $this->contactMessage->created_at->format('d M Y \a\t g:ia');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reply from Lakemba General Medical Practice</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',Arial,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:32px 16px 48px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1255a0 0%,#1B72B5 60%,#2389d4 100%);border-radius:16px 16px 0 0;padding:36px 40px 28px;text-align:center">
          <p style="margin:0 0 4px;color:rgba(255,255,255,0.60);font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase">From</p>
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.2px;line-height:1.3">Lakemba General<br>Medical Practice</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px 0">
          <p style="margin:0 0 20px;font-size:16px;color:#1e293b">Dear {$name},</p>

          <!-- Reply text -->
          <div style="font-size:15px;line-height:1.8;color:#1e293b;margin-bottom:32px">{$replyBody}</div>

          <!-- Divider -->
          <hr style="border:none;border-top:1px solid #e8eef5;margin:0 0 24px">

          <!-- Original message -->
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Your original message — {$date}</p>
          <div style="background:#f8fafc;border-left:3px solid #cbd5e1;border-radius:0 8px 8px 0;padding:14px 18px;font-size:13px;line-height:1.7;color:#64748b">{$originalMsg}</div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center">
          <hr style="border:none;border-top:1px solid #f1f5f9;margin:0 0 20px">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7">
            <strong style="color:#64748b">Lakemba General Medical Practice</strong><br>
            Lakemba NSW 2195 &bull; <a href="tel:0297591234" style="color:#1B72B5;text-decoration:none">(02) 9759 1234</a>
          </p>
        </td></tr>

        <!-- Bottom -->
        <tr><td style="padding-top:20px;text-align:center">
          <p style="margin:0;font-size:11px;color:#b0bec5">&#169; Lakemba General Medical Practice</p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
HTML;
    }
}
