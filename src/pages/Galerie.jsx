import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import axios from "axios";

// Sidebar Components
import LatestNewsCard from "../components/LatestNewsCard";
import ChantiersCard from "../components/ChantiersCard";
import StatsCard from "../components/StatsCard";
import SocialsCard from "../components/SocialsCard";

import "./Galerie.css";

export default function Galerie() {
  const { t, i18n } = useTranslation(["galerie", "sidebar"]);
  const primaryColor = "rgb(5, 40, 106)";

  const [pageData, setPageData] = useState({ mainTitle: "", mainDescription: "" });
  const [events, setEvents] = useState([]); // Collection: events
  const [videos, setVideos] = useState([]); // Collection: videos
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const videosPerPage = isMobile ? 5 : 9;

  // Fetch data from Strapi
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/galerie-page?locale=${i18n.language}`
        );
        // Directly use data, no .attributes
        setPageData(res.data.data);
      } catch (error) {
        console.error("Error fetching galerie-page:", error);
      }
    };
  
    fetchPageData();
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/events?populate=images&locale=${i18n.language}`
        );
        const fetchedEvents = res.data.data.map((e) => ({
          id: e.id,
          title: e.title || "No title",
          images: e.images?.map(img =>
            img.url.startsWith("/") ? `http://localhost:1337${img.url}` : img.url
          ) || []
        }));
        setEvents(fetchedEvents);
        setSelectedEvent(fetchedEvents[0] || null);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1337/api/videos?locale=${i18n.language}`
        );
        const fetchedVideos = res.data.data.map((v) => ({
          id: v.id,
          title: v.title || "No title",
          youtubeId: v.youtubeId || ""
        }));
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchPageData();
    fetchEvents();
    fetchVideos();
  }, [i18n.language]);

  // Handle mobile resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", checkMobile);
    checkMobile();
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalPages = Math.ceil(videos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = videos.slice(startIndex, startIndex + videosPerPage);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setCurrentSlide(0);
  };

  const handleNext = () => {
    if (!selectedEvent) return;
    setCurrentSlide((prev) =>
      prev === selectedEvent.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    if (!selectedEvent) return;
    setCurrentSlide((prev) =>
      prev === 0 ? selectedEvent.images.length - 1 : prev - 1
    );
  };

  const getThumbnailUrl = (youtubeId) =>
    youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
      : "/fallback-thumbnail.jpg"; // place a local default image in your public folder

  if (!selectedEvent) return <div>Loading...</div>;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
  {/* Page Title & Description from galerie-page */}
{pageData && (
  <div className="text-center mb-4">
    <h2 className="mb-3" style={{ color: primaryColor }}>
      <i className="bi bi-images me-2"></i>
      {pageData.title || t("main_title")}
    </h2>
    <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
      {pageData.description || t("main_description")}
    </p>
  </div>
)}

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
                        selectedEvent.id === event.id ? "active" : ""
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
                  {selectedEvent.title}
                </div>
                <div className="card-body text-center position-relative d-flex justify-content-center align-items-center">
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
                    </div>
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Video gallery navigation" className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {t("previous")}
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {t("next")}
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>
    </motion.div>
  );
}