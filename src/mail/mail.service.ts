import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendQrEmail(to: string, name: string, qrBuffer: Buffer) {
    await this.transporter.sendMail({
      from: `"Tu Empresa" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Tu código QR de acceso',
      html: `<p>Hola ${name}, este es tu código QR para ingresar a los salones:</p>
             <img src="cid:qrcode" />`,
      attachments: [
        {
          filename: 'qr.png',
          content: qrBuffer,
          cid: 'qrcode', // referenciado en el <img>
        },
      ],
    });
  }
}
