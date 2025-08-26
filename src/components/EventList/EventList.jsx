// src/components/EventList.jsx

import React from 'react';
import './EventList.css'; // You'll also need a CSS file for styling

const events = [
  { id: 1, name: 'Event 1' },
  { id: 2, name: 'Event 2' },
  { id: 3, name: 'Event 3' },
  { id: 4, name: 'Event 4' },
];

export default function EventList() {
  return (
    <div className="event-list-container">
      <ul className="list-group">
        {events.map((event) => (
          <li key={event.id} className="list-group-item event-item">
            {event.name}
          </li>
        ))}
      </ul>
    </div>
  );
}