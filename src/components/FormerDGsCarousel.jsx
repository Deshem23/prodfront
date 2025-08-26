import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import './FormerDGsCarousel.css';

const FormerDGsCarousel = () => {
  const formerDGs = [
    {
      id: 1,
      name: "Jean-Marie Buteau",
      term: "2018 - 2021",
      image: "/leaders/jean_marie_buteau.jpg",
    },
    {
      id: 2,
      name: "Jean David",
      term: "2014 - 2018",
      image: "/leaders/jean_david.jpg",
    },
    {
      id: 3,
      name: "Réginald Célestin",
      term: "2007 - 2014",
      image: "/leaders/reginald_celestin.jpg",
    },
    {
      id: 4,
      name: "Pascal Étienne",
      term: "2005 - 2007",
      image: "",
    },
    {
      id: 5,
      name: "Sylvain Charles",
      term: "2003 - 2005",
      image: "",
    },
    {
      id: 6,
      name: "Dominique Joseph",
      term: "2001 - 2003",
      image: "",
    },
    {
      id: 7,
      name: "Hervé Louis",
      term: "1999 - 2001",
      image: "",
    },
    {
      id: 8,
      name: "Marc Antoine",
      term: "1997 - 1999",
      image: "",
    },
    {
      id: 9,
      name: "Philippe René",
      term: "1995 - 1997",
      image: "",
    },
    {
      id: 10,
      name: "François Dubois",
      term: "1993 - 1995",
      image: "",
    },
    {
      id: 11,
      name: "Daniel Pierre",
      term: "1991 - 1993",
      image: "",
    },
    {
      id: 12,
      name: "Louis Bernard",
      term: "1989 - 1991",
      image: "",
    },
    {
      id: 13,
      name: "Robert Petit",
      term: "1987 - 1989",
      image: "",
    },
    {
      id: 14,
      name: "Thierry Martin",
      term: "1985 - 1987",
      image: "",
    },
    {
      id: 15,
      name: "Alain Leclerc",
      term: "1983 - 1985",
      image: "",
    },
    {
      id: 16,
      name: "Michel Lemoine",
      term: "1981 - 1983",
      image: "",
    },
    {
      id: 17,
      name: "Georges Dufort",
      term: "1979 - 1981",
      image: "",
    },
    {
      id: 18,
      name: "Paul Valois",
      term: "1977 - 1979",
      image: "",
    },
  ];

  const carouselRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDG, setSelectedDG] = useState(null);

  const handleOpenModal = (dg) => {
    setSelectedDG(dg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDG(null);
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 80;
      if (direction === 'left') {
        carouselRef.current.scrollLeft -= scrollAmount;
      } else {
        carouselRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <>
      <div className="former-dgs-section">
        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={() => scroll('left')}>
            <i className="bi bi-chevron-left"></i>
          </button>

          <div className="carousel-fade-wrapper">
            <div className="carousel-container" ref={carouselRef}>
              {formerDGs.map((dg) => (
                <div
                  key={dg.id}
                  className="dg-item-wrapper"
                  onClick={() => handleOpenModal(dg)}
                >
                  <div className="dg-photo-placeholder">
                    {dg.image ? (
                      <img src={dg.image} alt={dg.name} />
                    ) : (
                      <i className="bi bi-person-circle"></i>
                    )}
                  </div>
                  <div className="dg-info">
                    <h6>{dg.name}</h6>
                    <small className="text-muted d-block">{dg.term}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-arrow right" onClick={() => scroll('right')}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedDG && (
          <div
            className="dg-carousel-modal-overlay"
            onClick={handleCloseModal}
          >
            <div
              className="dg-carousel-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="modal-close-button"
              >
                <i className="bi bi-x-lg"></i>
              </button>
               
              <div className="text-center">
                <div className="dg-modal-photo-wrapper">
                  {selectedDG.image ? (
                    <img src={selectedDG.image} alt={selectedDG.name} />
                  ) : (
                    <i className="bi bi-person-circle dg-modal-icon"></i>
                  )}
                </div>
                <h5 className="mb-0 mt-3">{selectedDG.name}</h5>
                <span className="badge rounded-pill bg-primary">{selectedDG.term}</span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FormerDGsCarousel;