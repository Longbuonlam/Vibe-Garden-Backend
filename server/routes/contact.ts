import { Router, Request, Response } from 'express';
import nodemailer from 'nodemailer';

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
}

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body as ContactRequestBody;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;

    if (!gmailUser || !gmailPass) {
      return res.status(500).json({ success: false, error: 'Email credentials not configured on server' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111">
        <h3>Tiêm hoa có nàng nhận được 1 tin nhắn mới</h3>
        <p><strong>Khách hàng:</strong> ${name} (${email})</p>
        <p><strong>Tin nhắn:</strong></p>
        <blockquote style="background:#f8f8f8;padding:12px;border-left:4px solid #e6e6e6">${String(message)}</blockquote>
        <p style="color:#888;font-size:12px;margin-top:12px">This email was generated automatically by Tiệm hoa có nàng.</p>
      </div>
    `;

    const mailOptions = {
      from: gmailUser,
      to: 'sonlong2302@gmail.com',
      subject: `Tiệm hoa có nàng nhận được 1 tin nhắn mới từ ${name}`,
      html,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err: any) {
    const message = err?.message ?? 'Failed to send message';
    return res.status(500).json({ success: false, error: message });
  }
});

export default router;
