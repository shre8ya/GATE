// Google Calendar & iCalendar (.ICS) Integration Engine for GATE 2027 Command Center

/**
 * Creates a direct Google Calendar Web Event URL
 * Opens directly in user's Google Calendar with all prefilled details
 */
export function createGoogleCalendarUrl({
  title,
  description = '',
  startDate, // YYYY-MM-DD
  startTime = '09:00', // HH:MM
  durationMinutes = 120,
  location = 'Home Study Desk'
}) {
  try {
    const [year, month, day] = startDate.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);

    const startDt = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    const endDt = new Date(startDt.getTime() + durationMinutes * 60 * 1000);

    const formatGDate = (d) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const datesParam = `${formatGDate(startDt)}/${formatGDate(endDt)}`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: datesParam,
      details: description,
      location: location,
      sprop: 'website:gate2027.study'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (err) {
    console.error('Failed to create Google Calendar URL:', err);
    return 'https://calendar.google.com/';
  }
}

/**
 * Builds Google Calendar URL for Today's complete study mission
 */
export function getTodayGoogleCalendarUrl(masterItem, mathsItem, aptItem) {
  if (!masterItem) return 'https://calendar.google.com/';

  const subject = masterItem.subject || 'GATE CSE 2027';
  const mainFocus = masterItem.mainFocus || 'Daily Study Block';
  const mathsTopic = mathsItem?.lectureTopic || masterItem.mathsLecture || 'Engineering Maths';
  const aptTopic = aptItem?.topic || 'General Aptitude';

  const title = `GATE 2027 Study: ${subject} & Maths`;

  let description = `🎯 GATE 2027 DAILY MISSION\n`;
  description += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  description += `[Phase 1 • Aptitude] ${aptTopic} (${masterItem.easyStartMin || 15}m)\n`;
  if (aptItem?.sourceUrl) description += `• Course: ${aptItem.sourceUrl}\n`;
  if (aptItem?.searchUrl) description += `• Video: ${aptItem.searchUrl}\n\n`;

  description += `[Phase 2 • Engg Maths] ${mathsTopic} (${masterItem.mathsMin || 30}m)\n`;
  if (mathsItem?.playlistUrl) description += `• Playlist: ${mathsItem.playlistUrl}\n`;
  if (mathsItem?.searchUrl) description += `• Video: ${mathsItem.searchUrl}\n\n`;

  description += `[Phase 3 • Core Focus] ${subject}: ${mainFocus} (${masterItem.mainBlockMin || 55}m)\n\n`;
  description += `[Phase 4 • Practice] PYQ Target & Short Notes (${masterItem.practiceMin || 20}m)\n\n`;
  description += `Total Planned: ${masterItem.totalHrs || 2.0} Hours\n`;
  description += `Created via GATE 2027 Personalized Command Center`;

  return createGoogleCalendarUrl({
    title,
    description,
    startDate: masterItem.date,
    startTime: '09:00',
    durationMinutes: Math.round((masterItem.totalHrs || 2.0) * 60)
  });
}

/**
 * Generates an RFC 5545 standard .ICS iCalendar file for all planner dates and custom events
 * Triggers a browser download so the user can import everything into Google Calendar in 1 click
 */
export function downloadIcsSchedule(masterSchedule = [], customEvents = {}) {
  const pad = (n) => (n < 10 ? '0' + n : n);

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GATE 2027 Personalized Command Center//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:GATE CSE 2027 Study Plan & Milestones',
    'X-WR-TIMEZONE:Asia/Kolkata'
  ];

  // Helper for ICS Date format (all-day event or timed)
  const formatIcsDate = (dateStr) => dateStr.replace(/-/g, '');

  // Add Master Planner items
  masterSchedule.forEach((item) => {
    if (!item.date) return;
    const cleanDate = formatIcsDate(item.date);
    const uid = `gate-${item.id || item.date}@gate2027.study`;

    let summary = `[GATE] ${item.subject}: ${item.mainFocus.replace(/Day \d+:\s*/, '')}`;
    let desc = `Subject: ${item.subject}\\nFocus: ${item.mainFocus}\\nMaths: ${item.mathsLecture || 'None'}\\nPlanned: ${item.totalHrs} hrs`;

    // Next day for DTEND in all-day events
    const d = new Date(item.date);
    d.setDate(d.getDate() + 1);
    const nextDate = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

    icsContent.push('BEGIN:VEVENT');
    icsContent.push(`UID:${uid}`);
    icsContent.push(`DTSTAMP:${formatIcsDate(new Date().toISOString().slice(0, 10))}T000000Z`);
    icsContent.push(`DTSTART;VALUE=DATE:${cleanDate}`);
    icsContent.push(`DTEND;VALUE=DATE:${nextDate}`);
    icsContent.push(`SUMMARY:${summary}`);
    icsContent.push(`DESCRIPTION:${desc}`);
    icsContent.push('STATUS:CONFIRMED');
    icsContent.push('END:VEVENT');
  });

  // Add Custom User Events
  Object.entries(customEvents).forEach(([dateStr, eventsList]) => {
    if (!Array.isArray(eventsList)) return;
    const cleanDate = formatIcsDate(dateStr);

    eventsList.forEach((ev, idx) => {
      const uid = `custom-${dateStr}-${ev.id || idx}@gate2027.study`;
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 1);
      const nextDate = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:${uid}`);
      icsContent.push(`DTSTAMP:${formatIcsDate(new Date().toISOString().slice(0, 10))}T000000Z`);
      icsContent.push(`DTSTART;VALUE=DATE:${cleanDate}`);
      icsContent.push(`DTEND;VALUE=DATE:${nextDate}`);
      icsContent.push(`SUMMARY:[Custom] ${ev.title || 'Study Task'}`);
      icsContent.push(`DESCRIPTION:Category: ${ev.category || 'General'}\\nNotes: ${ev.notes || ''}`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('END:VEVENT');
    });
  });

  // Add Special Milestones (GATE Exam Day & IPU Exams)
  icsContent.push('BEGIN:VEVENT');
  icsContent.push('UID:gate-2027-exam-day@gate2027.study');
  icsContent.push(`DTSTAMP:20261013T000000Z`);
  icsContent.push('DTSTART;VALUE=DATE:20270213');
  icsContent.push('DTEND;VALUE=DATE:20270214');
  icsContent.push('SUMMARY:🎯 GATE 2027 D-DAY (IIT Madras CSE Exam)');
  icsContent.push('DESCRIPTION:Official GATE 2027 Exam Day organized by IIT Madras. Go conquer your dream rank!');
  icsContent.push('STATUS:CONFIRMED');
  icsContent.push('END:VEVENT');

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GATE_2027_Study_Schedule.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
