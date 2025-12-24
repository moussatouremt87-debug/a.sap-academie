import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'A.SAP Consulting <noreply@asap-consulting.com>';
const APP_URL = process.env.APP_URL || 'https://asap-consulting.com';

interface EmailResult {
  success: boolean;
  error?: string;
}

export async function sendEnrollmentConfirmation(
  to: string,
  data: {
    firstName: string;
    lastName: string;
    formationTitle: string;
    formationCategory?: string;
    enrollmentDate: Date;
  }
): Promise<EmailResult> {
  if (!resend) {
    console.log('[Email] Resend not configured, skipping enrollment confirmation email to:', to);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const formattedDate = data.enrollmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Confirmation d'inscription - ${data.formationTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #003366 0%, #0070F3 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .highlight-box { background: #f8f9fa; border-left: 4px solid #F4AB3A; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
            .info-row { display: flex; margin: 10px 0; }
            .info-label { font-weight: bold; color: #666; min-width: 120px; }
            .button { display: inline-block; background: #0070F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>A.SAP Consulting</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Académie Internationale SAP</p>
            </div>
            <div class="content">
              <h2>Bienvenue ${data.firstName} !</h2>
              <p>Nous avons le plaisir de confirmer votre inscription à notre formation.</p>
              
              <div class="highlight-box">
                <h3 style="margin-top: 0; color: #003366;">${data.formationTitle}</h3>
                ${data.formationCategory ? `<p style="margin: 5px 0;"><strong>Catégorie:</strong> ${data.formationCategory}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Date d'inscription:</strong> ${formattedDate}</p>
              </div>
              
              <p>Vous pouvez dès maintenant accéder à votre espace apprenant pour :</p>
              <ul>
                <li>Consulter le contenu de votre formation</li>
                <li>Suivre votre progression</li>
                <li>Accéder aux ressources pédagogiques</li>
              </ul>
              
              <a href="${APP_URL}/espace-apprenant" class="button">
                Accéder à mon espace
              </a>
              
              <p style="margin-top: 30px;">Notre équipe reste à votre disposition pour toute question.</p>
              <p>Cordialement,<br><strong>L'équipe A.SAP Consulting</strong></p>
            </div>
            <div class="footer">
              <p>A.SAP SARL - SICAP Liberté 2, Villa N°1690, Dakar, Sénégal</p>
              <p>Capital: 1 000 000 FCFA</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('[Email] Enrollment confirmation sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send enrollment confirmation:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendMeetingConfirmation(
  to: string,
  data: {
    datetime: Date;
    duration: number;
    meetLink: string;
    commercialName?: string;
  }
): Promise<EmailResult> {
  if (!resend) {
    console.log('[Email] Resend not configured, skipping meeting confirmation email to:', to);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const formattedDate = data.datetime.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const formattedTime = data.datetime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const endTime = new Date(data.datetime.getTime() + data.duration * 60000);
    const formattedEndTime = endTime.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Confirmation de votre rendez-vous - A.SAP Consulting`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #003366 0%, #0070F3 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .meeting-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #0070F3; padding: 25px; margin: 20px 0; border-radius: 12px; text-align: center; }
            .meeting-date { font-size: 20px; font-weight: bold; color: #003366; margin-bottom: 10px; }
            .meeting-time { font-size: 18px; color: #0070F3; margin-bottom: 15px; }
            .button { display: inline-block; background: #0070F3; color: white; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; }
            .button:hover { background: #0056b3; }
            .info-section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .icon { font-size: 40px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>A.SAP Consulting</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre rendez-vous est confirmé !</p>
            </div>
            <div class="content">
              <p>Bonjour,</p>
              <p>Nous vous confirmons votre rendez-vous avec notre équipe commerciale.</p>
              
              <div class="meeting-box">
                <div class="icon">📅</div>
                <div class="meeting-date">${formattedDate}</div>
                <div class="meeting-time">${formattedTime} - ${formattedEndTime} (${data.duration} min)</div>
                ${data.commercialName ? `<p style="color: #666; margin: 10px 0 0 0;">Avec: ${data.commercialName}</p>` : ''}
                <br>
                <a href="${data.meetLink}" class="button">
                  Rejoindre la réunion Google Meet
                </a>
              </div>
              
              <div class="info-section">
                <h3 style="margin-top: 0;">📋 Avant votre rendez-vous</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Préparez vos questions sur nos services</li>
                  <li>Vérifiez votre connexion internet</li>
                  <li>Testez votre micro et caméra si nécessaire</li>
                </ul>
              </div>
              
              <p><strong>Lien de la réunion:</strong><br>
              <a href="${data.meetLink}" style="color: #0070F3;">${data.meetLink}</a></p>
              
              <p style="margin-top: 30px;">Nous avons hâte de vous rencontrer !</p>
              <p>Cordialement,<br><strong>L'équipe A.SAP Consulting</strong></p>
            </div>
            <div class="footer">
              <p>A.SAP SARL - SICAP Liberté 2, Villa N°1690, Dakar, Sénégal</p>
              <p>Capital: 1 000 000 FCFA</p>
              <p style="margin-top: 10px; font-size: 11px;">
                Si vous ne pouvez pas assister au rendez-vous, merci de nous prévenir en répondant à cet email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('[Email] Meeting confirmation sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send meeting confirmation:', error);
    return { success: false, error: String(error) };
  }
}

export function isEmailConfigured(): boolean {
  return !!resend;
}
