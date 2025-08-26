import React, { useState, useRef, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

// Import slick carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Photo data
const photos = [
  { id: 1, src: 'path/to/your/photo1.jpg', alt: 'Photo 1', caption: 'Description de la photo 1.' },
  { id: 2, src: 'path/to/your/photo2.jpg', alt: 'Photo 2', caption: 'Description de la photo 2.' },
  { id: 3, src: 'path/to/your/photo3.jpg', alt: 'Photo 3', caption: 'Description de la photo 3.' },
  { id: 4, src: 'path/to/your/photo4.jpg', alt: 'Photo 4', caption: 'Description de la photo 4.' },
  { id: 5, src: 'path/to/your/photo5.jpg', alt: 'Photo 5', caption: 'Description de la photo 5.' },
  { id: 6, src: 'path/to/your/photo6.jpg', alt: 'Photo 6', caption: 'Description de la photo 6.' },
  { id: 7, src: 'path/to/your/photo7.jpg', alt: 'Photo 7', caption: 'Description de la photo 7.' },
];

export default function PhotoCarouselGallery() {
  const { t } = useTranslation('galerie');
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  }, [index]);

  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="photo-carousel-container"
    >
      <Carousel activeIndex={index} onSelect={handleSelect} fade>
        {photos.map((photo) => (
          <Carousel.Item key={photo.id}>
            <img className="d-block w-100 main-carousel-image" src={photo.src} alt={photo.alt} />
            <Carousel.Caption>
              <h3>{photo.caption}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="thumbnail-slider-container mt-3">
        <Slider {...slickSettings} ref={sliderRef}>
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={`thumbnail-image-wrapper ${i === index ? 'active-thumbnail' : ''}`}
              onClick={() => handleSelect(i)}
            >
              <img src={photo.src} alt={photo.alt} className="img-fluid thumbnail-image" />
            </div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
}