import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- ADD THIS IMPORT

// Photo data (adjust paths as needed)
const photos = [
  { src: "/photos/photo1.jpg", thumbnail: "/photos/thumb1.jpg", title: "Cérémonie d'ouverture" },
  { src: "/photos/photo2.jpg", thumbnail: "/photos/thumb2.jpg", title: "Réunion stratégique" },
  { src: "/photos/photo3.jpg", thumbnail: "/photos/thumb3.jpg", title: "Visite de chantier" },
  { src: "/photos/photo4.jpg", thumbnail: "/photos/thumb4.jpg", title: "Signature d'accord" },
  { src: "/photos/photo5.jpg", thumbnail: "/photos/thumb5.jpg", title: "Formation du personnel" },
  { src: "/photos/photo6.jpg", thumbnail: "/photos/thumb6.jpg", title: "Évènement public" },
  { src: "/photos/photo7.jpg", thumbnail: "/photos/thumb7.jpg", title: "Installation d'équipement" },
  { src: "/photos/photo8.jpg", thumbnail: "/photos/thumb8.jpg", title: "Équipe en action" },
  { src: "/photos/photo9.jpg", thumbnail: "/photos/thumb9.jpg", title: "Innovation et technologie" },
  { src: "/photos/photo10.jpg", thumbnail: "/photos/thumb10.jpg", title: "Conférence annuelle" },
];

const PhotoCard = ({ photo, onClick }) => {
  return (
    <motion.div // 'motion' is now defined due to the import above
      className="card gallery-card-custom photo-card"
      onClick={() => onClick(photo)}
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
          src={photo.thumbnail || photo.src}
          alt={photo.title}
          className="img-fluid card-img-top-custom"
        />
        <div className="view-icon-overlay">
          <i className="bi bi-eye-fill"></i>
        </div>
      </div>
      <div className="card-body p-3">
        <h5 className="card-title text-truncate mb-0">
          {photo.title}
        </h5>
      </div>
    </motion.div>
  );
};

const PhotoLightbox = ({ photo, onClose }) => {
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
        className="lightbox-content-wrapper photo-lightbox-content"
      >
        <img
          src={photo.src}
          alt={photo.title}
          className="media-player-lightbox"
          style={{ objectFit: 'contain' }}
          aria-label={photo.title}
        />
        <p className="text-white text-center mt-3 mb-0 p-3 lightbox-title">
          {photo.title}
        </p>
        <button
          className="btn btn-lg btn-light position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center close-lightbox-btn"
          onClick={onClose}
          aria-label="Close photo"
        >
          <i className="bi bi-x-lg fs-4"></i>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  return (
    <div className="row g-4 mb-5">
      {photos.map((photo, index) => (
        <div className="col-sm-6 col-md-4 col-lg-3 d-flex" key={`photo-${index}`}>
          <PhotoCard photo={photo} onClick={setSelectedPhoto} />
        </div>
      ))}

      <AnimatePresence>
        {selectedPhoto && (
          <PhotoLightbox
            photo={selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}