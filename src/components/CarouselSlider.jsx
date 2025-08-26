import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";

// Use the Vite environment variable instead of a hardcoded URL
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function CarouselSlider() {
  const { t, i18n } = useTranslation('home');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${STRAPI_API_URL}/carousel-slides?locale=${i18n.language}&populate=*`
        );
        
        const fetchedSlides = response.data.data.map(item => {
          const slideData = item.attributes;
          
          // Get the image URL from the 'attributes' object
          const imagePath = slideData?.image?.data?.attributes?.url;
          
          return {
            id: item.id,
            title: slideData?.title ?? 'Untitled Slide',
            subtitle: slideData?.subtitle ?? 'No subtitle available',
            image: imagePath ? `${STRAPI_BASE_URL}${imagePath}` : 'https://via.placeholder.com/1200x500.png?text=No+Image'
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    padding: '1.5rem',
    left: '0',
    right: '0',
    bottom: '0',
    borderRadius: '0',
  };

  const imageStyle = {
    maxHeight: "500px",
    objectFit: "cover"
  };

  if (loading) return <div className="text-center py-5">Loading carousel...</div>;
  if (error) return <div className="alert alert-danger text-center py-5">{error}</div>;

  return (
    <div className="mt-3">
      {slides.length > 0 && (
        <Carousel fade interval={2000}>
          {slides.map((slide) => (
            <Carousel.Item key={slide.id}>
              <img
                className="d-block w-100"
                src={slide.image}
                alt={slide.title}
                style={imageStyle}
              />
              <Carousel.Caption style={captionBackgroundStyle}>
                <h3>{slide.title}</h3>
                <p>{slide.subtitle}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
}