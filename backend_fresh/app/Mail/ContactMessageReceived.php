<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMessageReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        $subject = $this->contactMessage->subject
            ? 'New Message: ' . $this->contactMessage->subject
            : 'New Contact Form Message from ' . $this->contactMessage->name;

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(htmlString: $this->buildHtml());
    }

    private function initials(string $name): string
    {
        $parts = array_filter(explode(' ', $name));
        $i = implode('', array_map(fn($p) => strtoupper($p[0]), array_slice($parts, 0, 2)));
        return e($i ?: '?');
    }

    private function buildHtml(): string
    {
        $msg     = $this->contactMessage;
        $name    = e($msg->name);
        $email   = e($msg->email);
        $phone   = $msg->phone   ? e($msg->phone)   : null;
        $subject = $msg->subject ? e($msg->subject)  : null;
        $body    = nl2br(e($msg->message));
        $date    = $msg->created_at->format('l, d F Y \a\t g:ia');
        $initials     = $this->initials($msg->name);
        $replySubject = rawurlencode('Re: ' . ($msg->subject ?: 'Your enquiry'));

        $phoneRow = $phone ? "
                    <tr>
                      <td style=\"padding:10px 0;border-bottom:1px solid #f1f5f9;vertical-align:top\">
                        <span style=\"display:inline-block;background:#f0fdf4;color:#16a34a;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:20px\">Phone</span>
                      </td>
                      <td style=\"padding:10px 0 10px 16px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b\">{$phone}</td>
                    </tr>" : '';

        $subjectRow = $subject ? "
                    <tr>
                      <td style=\"padding:10px 0;vertical-align:top\">
                        <span style=\"display:inline-block;background:#fefce8;color:#ca8a04;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:20px\">Subject</span>
                      </td>
                      <td style=\"padding:10px 0 10px 16px;font-size:14px;color:#1e293b;font-weight:500\">{$subject}</td>
                    </tr>" : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:32px 16px 48px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

        <!-- ── HEADER BANNER ── -->
        <tr><td style="background:linear-gradient(135deg,#1255a0 0%,#1B72B5 60%,#2389d4 100%);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center">
          <!-- practice name -->
          <p style="margin:0 0 2px;color:rgba(255,255,255,0.60);font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase">From</p>
          <h1 style="margin:0 0 18px;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.3px;line-height:1.3">Lakemba General<br>Medical Practice</h1>
          <div style="width:40px;height:2px;background:rgba(255,255,255,0.35);margin:0 auto 18px;border-radius:2px"></div>
          <!-- envelope icon -->
          <div style="width:52px;height:52px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 14px;line-height:52px;text-align:center;font-size:24px">&#9993;</div>
          <p style="margin:0 0 4px;color:#ffffff;font-size:18px;font-weight:600">New Message Received</p>
          <p style="margin:0;color:rgba(255,255,255,0.65);font-size:13px">{$date}</p>
        </td></tr>

        <!-- ── SENDER CARD ── -->
        <tr><td style="background:#ffffff;padding:0 40px">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;background:#f8fafc;border-radius:14px;overflow:hidden;border:1px solid #e8eef5">
            <!-- sender header row -->
            <tr><td style="background:#1B72B5;padding:14px 20px" colspan="2">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:40px;height:40px;background:rgba(255,255,255,0.25);border-radius:50%;text-align:center;vertical-align:middle;font-size:15px;font-weight:700;color:#ffffff;line-height:40px">{$initials}</td>
                <td style="padding-left:12px">
                  <div style="color:#ffffff;font-size:15px;font-weight:600">{$name}</div>
                  <div style="color:rgba(255,255,255,0.75);font-size:12px;margin-top:1px">Message sender</div>
                </td>
              </tr></table>
            </td></tr>
            <!-- detail rows -->
            <tr><td style="padding:0 20px" colspan="2">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;vertical-align:top">
                    <span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;padding:3px 8px;border-radius:20px">Email</span>
                  </td>
                  <td style="padding:12px 0 12px 16px;border-bottom:1px solid #f1f5f9;font-size:14px">
                    <a href="mailto:{$email}" style="color:#1B72B5;text-decoration:none;font-weight:500">{$email}</a>
                  </td>
                </tr>
                {$phoneRow}
                {$subjectRow}
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- ── MESSAGE BODY ── -->
        <tr><td style="background:#ffffff;padding:28px 40px 0">
          <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px">Message</p>
          <div style="background:#f8fafc;border:1px solid #e8eef5;border-left:4px solid #1B72B5;border-radius:0 12px 12px 0;padding:20px 24px">
            <p style="margin:0;font-size:15px;line-height:1.8;color:#1e293b">{$body}</p>
          </div>
        </td></tr>

        <!-- ── REPLY BUTTON ── -->
        <tr><td style="background:#ffffff;padding:28px 40px 36px;text-align:center">
          <a href="mailto:{$email}?subject={$replySubject}"
             style="display:inline-block;background:#6BBE44;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:50px;letter-spacing:0.2px;box-shadow:0 4px 12px rgba(107,190,68,0.35)">
            &#10148;&nbsp; Reply to {$name}
          </a>
        </td></tr>

        <!-- ── DIVIDER ── -->
        <tr><td style="background:#ffffff;padding:0 40px">
          <hr style="border:none;border-top:1px solid #f1f5f9;margin:0">
        </td></tr>

        <!-- ── FOOTER ── -->
        <tr><td style="background:#ffffff;border-radius:0 0 16px 16px;padding:20px 40px 28px;text-align:center">
          <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.7">
            This notification was sent automatically by the<br>
            <strong style="color:#64748b">Lakemba General Medical Practice</strong> admin system.<br>
            Do not reply to this email directly.
          </p>
        </td></tr>

        <!-- ── BOTTOM SPACER ── -->
        <tr><td style="padding-top:24px;text-align:center">
          <p style="margin:0;font-size:11px;color:#b0bec5">&#169; Lakemba General Medical Practice &bull; Lakemba NSW 2195</p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
HTML;
    }
}
