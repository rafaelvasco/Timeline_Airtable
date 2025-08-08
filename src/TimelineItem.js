import React from 'react';
import moment from 'moment';
import { TIMELINE_CONFIG } from './config.js';

// Renders an individual timeline item with click handling and configurable styling
function TimelineItem({ item, style, onClick }) {
  // Converts YYYY-MM-DD string to moment object for consistent date handling
  const createMoment = (dateString) => {
    return moment(dateString, 'YYYY-MM-DD');
  };

  // Formats start and end dates as a readable range string
  const formatDateRange = (start, end) => {
    const startDate = createMoment(start);
    const endDate = createMoment(end);
    
    const startStr = startDate.format('MMM D');
    const endStr = endDate.format('MMM D');
    
    if (start === end) {
      return startStr;
    }
    
    return `${startStr} - ${endStr}`;
  };

  // Calculates and formats the duration between start and end dates
  const getDuration = (start, end) => {
    const startDate = createMoment(start);
    const endDate = createMoment(end);
    const days = endDate.diff(startDate, 'days') + 1;
    return days === 1 ? '1 day' : `${days} days`;
  };

  // Handles click events and prevents event bubbling to timeline drag
  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div 
      className="timeline-item"
      style={{
        ...style,
        height: TIMELINE_CONFIG.ITEM_HEIGHT
      }}
      title={`${item.name}\n${formatDateRange(item.start, item.end)}\n${getDuration(item.start, item.end)}`}
      onClick={handleClick}
    >
      <div className="timeline-item-content">
        <div className="timeline-item-name">{item.name}</div>
        <div className="timeline-item-dates">
          {formatDateRange(item.start, item.end)}
        </div>
      </div>
    </div>
  );
}

export default TimelineItem;