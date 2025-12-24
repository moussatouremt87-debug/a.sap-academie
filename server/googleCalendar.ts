import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Calendar not connected');
  }
  return accessToken;
}

export async function getGoogleCalendarClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function getAvailableSlots(daysAhead: number = 5): Promise<{date: string, time: string, datetime: string}[]> {
  const calendar = await getGoogleCalendarClient();
  
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysAhead);
  
  const slots: {date: string, time: string, datetime: string}[] = [];
  
  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: 'primary' }]
      }
    });
    
    const busySlots = response.data.calendars?.primary?.busy || [];
    
    const workingHours = [9, 10, 11, 14, 15, 16, 17];
    
    for (let d = 1; d <= daysAhead; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const hour of workingHours) {
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1);
        
        if (slotStart <= now) continue;
        
        const isBusy = busySlots.some(busy => {
          const busyStart = new Date(busy.start!);
          const busyEnd = new Date(busy.end!);
          return (slotStart < busyEnd && slotEnd > busyStart);
        });
        
        if (!isBusy) {
          const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
          const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
          
          slots.push({
            date: `${dayNames[slotStart.getDay()]} ${slotStart.getDate()} ${monthNames[slotStart.getMonth()]}`,
            time: `${hour}h00`,
            datetime: slotStart.toISOString()
          });
        }
        
        if (slots.length >= 6) break;
      }
      if (slots.length >= 6) break;
    }
  } catch (error) {
    console.error('Error fetching calendar:', error);
    const workingHours = [9, 10, 14, 15, 16];
    
    for (let d = 1; d <= 3 && slots.length < 6; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const hour of workingHours) {
        if (slots.length >= 6) break;
        
        const slotStart = new Date(date);
        slotStart.setHours(hour, 0, 0, 0);
        
        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        
        slots.push({
          date: `${dayNames[slotStart.getDay()]} ${slotStart.getDate()} ${monthNames[slotStart.getMonth()]}`,
          time: `${hour}h00`,
          datetime: slotStart.toISOString()
        });
      }
    }
  }
  
  return slots;
}

export async function createGoogleMeetEvent(
  attendeeEmail: string,
  datetime: string,
  duration: number = 30
): Promise<{ meetLink: string; eventId: string }> {
  const calendar = await getGoogleCalendarClient();
  
  const startTime = new Date(datetime);
  const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
  
  const event = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    sendUpdates: 'all',
    requestBody: {
      summary: 'Consultation A.SAP - Académie Internationale SAP',
      description: `Bonjour,

Merci pour votre intérêt pour A.SAP SARL !

Cette réunion vous permettra de:
- Discuter de vos besoins en transformation digitale et SAP
- Explorer nos formations SAP (courtes et longues durées)
- Obtenir des conseils personnalisés de nos experts certifiés

A.SAP - Académie Internationale SAP
SICAP Liberté 2, Villa N°1690 - Dakar, Sénégal
Votre partenaire de confiance pour la transformation digitale en Afrique de l'Ouest.

Cordialement,
L'équipe A.SAP`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Africa/Dakar'
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Africa/Dakar'
      },
      attendees: [
        { email: attendeeEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `asap-meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 }
        ]
      }
    }
  });
  
  const meetLink = event.data.hangoutLink || event.data.conferenceData?.entryPoints?.[0]?.uri || '';
  
  return {
    meetLink,
    eventId: event.data.id || ''
  };
}
