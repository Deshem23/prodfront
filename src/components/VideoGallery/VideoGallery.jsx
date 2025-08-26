import React from 'react';
import './VideoGallery.css';

// Replace with your actual video data
const videos = [
  { id: 1, url: 'https://www.youtube.com/embed/QpsGo8kZiTo', title: 'Video 1' },
  { id: 2, url: 'https://www.youtube.com/embed/LDXadAS2-PE', title: 'Video 2' },
  { id: 3, url: 'https://www.youtube.com/embed/QpsGo8kZiTo', title: 'Video 3' },
  // Add more video objects as needed
];

export default function VideoGallery() {
  return (
    <div className="video-gallery row">
      {videos.map((video) => (
        <div key={video.id} className="col-lg-6 col-md-6 col-sm-12 mb-4">
          <div className="video-item rounded overflow-hidden shadow-sm">
            <iframe
              width="100%"
              height="315"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="p-3 text-center">
              <h6>{video.title}</h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}