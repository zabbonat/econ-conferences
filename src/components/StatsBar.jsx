import React from 'react';
import { BarChart3, Globe, BookOpen, GraduationCap, Clock, AlertTriangle } from 'lucide-react';

const StatsBar = ({ conferences, allConferences, onFilterType, onFilterDeadline, activeStatFilter }) => {
  const totalConfs = conferences.filter(c => c.type === 'Conference').length;
  const totalWorkshops = conferences.filter(c => c.type === 'Workshop').length;
  const totalSummerSchools = conferences.filter(c => c.type === 'Summer School').length;
  
  const now = new Date();
  const openDeadlines = conferences.filter(c => new Date(c.deadline) >= now).length;
  const urgentDeadlines = conferences.filter(c => {
    const diff = Math.ceil((new Date(c.deadline) - now) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 30;
  }).length;

  const uniqueCountries = new Set(
    conferences
      .map(c => c.location.split(',').pop()?.trim())
      .filter(Boolean)
  ).size;

  const stats = [
    { id: 'Conference', icon: <BookOpen size={18} />, value: totalConfs, label: 'Conferences', color: '#3b82f6', action: () => onFilterType('Conference') },
    { id: 'Workshop', icon: <BarChart3 size={18} />, value: totalWorkshops, label: 'Workshops', color: '#8b5cf6', action: () => onFilterType('Workshop') },
    { id: 'Summer School', icon: <GraduationCap size={18} />, value: totalSummerSchools, label: 'Summer Schools', color: '#f59e0b', action: () => onFilterType('Summer School') },
    { id: 'countries', icon: <Globe size={18} />, value: uniqueCountries, label: 'Countries', color: '#10b981', action: null },
    { id: 'open', icon: <Clock size={18} />, value: openDeadlines, label: 'Open Deadlines', color: '#34d399', action: () => onFilterDeadline('open') },
    { id: 'urgent', icon: <AlertTriangle size={18} />, value: urgentDeadlines, label: 'Urgent (<30d)', color: '#fbbf24', action: () => onFilterDeadline('urgent') },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className={`stat-card glass-panel ${stat.action ? 'clickable' : ''} ${activeStatFilter === stat.id ? 'stat-active' : ''}`}
          onClick={stat.action ? stat.action : undefined}
          style={stat.action ? { cursor: 'pointer' } : {}}
        >
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
