import nodemailer from 'nodemailer';

// Configurar el transportador de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailParams {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailParams) => {
    try {
        const info = await transporter.sendMail({
            from: `"EventFlow" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        return { success: true, data: info };
    } catch (error) {
        console.error('Error enviando email con Nodemailer:', error);
        return { success: false, error };
    }
};

/**
 * Plantilla para enviar invitación a un evento
 */
export const sendEventInvitation = async (guestName: string, eventName: string, guestEmail: string) => {
    const subject = `¡Estás invitado a ${eventName}!`;
    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #4f46e5; text-align: center;">¡Hola ${guestName}!</h2>
      <p style="font-size: 16px; color: #374151;">
        Te han invitado formalmente al evento: <strong>${eventName}</strong>.
      </p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">Estamos muy emocionados de contar con tu presencia.</p>
      </div>
      <p style="text-align: center;">
        <a href="#" style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Confirmar Asistencia
        </a>
      </p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        Enviado por EventFlow - Organiza tus eventos con estilo.
      </p>
    </div>
  `;

    return sendEmail({ to: guestEmail, subject, html });
};
