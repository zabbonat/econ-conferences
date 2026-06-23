import * as ics from 'ics';
import { parseISO } from 'date-fns';

export const generateIcsFile = (conference) => {
  const events = [];

  // 1. Add Event for the Conference itself
  const start = parseISO(conference.eventDateStart);
  const end = parseISO(conference.eventDateEnd);
  
  events.push({
    title: `[Conference] ${conference.name}`,
    description: conference.description + `\n\nWebsite: ${conference.website}`,
    location: conference.location,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
    end: [end.getFullYear(), end.getMonth() + 1, end.getDate() + 1], // +1 because end is exclusive in some clients for all-day events
    url: conference.website,
    status: 'CONFIRMED',
    busyStatus: 'BUSY'
  });

  // 2. Add Event for the Deadline
  const deadline = parseISO(conference.deadline);
  events.push({
    title: `[DEADLINE] ${conference.name} Submission`,
    description: `Paper submission deadline for ${conference.name}.\n\nWebsite: ${conference.website}`,
    location: conference.location,
    start: [deadline.getFullYear(), deadline.getMonth() + 1, deadline.getDate()],
    end: [deadline.getFullYear(), deadline.getMonth() + 1, deadline.getDate()],
    url: conference.website,
    status: 'CONFIRMED',
    busyStatus: 'FREE',
    alarms: [
      { action: 'display', description: 'Reminder', trigger: { days: 7, before: true } }
    ]
  });

  const { error, value } = ics.createEvents(events);

  if (error) {
    console.error(error);
    return;
  }

  // Download the file
  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${conference.name.replace(/\s+/g, '_')}_events.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateGoogleCalendarUrl = (conference) => {
  const start = parseISO(conference.eventDateStart);
  // Add one day to end date for Google Calendar all-day event format
  const end = parseISO(conference.eventDateEnd);
  end.setDate(end.getDate() + 1);

  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  };

  const text = encodeURIComponent(`[Conference] ${conference.name}`);
  const dates = `${formatGoogleDate(start)}/${formatGoogleDate(end)}`;
  const details = encodeURIComponent(`${conference.description}\n\nWebsite: ${conference.website}`);
  const location = encodeURIComponent(conference.location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
};

export const generateBulkIcsFile = (conferences) => {
  const events = [];

  conferences.forEach(conference => {
    const start = parseISO(conference.eventDateStart);
    const end = parseISO(conference.eventDateEnd);
    
    events.push({
      title: `[Conference] ${conference.name}`,
      description: conference.description + `\n\nWebsite: ${conference.website}`,
      location: conference.location,
      start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
      end: [end.getFullYear(), end.getMonth() + 1, end.getDate() + 1],
      url: conference.website,
      status: 'CONFIRMED',
      busyStatus: 'BUSY'
    });

    const deadline = parseISO(conference.deadline);
    events.push({
      title: `[DEADLINE] ${conference.name} Submission`,
      description: `Paper submission deadline for ${conference.name}.\n\nWebsite: ${conference.website}`,
      location: conference.location,
      start: [deadline.getFullYear(), deadline.getMonth() + 1, deadline.getDate()],
      end: [deadline.getFullYear(), deadline.getMonth() + 1, deadline.getDate()],
      url: conference.website,
      status: 'CONFIRMED',
      busyStatus: 'FREE',
      alarms: [
        { action: 'display', description: 'Reminder', trigger: { days: 7, before: true } }
      ]
    });
  });

  const { error, value } = ics.createEvents(events);

  if (error) {
    console.error(error);
    return;
  }

  const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `econ_conferences_all.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
