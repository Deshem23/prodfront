import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';

// Sidebar Components
import LatestNewsCard from '../components/LatestNewsCard';
import ChantiersCard from '../components/ChantiersCard';
import StatsCard from '../components/StatsCard';
import SocialsCard from '../components/SocialsCard';

import './Procedures.css';

// Strapi API configuration
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

export default function Procedures() {
  const { t, i18n } = useTranslation(['procedures', 'common']);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [proceduresData, setProceduresData] = useState([]);
  const [pageContent, setPageContent] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryColor = 'rgb(5, 40, 106)';
  const itemsPerPage = isMobile ? 5 : 15;

  // Resize detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch procedures + page content - USING ACTUALITES LOGIC
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Using the same populate pattern as Actualites
        const proceduresRes = await axios.get(
          `${STRAPI_API_URL}/procedures?locale=${i18n.language}&populate[0]=localizations&populate[1]=pdf`
        );

        console.log("Procedures API response:", proceduresRes.data);

        // USING ACTUALITES LOGIC FOR DATA MAPPING
        const formattedProcedures = proceduresRes.data.data.map(item => {
          const procedureData = item.attributes || item;

          // USING ACTUALITES LOGIC FOR PDF URL
          const pdfUrl = procedureData?.pdf?.url || null;

          return {
            id: item.id,
            title: procedureData?.title ?? "Untitled",
            description: procedureData?.description ?? "No description available",
            date: procedureData?.date ?? "No Date",
            pdf: pdfUrl // Using the same logic as Actualites
          };
        });

        const pageRes = await axios.get(
          `${STRAPI_API_URL}/procedures-page?locale=${i18n.language}`
        );
        const pageData = pageRes.data.data;

        setProceduresData(formattedProcedures);
        setPageContent({
          title: pageData?.title || '',
          description: pageData?.description || '',
        });

      } catch (err) {
        console.error("API Error:", err);
        setError(t("common:api_error") || "Failed to load procedures");
        setProceduresData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  // Filter + paginate
  const sortedProcedures = [...proceduresData].sort(sortByDate);
  const filteredProcedures = sortedProcedures.filter(procedure =>
    (procedure.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (procedure.description || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (procedure.date || '').toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProcedures.length / itemsPerPage);
  const paginatedProcedures = filteredProcedures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const handleOpenModal = useCallback((procedure) => {
    setSelectedProcedure(procedure);
  }, []);
  const handleCloseModal = useCallback(() => {
    setSelectedProcedure(null);
  }, []);

  // SIMPLIFIED DOWNLOAD FUNCTION - USING ACTUALITES LOGIC
  const handleDownload = (pdfUrl, filename) => {
    if (!pdfUrl) return;
    
    // Create a temporary anchor tag - same as Actualites approach
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Share handler
  const handleShare = async (platform) => {
    if (!selectedProcedure) return;

    const shareUrl = window.location.origin + `/procedures?id=${selectedProcedure.id}`;
    const shareTitle = `Check out this procedure: ${selectedProcedure.title}`;
    const shareText = selectedProcedure.description;

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
  };

  // Loading + Error states
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container text-center py-5 alert alert-danger">
        {error}
      </div>
    );
  }

  // Render UI
  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-file-earmark-text me-2"></i>{pageContent.title}
      </h2>
      <p className="text-center text-muted mx-auto" style={{ maxWidth: '720px' }}>
        {pageContent.description}
      </p>

      <div className="row mt-5">
        <div className="col-lg-8 custom-width-73">
          <div className="mb-4">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control w-100 mx-auto"
            />
          </div>

          <div className={`decisions-list-container bg-white rounded p-4 shadow-sm ${isMobile ? 'mobile-scrollable' : ''}`}>
            {filteredProcedures.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {paginatedProcedures.map(procedure => (
                  <li key={procedure.id} className="decision-item py-3">
                    <div className="d-flex align-items-center flex-grow-1">
                      <i className="bi bi-file-earmark-text me-3 decision-item-icon"></i>
                      <div>
                        <h6 className="mb-0 decision-item-title">{procedure.title}</h6>
                        <small className="decision-item-date">
                          <i className="bi bi-calendar-event me-1"></i>{procedure.date}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <a href="#" className="consulter-link" onClick={(e) => { e.preventDefault(); handleOpenModal(procedure); }}>
                        <i className="bi bi-eye"></i>
                        <span className="ms-1">{t('consult')}</span>
                      </a>
                      {procedure.pdf && (
                        <a 
                          href={procedure.pdf}
                          download={`${procedure.title}.pdf`}
                          className="btn btn-primary-custom btn-sm"
                          onClick={(e) => {
                            // Optional: Add analytics or tracking here
                            console.log('Downloading:', procedure.title);
                          }}
                        >
                          <i className="bi bi-download me-2"></i>{t('download')}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info text-center mt-4">
                {t('noResults')}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-center mt-4">
            <ul className="pagination">
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
          </div>
        </div>

        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>

      <AnimatePresence>
        {selectedProcedure && (
          <motion.div
            className="custom-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="custom-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', flexDirection: 'column', maxHeight: '95vh', maxWidth: '800px' }}
            >
              <button
                onClick={handleCloseModal}
                className="custom-modal-close-button"
                style={{ padding: '0.3rem 0.6rem', fontSize: '1rem', zIndex: 20 }}
              >
                <i className="bi bi-x-lg" style={{ color: 'black' }}></i>
              </button>

              <div className="modal-header" style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderBottom: '1px solid #dee2e6' }}>
                <div style={{ textAlign: 'left' }}>
                  <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedProcedure.title}</h5>
                  <small className="text-muted d-block" style={{ fontSize: '0.9rem' }}>{selectedProcedure.date}</small>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                <p style={{ textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: selectedProcedure.description }}></p>
              </div>

              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={handleCloseModal} className="hover-red-btn">
                      {t('close')}
                    </Button>
                    {selectedProcedure.pdf && (
                      <a
                        href={selectedProcedure.pdf}
                        download={`${selectedProcedure.title}.pdf`}
                        className="btn btn-primary hover-green-btn"
                      >
                        <i className="bi bi-download me-2"></i>
                        {t('downloadPdf')}
                      </a>
                    )}
                  </div>

                  <div className="social-share-container d-flex gap-2">
                    <button onClick={() => handleShare('facebook')} className="share-icon-button" aria-label="Share on Facebook">
                      <FaFacebookF className="share-icon facebook" />
                    </button>
                    <button onClick={() => handleShare('twitter')} className="share-icon-button" aria-label="Share on X">
                      <FaXTwitter className="share-icon twitter" />
                    </button>
                    <button onClick={() => handleShare('whatsapp')} className="share-icon-button" aria-label="Share on WhatsApp">
                      <FaWhatsapp className="share-icon whatsapp" />
                    </button>
                    <button onClick={() => handleShare('email')} className="share-icon-button" aria-label="Share via Email">
                      <MdEmail className="share-icon email" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}