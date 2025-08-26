import { useState, useEffect } from "react";
import { Carousel, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function CarouselSlider() {
  const { i18n } = useTranslation('home');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${STRAPI_API_URL}/carousel-slides?locale=${i18n.language}&populate[0]=localizations&populate[1]=image`
        );
        
        console.log("Carousel API response:", response.data);
        
        // Using the EXACT same logic as your articles fetch
        const fetchedSlides = response.data.data.map(item => {
          const slideData = item.attributes || item;

          // CORRECTED LOGIC FOR IMAGE URL (same as articles)
          const imageUrl = slideData?.image?.url || null;
    
          return {
            id: item.id,
            title: slideData?.title ?? "Untitled Slide",
            subtitle: slideData?.subtitle ?? "No subtitle available",
            image: imageUrl
          };
        });

        setSlides(fetchedSlides);

      } catch (err) {
        setError("Failed to fetch carousel slides. Please check the API URL and permissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [i18n.language]);

  const captionBackgroundStyle = {
    backgroundColor: 'rgba(5, 40, 106, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '1.5rem',
    left: '0',
    right: '0',
    bottom: '0',
    borderRadius: '0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
  };

  const imageStyle = {
    height: "500px",
    objectFit: "cover",
    width: "100%"
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading carousel...</p>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger text-center py-5 mx-3">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {error}
      <div className="mt-3">
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mt-3">
      {slides.length > 0 ? (
        <Carousel fade interval={4000} indicators={slides.length > 1} controls={slides.length > 1}>
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <img
                className="d-block w-100"
                src={slide.image}
                alt={slide.title}
                style={imageStyle}
                onError={(e) => {
                  console.error(`Failed to load image: ${slide.image}`);
                  // Hide broken images completely
                  e.target.style.display = 'none';
                }}
              />
              <Carousel.Caption style={captionBackgroundStyle}>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="fw-bold"
                >
                  {slide.title}
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="fs-5"
                >
                  {slide.subtitle}
                </motion.p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="text-center py-5 bg-light rounded mx-3">
          <i className="bi bi-image display-4 text-muted"></i>
          <h4 className="mt-3">No Carousel Slides Found</h4>
          <p className="text-muted">Please add slides in your Strapi admin panel.</p>
        </div>
      )}
    </div>
  );
}
