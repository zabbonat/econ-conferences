import React, { useState, useMemo, useCallback } from 'react';
import { Map, Calendar as CalendarIcon, MapPin, CalendarDays, ExternalLink, Download, Star, Clock, AlertTriangle, CheckCircle, XCircle, BarChart3, Globe, BookOpen, GraduationCap, Bookmark, X } from 'lucide-react';
import MapLayout from './components/MapLayout';
import CalendarView from './components/CalendarView';
import FilterBar from './components/FilterBar';
import StatsBar from './components/StatsBar';
import ConferenceModal from './components/ConferenceModal';
import conferencesData from './data/conferences.json';
import { generateIcsFile, generateGoogleCalendarUrl, generateBulkIcsFile } from './utils/icsExport';

function getDeadlineStatus(deadlineStr) {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: 'Expired', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.15)', borderColor: 'rgba(107, 114, 128, 0.3)' };
  if (diffDays <= 30) return { label: `${diffDays}d left`, color: '#fbbf24', bgColor: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.3)' };
  return { label: 'Open', color: '#34d399', bgColor: 'rgba(52, 211, 153, 0.15)', borderColor: 'rgba(52, 211, 153, 0.3)' };
}

function App() {
  const [activeView, setActiveView] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const [topicFilter, setTopicFilter] = useState(null);
  const [hidePast, setHidePast] = useState(true);
  const [yearFilter, setYearFilter] = useState('2026');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('econ-favorites') || '[]'); } catch { return []; }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [modalConference, setModalConference] = useState(null);
  const [deadlineFilter, setDeadlineFilter] = useState(null); // 'open' | 'urgent' | null
  const [activeStatFilter, setActiveStatFilter] = useState(null);

  const toggleFavorite = useCallback((confId) => {
    setFavorites(prev => {
      const next = prev.includes(confId) ? prev.filter(id => id !== confId) : [...prev, confId];
      localStorage.setItem('econ-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  // All available years from data
  const availableYears = useMemo(() => {
    const years = new Set();
    conferencesData.forEach(conf => {
      const year = new Date(conf.eventDateStart).getFullYear();
      if (year >= 2026) {
        years.add(year.toString());
      }
    });
    return ['All', ...Array.from(years).sort()];
  }, []);

  // All unique topics
  const allTopics = useMemo(() => {
    const topics = new Set();
    conferencesData.forEach(conf => conf.topics.forEach(t => topics.add(t)));
    return Array.from(topics).sort();
  }, []);

  const filteredConferences = useMemo(() => {
    const now = new Date();
    return conferencesData.filter(conf => {
      const matchesSearch = conf.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            conf.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            conf.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || conf.type === typeFilter;
      const matchesTopic = !topicFilter || conf.topics.includes(topicFilter);
      const eventDate = new Date(conf.eventDateEnd || conf.eventDateStart);
      const matchesPast = !hidePast || eventDate >= now;
      const confYear = new Date(conf.eventDateStart).getFullYear().toString();
      const matchesYear = yearFilter === 'All' || confYear === yearFilter;
      const matchesFav = !showFavoritesOnly || favorites.includes(conf.id);
      
      // Deadline filter
      let matchesDeadline = true;
      if (deadlineFilter === 'open') {
        matchesDeadline = new Date(conf.deadline) >= now;
      } else if (deadlineFilter === 'urgent') {
        const diff = Math.ceil((new Date(conf.deadline) - now) / (1000 * 60 * 60 * 24));
        matchesDeadline = diff >= 0 && diff <= 30;
      }
      
      return matchesSearch && matchesType && matchesTopic && matchesPast && matchesYear && matchesFav && matchesDeadline;
    });
  }, [searchTerm, typeFilter, topicFilter, hidePast, yearFilter, showFavoritesOnly, favorites, deadlineFilter]);

  const handleCardClick = (conf) => {
    setModalConference(conf);
  };

  const handleLocateOnMap = (confId) => {
    setSelectedConferenceId(confId);
    setActiveView('map');
    setModalConference(null);
  };

  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <h1 className="app-title">
          <CalendarDays size={28} color="var(--accent-primary)" />
          Econ Conferences Tracker
        </h1>
      </header>

      <StatsBar 
        conferences={filteredConferences} 
        allConferences={conferencesData}
        activeStatFilter={activeStatFilter}
        onFilterType={(type) => {
          if (activeStatFilter === type) {
            setTypeFilter('All');
            setActiveStatFilter(null);
          } else {
            setTypeFilter(type);
            setDeadlineFilter(null);
            setActiveStatFilter(type);
          }
        }}
        onFilterDeadline={(mode) => {
          if (activeStatFilter === mode) {
            setDeadlineFilter(null);
            setActiveStatFilter(null);
          } else {
            setDeadlineFilter(mode);
            setTypeFilter('All');
            setActiveStatFilter(mode);
          }
        }}
      />

      <FilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        typeFilter={typeFilter} 
        setTypeFilter={setTypeFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        availableYears={availableYears}
        hidePast={hidePast}
        setHidePast={setHidePast}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        onExportAll={() => generateBulkIcsFile(filteredConferences)}
      />

      <main className="main-content">
        <aside className="sidebar glass-panel" style={{ padding: '1rem' }}>
          <div className="view-toggle">
            <button 
              className={activeView === 'map' ? 'active' : ''} 
              onClick={() => setActiveView('map')}
            >
              <Map size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Map
            </button>
            <button 
              className={activeView === 'calendar' ? 'active' : ''} 
              onClick={() => setActiveView('calendar')}
            >
              <CalendarIcon size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> Calendar
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Showing {filteredConferences.length} events
          </div>

          <div className="conference-list">
            {filteredConferences.map(conf => {
              const status = getDeadlineStatus(conf.deadline);
              const isFav = favorites.includes(conf.id);
              return (
                <div 
                  key={conf.id} 
                  className="conference-card"
                  onClick={() => handleCardClick(conf)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ flex: 1 }}>{conf.name}</h3>
                    <button 
                      className="fav-button"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(conf.id); }}
                    >
                      <Bookmark size={16} fill={isFav ? '#fbbf24' : 'none'} color={isFav ? '#fbbf24' : 'var(--text-muted)'} />
                    </button>
                  </div>
                  
                  <div className="badges" style={{ marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{conf.type}</span>
                    <span className="badge" style={{ background: status.bgColor, color: status.color, border: `1px solid ${status.borderColor}` }}>
                      {status.label}
                    </span>
                    {conf.topics.slice(0, 2).map(t => (
                      <span 
                        key={t} 
                        className="badge topic-badge" 
                        onClick={(e) => { e.stopPropagation(); setTopicFilter(t); }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="conference-meta">
                    <div className="meta-item">
                      <MapPin size={14} /> {conf.location}
                    </div>
                    <div className="meta-item">
                      <CalendarDays size={14} /> {conf.eventDateStart}
                    </div>
                    <div className="meta-item" style={{ color: status.color }}>
                      <Clock size={14} /> {conf.deadline}
                    </div>
                  </div>

                  <div className="card-actions">
                    <a 
                      href={conf.website !== '#' ? conf.website : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-button" 
                      title="Website"
                      style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '0.85rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} /> Link
                    </a>
                    <a 
                      href={generateGoogleCalendarUrl(conf)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="glass-button" 
                      title="Add to Google Calendar"
                      style={{ flex: 1, textDecoration: 'none', justifyContent: 'center', fontSize: '0.85rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CalendarIcon size={14} /> GCal
                    </a>
                    <button 
                      className="glass-button primary" 
                      title="Download .ICS"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        generateIcsFile(conf);
                      }}
                    >
                      <Download size={14} /> .ICS
                    </button>
                  </div>
                </div>
              );
            })}
            
            {filteredConferences.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No conferences found. Try adjusting your filters.
              </div>
            )}
          </div>
        </aside>

        <section className="content-area">
          {activeView === 'map' && <MapLayout conferences={filteredConferences} selectedConferenceId={selectedConferenceId} />}
          {activeView === 'calendar' && <CalendarView conferences={filteredConferences} onSelectEvent={(conf) => handleCardClick(conf)} />}
        </section>
      </main>

      {modalConference && (
        <ConferenceModal 
          conference={modalConference} 
          onClose={() => setModalConference(null)}
          onLocate={handleLocateOnMap}
          isFavorite={favorites.includes(modalConference.id)}
          onToggleFavorite={toggleFavorite}
          deadlineStatus={getDeadlineStatus(modalConference.deadline)}
        />
      )}
    </div>
  );
}

export default App;
