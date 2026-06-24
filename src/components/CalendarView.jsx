import React, { useMemo, useState } from 'react';
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

const typeColors = {
  'Conference': { bg: 'rgba(59, 130, 246, 0.85)', border: '#2563eb' },
  'Workshop': { bg: 'rgba(139, 92, 246, 0.85)', border: '#7c3aed' },
  'Summer School': { bg: 'rgba(245, 158, 11, 0.85)', border: '#d97706' },
};

const CalendarView = ({ conferences }) => {
  const [showDeadlines, setShowDeadlines] = useState(true);

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
        confType: conf.type,
        resource: conf
      });

      // Deadline Event
      if (showDeadlines) {
        allEvents.push({
          id: `${conf.id}-deadline`,
          title: `⏰ ${conf.name}`,
          start: new Date(conf.deadline),
          end: new Date(conf.deadline),
          allDay: true,
          type: 'deadline',
          confType: conf.type,
          resource: conf
        });
      }
    });
    return allEvents;
  }, [conferences, showDeadlines]);

  const eventPropGetter = (event) => {
    if (event.type === 'deadline') {
      return {
        style: {
          background: 'rgba(239, 68, 68, 0.85)',
          border: '1px solid #dc2626',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '0.75rem',
          padding: '1px 4px',
          fontWeight: '500',
        }
      };
    }
    
    const colors = typeColors[event.confType] || typeColors['Conference'];
    return {
      style: {
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: '#fff',
        borderRadius: '4px',
        fontSize: '0.75rem',
        padding: '1px 4px',
        fontWeight: '500',
      }
    };
  };

  const dayPropGetter = (date) => {
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() && 
                    date.getFullYear() === today.getFullYear();
    if (isToday) {
      return {
        style: {
          background: 'rgba(59, 130, 246, 0.12)',
        }
      };
    }
    return {};
  };

  return (
    <div className="glass-panel calendar-container">
      {/* Calendar Legend & Controls */}
      <div className="calendar-toolbar">
        <div className="calendar-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }}></span> Conference</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#8b5cf6' }}></span> Workshop</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span> Summer School</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }}></span> Deadline</div>
        </div>
        <label className="calendar-toggle">
          <input 
            type="checkbox" 
            checked={showDeadlines} 
            onChange={(e) => setShowDeadlines(e.target.checked)} 
          />
          <span>Show Deadlines</span>
        </label>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ flex: 1 }}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.AGENDA]}
        defaultDate={new Date(2026, 5, 1)}
        popup
        tooltipAccessor={(event) => `${event.title}\n${event.resource?.location || ''}`}
        formats={{
          monthHeaderFormat: (date) => format(date, 'MMMM yyyy'),
          dayHeaderFormat: (date) => format(date, 'EEEE, MMMM d'),
          agendaDateFormat: (date) => format(date, 'EEE MMM d'),
        }}
      />
    </div>
  );
};

export default CalendarView;
