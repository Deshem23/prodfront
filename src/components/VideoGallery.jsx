import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- ADD THIS IMPORT

// Video data (adjust paths and thumbnails as needed)
const videos = [
  { src: "/videos/video1.mp4", thumbnail: "/videos/thumb1.jpg", title: "Présentation de CONATEL" },
  { src: "/videos/video2.mp4", thumbnail: "/videos/thumb2.jpg", title: "Conférence sur la régulation 2024" },
  { src: "/videos/video3.mp4", thumbnail: "/videos/thumb3.jpg", title: "Message du Directeur Général" },
  { src: "/videos/video4.mp4", thumbnail: "/videos/thumb4.jpg", title: "Activités communautaires" },
  { src: "/videos/video5.mp4", thumbnail: "/videos/thumb5.jpg", title: "Innovations technologiques" },
  { src: "/videos/video6.mp4", thumbnail: "/videos/thumb6.jpg", title: "Développement des infrastructures" },
];

const VideoCard = ({ video, onClick }) => {
  return (
    <motion.div // 'motion' is now defined due to the import above
      className="card gallery-card-custom video-card"
      onClick={() => onClick(video)}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        y: -5,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="gallery-thumbnail-wrapper">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="img-fluid card-img-top-custom"
        />
        <div className="play-icon-overlay">
          <i className="bi bi-play-circle-fill"></i>
        </div>
      </div>
      <div className="card-body p-3">
        <h5 className="card-title text-truncate mb-0">
          {video.title}
        </h5>
      </div>
    </motion.div>
  );
};

const VideoLightbox = ({ video, onClose }) => {
  return (
    <motion.div // 'motion' is now defined due to the import above
      className="lightbox-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      <motion.div // 'motion' is now defined due to the import above
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="lightbox-content-wrapper video-lightbox-content"
      >
        <video
          controls
          autoPlay
          src={video.src}
          className="media-player-lightbox"
          aria-label={video.title}
        >
          Your browser does not support the video tag.
        </video>
        <p className="text-white text-center mt-3 mb-0 p-3 lightbox-title">
          {video.title}
        </p>
        <button
          className="btn btn-lg btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center close-lightbox-btn"
          onClick={onClose}
          aria-label="Close video"
        >
          <i className="bi bi-x-lg fs-4"></i>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedVideo]);

  return (
    <div className="row g-4">
      {videos.map((video, index) => (
        <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={`video-${index}`}>
          <VideoCard video={video} onClick={setSelectedVideo} />
        </div>
      ))}

      <AnimatePresence>
        {selectedVideo && (
          <VideoLightbox
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}