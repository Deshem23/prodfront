import { useState, useEffect } from "react";
import { Carousel, Button, Alert, Card, Badge } from "react-bootstrap";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function CarouselSlider() {
  const {  i18n } = useTranslation('home');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const apiUrl = `${STRAPI_API_URL}/carousel-slides?locale=${i18n.language}&populate=*`;
        setDebugInfo(`Fetching from: ${apiUrl}`);
        
        const response = await axios.get(apiUrl);
        
        console.log("Carousel API response:", response.data);
        
        if (!response.data.data || response.data.data.length === 0) {
          setSlides([]);
          setLoading(false);
          setDebugInfo(prev => prev + "\n\nNo data returned from API");
          return;
        }
        
        const fetchedSlides = response.data.data.map(item => {
          const slideData = item.attributes;
          
          // Extract image URL - based on your API response structure
          let imageUrl = null;
          
          // Your images are directly at slideData.image.url
          if (slideData?.image?.url) {
            imageUrl = slideData.image.url; // Already includes full URL from Strapi Cloud
          }
          // Fallback to formats if needed
          else if (slideData?.image?.formats) {
            const formats = slideData.image.formats;
            const formatToUse = formats.large || formats.medium || formats.small || formats.thumbnail;
            if (formatToUse?.url) {
              imageUrl = formatToUse.url;
            }
          }
          
          console.log("Generated image URL:", imageUrl);
          
          return {
            id: item.id,
            title: slideData?.title || 'Untitled Slide',
            subtitle: slideData?.subtitle || 'No subtitle available',
            image: imageUrl || 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=1200&h=500&fit=crop'
          };
        });
        
        setSlides(fetchedSlides);
        setDebugInfo(prev => prev + `\n\nFound ${fetchedSlides.length} slides`);
      } catch (err) {
        const errorMsg = "Failed to fetch carousel slides. Please check the API URL and permissions.";
        setError(errorMsg);
        setDebugInfo(`Error: ${err.message}\n\nAPI URL: ${STRAPI_API_URL}/carousel-slides?locale=${i18n.language}&populate=*`);
        console.error("Error fetching carousel:", err);
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
      <div className="mt-3">
        <details>
          <summary>Debug Information</summary>
          <pre className="text-start mt-2 p-2 bg-dark text-light rounded" style={{fontSize: '0.7rem', overflowX: 'auto'}}>
            {debugInfo}
          </pre>
        </details>
      </div>
    </div>
  );

  return (
    <div className="mt-3">
      {slides.length > 0 ? (
        <>
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
                    e.target.src = 'https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=1200&h=500&fit=crop';
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
          
          {/* Debug panel - remove in production */}
          <Card className="mt-4 mx-3 d-none">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>API Response Debug</span>
              <Badge bg="info">{slides.length} slides loaded</Badge>
            </Card.Header>
            <Card.Body>
              <details>
                <summary>View Debug Information</summary>
                <pre className="mt-2 p-2 bg-light border rounded" style={{fontSize: '0.7rem', overflowX: 'auto', maxHeight: '300px'}}>
                  {debugInfo}
                </pre>
              </details>
            </Card.Body>
          </Card>
        </>
      ) : (
        <div className="text-center py-5 bg-light rounded mx-3">
          <i className="bi bi-image display-4 text-muted"></i>
          <h4 className="mt-3">No Carousel Slides Found</h4>
          <p className="text-muted">This could be due to several reasons:</p>
          
          <div className="text-start mt-4 mx-auto" style={{maxWidth: '600px'}}>
            <Alert variant="info">
              <h5>
                <i className="bi bi-lightbulb me-2"></i>
                Troubleshooting Steps
              </h5>
              <ol className="mt-3">
                <li>Check if you have created carousel slides in Strapi</li>
                <li>Verify the content type is named "carousel-slides"</li>
                <li>Ensure each slide has an image uploaded</li>
                <li>Check that the slides are published</li>
                <li>Verify API permissions in Strapi Settings</li>
              </ol>
            </Alert>
          </div>
          
          <div className="mt-4">
            <Button variant="outline-primary" onClick={() => window.location.reload()} className="me-2">
              <i className="bi bi-arrow-repeat me-1"></i>
              Reload
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}