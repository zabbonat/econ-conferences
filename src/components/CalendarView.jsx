import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ conferences }) => {
  const events = useMemo(() => {
    const allEvents = [];
    conferences.forEach(conf => {
      // Conference Event
      allEvents.push({
        id: `${conf.id}-event`,
        title: conf.name,
        start: new Date(conf.eventDateStart),
        end: new Date(conf.eventDateEnd),
        allDay: true,
        type: 'conference',
        resource: conf
      });

      // Deadline Event
      allEvents.push({
        id: `${conf.id}-deadline`,
        title: `[DEADLINE] ${conf.name}`,
        start: new Date(conf.deadline),
        end: new Date(conf.deadline),
        allDay: true,
        type: 'deadline',
        resource: conf
      });
    });
    return allEvents;
  }, [conferences]);

  const eventPropGetter = (event) => {
    let className = '';
    if (event.type === 'deadline') {
      className = 'event-deadline';
    } else if (event.type === 'conference') {
      className = 'event-conference';
    }
    return { className };
  };

  return (
    <div className="glass-panel" style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ flex: 1 }}
        eventPropGetter={eventPropGetter}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.AGENDA]}
      />
    </div>
  );
};

export default CalendarView;
