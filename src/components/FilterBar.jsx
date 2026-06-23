import React from 'react';
import { Search, PlusCircle, Download, Bookmark, Eye, EyeOff } from 'lucide-react';

const FilterBar = ({ 
  searchTerm, setSearchTerm, 
  typeFilter, setTypeFilter, 
  yearFilter, setYearFilter, 
  availableYears,
  hidePast, setHidePast,
  showFavoritesOnly, setShowFavoritesOnly,
  onExportAll
}) => {
  return (
    <div className="glass-panel" style={{ padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        
        <div className="filter-group" style={{ flex: 2, minWidth: '180px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Search</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="filter-input" 
              placeholder="Name, topic, location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>

        <div className="filter-group" style={{ flex: 0.6, minWidth: '110px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Type</label>
          <select 
            className="filter-input" 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Summer School">Summer School</option>
          </select>
        </div>

        <div className="filter-group" style={{ flex: 0.4, minWidth: '90px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year</label>
          <select 
            className="filter-input" 
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className={`glass-button ${hidePast ? 'active-filter' : ''}`}
            onClick={() => setHidePast(!hidePast)}
            title={hidePast ? 'Show past events' : 'Hide past events'}
          >
            {hidePast ? <EyeOff size={16} /> : <Eye size={16} />}
            {hidePast ? 'Past hidden' : 'Show all'}
          </button>

          <button 
            className={`glass-button ${showFavoritesOnly ? 'active-filter' : ''}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            title={showFavoritesOnly ? 'Show all' : 'Show favorites only'}
          >
            <Bookmark size={16} fill={showFavoritesOnly ? '#fbbf24' : 'none'} color={showFavoritesOnly ? '#fbbf24' : 'currentColor'} />
          </button>
        </div>

        <button 
          className="glass-button"
          onClick={onExportAll}
          title="Export all filtered conferences to .ICS"
        >
          <Download size={16} /> Export All
        </button>

        <a 
          href="mailto:diletta.abbonato@unito.it?subject=New%20Economics%20Conference%20Submission&body=Please%20include%20the%20following%20details:%0A%0AName:%0AType%20(Conference/Workshop):%0ALocation:%0AEvent%20Dates:%0ADeadline:%0AWebsite:%0A"
          className="glass-button primary"
          style={{ textDecoration: 'none' }}
        >
          <PlusCircle size={16} /> Submit
        </a>
      </div>
    </div>
  );
};

export default FilterBar;
