import React from 'react';
import './EventList.css';

export default function EventList({ events, onEventClick, activeEventId }) {
  return (
    <div className="event-list-container">
      <ul className="list-group">
        {events.map((event) => (
          <li
            key={event.id}
            className={`list-group-item event-item ${event.id === activeEventId ? 'active' : ''}`}
            onClick={() => onEventClick(event.id)}
          >
            {event.name}
          </li>
        ))}
      </ul>
    </div>
  );
}