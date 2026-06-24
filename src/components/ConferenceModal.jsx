import React from 'react';
import { X, MapPin, CalendarDays, Clock, ExternalLink, Download, Calendar, Bookmark, Navigation } from 'lucide-react';
import { generateIcsFile, generateGoogleCalendarUrl } from '../utils/icsExport';

const ConferenceModal = ({ conference, onClose, onLocate, isFavorite, onToggleFavorite, deadlineStatus }) => {
  const conf = conference;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', paddingRight: '2rem' }}>
            <h2 style={{ paddingRight: '0', margin: 0, lineHeight: 1.2 }}>
              {conf.website !== '#' ? (
                <a 
                  href={conf.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  title="Open official website"
                >
                  {conf.name} <ExternalLink size={18} style={{ opacity: 0.5 }} />
                </a>
              ) : (
                conf.name
              )}
            </h2>
            <button 
              className="fav-button" 
              style={{ marginLeft: '0.75rem', marginTop: '0.1rem', flexShrink: 0 }}
              onClick={() => onToggleFavorite(conf.id)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark size={20} fill={isFavorite ? '#fbbf24' : 'none'} color={isFavorite ? '#fbbf24' : 'var(--text-muted)'} />
            </button>
          </div>
          <div className="badges" style={{ marginTop: '0.75rem' }}>
            <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{conf.type}</span>
            <span className="badge" style={{ 
              background: deadlineStatus.bgColor, 
              color: deadlineStatus.color, 
              border: `1px solid ${deadlineStatus.borderColor}` 
            }}>
              {deadlineStatus.label}
            </span>
            {conf.topics.map(t => (
              <span key={t} className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="modal-body">
          <p className="modal-description">{conf.description}</p>
          
          <div className="modal-details">
            <div className="modal-detail-row">
              <MapPin size={16} color="var(--accent-primary)" />
              <span>{conf.location}</span>
            </div>
            <div className="modal-detail-row">
              <CalendarDays size={16} color="var(--accent-event)" />
              <span>Event: {conf.eventDateStart} → {conf.eventDateEnd}</span>
            </div>
            <div className="modal-detail-row">
              <Clock size={16} color={deadlineStatus.color} />
              <span style={{ color: deadlineStatus.color }}>Deadline: {conf.deadline}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          {conf.coordinates && (conf.coordinates[0] !== 0 || conf.coordinates[1] !== 0) && (
            <button className="glass-button" onClick={() => onLocate(conf.id)}>
              <Navigation size={16} /> Show on Map
            </button>
          )}
          {conf.website !== '#' ? (
            <a href={conf.website} target="_blank" rel="noopener noreferrer" className="glass-button" style={{ textDecoration: 'none' }}>
              <ExternalLink size={16} /> Website
            </a>
          ) : (
            <button className="glass-button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Link not available yet">
              <ExternalLink size={16} /> Website TBA
            </button>
          )}
          <a 
            href={generateGoogleCalendarUrl(conf)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="glass-button"
            style={{ textDecoration: 'none' }}
          >
            <Calendar size={16} /> Google Calendar
          </a>
          <button className="glass-button primary" onClick={() => generateIcsFile(conf)}>
            <Download size={16} /> Download .ICS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConferenceModal;
