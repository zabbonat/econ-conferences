import React, { useMemo, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views, Navigate } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Custom toolbar with month/year selectors and arrow navigation
const CustomToolbar = ({ date, onNavigate, view, onView }) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  const goBack = () => onNavigate(Navigate.PREVIOUS);
  const goNext = () => onNavigate(Navigate.NEXT);
  const goToday = () => onNavigate(Navigate.TODAY);

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    onNavigate(Navigate.DATE, new Date(year, newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    onNavigate(Navigate.DATE, new Date(newYear, month, 1));
  };

  return (
    <div className="cal-custom-toolbar">
      <div className="cal-nav-group">
        <button className="cal-nav-btn" onClick={goBack} title="Previous month">
          <ChevronLeft size={18} />
        </button>

        <select className="cal-select" value={month} onChange={handleMonthChange}>
          {MONTHS.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        <select className="cal-select cal-select-year" value={year} onChange={handleYearChange}>
          {[2026, 2027, 2028].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button className="cal-nav-btn" onClick={goNext} title="Next month">
          <ChevronRight size={18} />
        </button>

        <button className="cal-today-btn" onClick={goToday}>
          <CalIcon size={14} /> Today
        </button>
      </div>

      <div className="cal-view-group">
        <button 
          className={`cal-view-btn ${view === Views.MONTH ? 'active' : ''}`}
          onClick={() => onView(Views.MONTH)}
        >
          Month
        </button>
        <button 
          className={`cal-view-btn ${view === Views.AGENDA ? 'active' : ''}`}
          onClick={() => onView(Views.AGENDA)}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

const CalendarView = ({ conferences }) => {
  const [showDeadlines, setShowDeadlines] = useState(true);

  const events = useMemo(() => {
    const allEvents = [];
    conferences.forEach(conf => {
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
      return { style: { background: 'rgba(59, 130, 246, 0.12)' } };
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
        components={{
          toolbar: CustomToolbar,
        }}
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
