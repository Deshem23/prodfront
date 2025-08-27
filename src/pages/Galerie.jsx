import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import axios from "axios";

// Sidebar Components
import LatestNewsCard from "../components/LatestNewsCard";
import ChantiersCard from "../components/ChantiersCard";
import StatsCard from "../components/StatsCard";
import SocialsCard from "../components/SocialsCard";

import "./Galerie.css";

// Strapi API configuration - USING ENVIRONMENT VARIABLES PROPERLY
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || window.location.origin;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function Galerie() {
  const { t, i18n } = useTranslation(["galerie", "common"]);
  const primaryColor = "rgb(5, 40, 106)";

  const [pageData, setPageData] = useState({ mainTitle: "", mainDescription: "" });
  const [events, setEvents] = useState([]); // Collection: events
  const [videos, setVideos] = useState([]); // Collection: videos
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videosPerPage = isMobile ? 5 : 9;

  // Handle mobile resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch page content
        const pageRes = await axios.get(
          `${STRAPI_API_URL}/galerie-page?locale=${i18n.language}`,
          { timeout: 10000 }
        );
        const pageContentData = pageRes.data.data.attributes || {};
        setPageData({
          mainTitle: pageContentData.title || t("galerie:main_title"),
          mainDescription: pageContentData.description || t("galerie:main_description"),
        });

        // Fetch events
        const eventsRes = await axios.get(
          `${STRAPI_API_URL}/events?populate=images&locale=${i18n.language}`,
          { timeout: 10000 }
        );
        const fetchedEvents = eventsRes.data.data.map((e) => {
          const eventData = e.attributes || e;
          return {
            id: e.id,
            title: eventData.title || "No title",
            images: eventData.images?.data.map(img => {
              const imgData = img.attributes || img;
              return `${STRAPI_BASE_URL}${imgData.url}`;
            }) || []
          };
        });
        setEvents(fetchedEvents);
        setSelectedEvent(fetchedEvents[0] || null);

        // Fetch videos
        const videosRes = await axios.get(
          `${STRAPI_API_URL}/videos?locale=${i18n.language}`,
          { timeout: 10000 }
        );
        const fetchedVideos = videosRes.data.data.map((v) => {
          const videoData = v.attributes || v;
          return {
            id: v.id,
            title: videoData.title || "No title",
            youtubeId: videoData.youtubeId || ""
          };
        });
        setVideos(fetchedVideos);

      } catch (err) {
        console.error("API Error:", err);
        
        if (err.code === 'ECONNABORTED') {
          setError(t("common:timeout_error") || "Request timeout. Please check your connection.");
        } else if (err.response) {
          setError(t("common:api_error") || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError(t("common:connection_error") || "Cannot connect to server. Please check if Strapi is running.");
        } else {
          setError(t("common:api_error") || "Failed to load gallery content");
        }

        setEvents([]);
        setVideos([]);
        setPageData({});

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  const totalPages = Math.ceil(videos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = videos.slice(startIndex, startIndex + videosPerPage);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
    setCurrentSlide(0);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedEvent) return;
    setCurrentSlide((prev) =>
      prev === selectedEvent.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedEvent]);

  const handlePrev = useCallback(() => {
    if (!selectedEvent) return;
    setCurrentSlide((prev) =>
      prev === 0 ? selectedEvent.images.length - 1 : prev - 1
    );
  }, [selectedEvent]);

  const getThumbnailUrl = (youtubeId) =>
    youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
      : "/fallback-thumbnail.jpg"; // place a local default image in your public folder

  const handleShare = useCallback(async (platform, item) => {
    if (!item) return;

    const shareUrl = window.location.origin + `/galerie`; // Simplified URL for the gallery page
    const shareTitle = item.title;
    const shareText = "Check out this content from our gallery!";

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (error) {
        console.error('Error sharing:', error);
      }
      return;
    }

    let intentUrl = '';
    switch (platform) {
      case 'facebook':
        intentUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        intentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        intentUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      case 'email':
        intentUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\nRead more here: ' + shareUrl)}`;
        break;
      default:
        break;
    }

    if (intentUrl) window.open(intentUrl, '_blank', 'noopener,noreferrer');
  }, []);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">{t('common:loading') || "Loading..."}</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger mx-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
        <Button 
          variant="outline-primary" 
          onClick={() => window.location.reload()}
          className="mt-3"
        >
          <i className="bi bi-arrow-repeat me-2"></i>
          {t('common:try_again') || "Try Again"}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Page Title & Description from galerie-page */}
      <div className="text-center mb-4">
        <h2 className="mb-3" style={{ color: primaryColor }}>
          <i className="bi bi-images me-2"></i>
          {pageData.mainTitle}
        </h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
          {pageData.mainDescription}
        </p>
      </div>

      <div className="row mt-5">
        <div className="col-lg-8 custom-width-73">
          <h4
            className="mb-4 text-center section-title-custom"
            style={{ color: primaryColor }}
          >
            {t("photos_title")}
          </h4>

          {/* Events & Slider */}
          <div className="row d-flex align-items-stretch mb-5">
            {/* Events list */}
            <div className="col-md-4 d-flex mb-md-0 mb-3">
              <div className="card shadow rounded flex-fill">
                <div
                  className="card-header text-center fw-bold"
                  style={{ color: primaryColor }}
                >
                  {t("activities")}
                </div>
                <ul
                  className="list-group list-group-flush flex-grow-1 overflow-auto"
                  style={{ maxHeight: "300px" }}
                >
                  {events.map((event) => (
                    <li
                      key={event.id}
                      className={`list-group-item ${
                        selectedEvent && selectedEvent.id === event.id ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Slider */}
            <div className="col-md-8 d-flex">
              <div className="card shadow rounded flex-fill">
                <div
                  className="card-header text-center fw-bold"
                  style={{ color: primaryColor }}
                >
                  {selectedEvent ? selectedEvent.title : "No Event Selected"}
                </div>
                <div className="card-body text-center position-relative d-flex justify-content-center align-items-center">
                  {selectedEvent && selectedEvent.images.length > 0 ? (
                    <>
                      <div
                        className="slider-box"
                        style={{
                          width: "100%",
                          height: "300px",
                          overflow: "hidden",
                          borderRadius: "8px",
                        }}
                      >
                        <img
                          src={selectedEvent.images[currentSlide]}
                          alt="Event Slide"
                          className="img-fluid"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <button
                        className="btn btn-sm btn-outline-dark position-absolute top-50 start-0 translate-middle-y"
                        onClick={handlePrev}
                      >
                        ‹
                      </button>
                      <button
                        className="btn btn-sm btn-outline-dark position-absolute top-50 end-0 translate-middle-y"
                        onClick={handleNext}
                      >
                        ›
                      </button>
                    </>
                  ) : (
                    <div className="text-muted">No images available for this event.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <hr />

          {/* Videos */}
          <h4
            className="mb-4 text-center section-title-custom"
            style={{ color: primaryColor }}
          >
            {t("videos_title")}
          </h4>

          <div className="card shadow rounded p-3 mb-5">
            <div
              className={
                isMobile
                  ? "video-scroll-container"
                  : "row g-4 justify-content-center"
              }
            >
              {currentVideos.map((video) => (
                <div
                  key={video.id}
                  className={
                    isMobile
                      ? "video-scroll-item"
                      : "col-lg-4 col-md-6 col-sm-12"
                  }
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card video-card shadow-sm h-100"
                  >
                    <img
                      src={getThumbnailUrl(video.youtubeId)}
                      className="card-img-top"
                      alt={video.title}
                    />
                    <div className="card-body">
                      <h6 className="card-title text-center text-truncate">
                        {video.title}
                      </h6>
                      <div className="d-flex justify-content-center gap-2 mt-2">
                        <button onClick={(e) => { e.preventDefault(); handleShare('facebook', video); }} className="share-icon-button" aria-label="Share on Facebook">
                          <FaFacebookF className="share-icon facebook" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); handleShare('twitter', video); }} className="share-icon-button" aria-label="Share on X">
                          <FaXTwitter className="share-icon twitter" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); handleShare('whatsapp', video); }} className="share-icon-button" aria-label="Share on WhatsApp">
                          <FaWhatsapp className="share-icon whatsapp" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); handleShare('email', video); }} className="share-icon-button" aria-label="Share via Email">
                          <MdEmail className="share-icon email" />
                        </button>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Video gallery navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      <button className="page-link">{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 custom-width-27 mt-4 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>
    </motion.div>
  );
}