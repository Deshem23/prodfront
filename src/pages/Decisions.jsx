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

import './Decisions.css';

// Helper function to sort by date
const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

// Strapi API configuration - USING ENVIRONMENT VARIABLES PROPERLY
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || window.location.origin;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function Decisions() {
  const { t, i18n } = useTranslation(['decisions', 'common']);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [decisionsData, setDecisionsData] = useState([]);
  const [pageContent, setPageContent] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryColor = 'rgb(5, 40, 106)';
  const itemsPerPage = isMobile ? 5 : 15;

  // Responsive listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Function to handle file download for all devices
const handleDownload = useCallback((pdfUrl, filename) => {
  if (!pdfUrl) {
    console.error('No PDF URL provided');
    return;
  }
  
  try {
    // Create a temporary anchor tag
    const link = document.createElement('a');
    
    // Force download by creating a blob URL
    fetch(pdfUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = filename || 'document.pdf';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error fetching the file:', error);
        // Fallback to direct download if blob approach fails
        link.href = pdfUrl;
        link.download = filename || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    
  } catch (error) {
    console.error('Error downloading the file:', error);
    // Final fallback - open in new tab
    window.open(pdfUrl, '_blank');
  }
}, []);

  // Fetch data from Strapi with proper error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Attempting to fetch from:", `${STRAPI_API_URL}/decisions?locale=${i18n.language}&populate[0]=localizations&populate[1]=pdf`);

        // Fetch decisions list
        const decisionsRes = await axios.get(
          `${STRAPI_API_URL}/decisions?locale=${i18n.language}&populate[0]=localizations&populate[1]=pdf`,
          { timeout: 10000 } // 10 second timeout
        );

        console.log("Decisions API response:", decisionsRes.data);

        // USING ACTUALITES/PROCEDURES LOGIC FOR DATA MAPPING
        const formattedDecisions = decisionsRes.data.data.map(item => {
          const decisionData = item.attributes || item;
          const pdfUrl = decisionData?.pdf?.url || null;

          return {
            id: item.id,
            title: decisionData?.title ?? "Untitled Decision",
            description: decisionData?.description ?? "No description available",
            date: decisionData?.date ?? "No Date",
            pdf: pdfUrl
          };
        });

        // Fetch page header with error handling
        try {
          const pageRes = await axios.get(
            `${STRAPI_API_URL}/decisions-page?locale=${i18n.language}`,
            { timeout: 5000 }
          );
          const pageData = pageRes.data.data || {};
          
          setPageContent({
            title: pageData?.title || t('decisions:title'),
            description: pageData?.description || t('decisions:description'),
          });
        } catch (pageError) {
          console.warn("Could not fetch decisions page content:", pageError);
          setPageContent({
            title: t('decisions:title'),
            description: t('decisions:description'),
          });
        }

        setDecisionsData(formattedDecisions);
      } catch (err) {
        console.error("API Error:", err);
        
        if (err.code === 'ECONNABORTED') {
          setError(t("common:timeout_error") || "Request timeout. Please check your connection.");
        } else if (err.response) {
          setError(t("common:api_error") || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError(t("common:connection_error") || "Cannot connect to server. Please check if Strapi is running.");
        } else {
          setError(t("common:api_error") || "Failed to load decisions");
        }
        
        setDecisionsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  // Sort + filter
  const sortedDecisions = [...decisionsData].sort(sortByDate);
  const filteredDecisions = sortedDecisions.filter(decision =>
    (decision.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (decision.description || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (decision.date || '').toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDecisions.length / itemsPerPage);
  const paginatedDecisions = filteredDecisions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const handleOpenModal = useCallback(decision => setSelectedDecision(decision), []);
  const handleCloseModal = useCallback(() => setSelectedDecision(null), []);

  // Share handler
  const handleShare = async (platform) => {
    if (!selectedDecision) return;

    const shareUrl = window.location.origin + `/decisions?id=${selectedDecision.id}`;
    const shareTitle = `Check out this decision: ${selectedDecision.title}`;
    const shareText = selectedDecision.description;

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
        
        {/* Debug information */}
        <div className="mt-4 text-start mx-auto" style={{maxWidth: '600px'}}>
          <details>
            <summary className="text-muted">Debug Information</summary>
            <div className="mt-2 p-3 bg-light rounded">
              <p><strong>API URL:</strong> {STRAPI_API_URL}/decisions</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
              <p><strong>Base URL:</strong> {STRAPI_BASE_URL}</p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page header */}
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-file-earmark-text me-2"></i>{pageContent.title}
      </h2>
      <p className="text-center text-muted mx-auto" style={{ maxWidth: '720px' }}>
        {pageContent.description}
      </p>

      {/* Search + List */}
      <div className="row mt-5">
        <div className="col-lg-8 custom-width-73">
          <div className="mb-4">
            <input
              type="text"
              placeholder={t('decisions:searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control w-100 mx-auto"
            />
          </div>

          <div className={`decisions-list-container bg-white rounded p-4 shadow-sm ${isMobile ? 'mobile-scrollable' : ''}`}>
            {filteredDecisions.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {paginatedDecisions.map(decision => (
                  <li key={decision.id} className="decision-item py-3">
                    <div className="d-flex align-items-center flex-grow-1">
                      <i className="bi bi-file-earmark-text me-3 decision-item-icon"></i>
                      <div>
                        <h6 className="mb-0 decision-item-title">{decision.title}</h6>
                        <small className="decision-item-date">
                          <i className="bi bi-calendar-event me-1"></i>{decision.date}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button className="consulter-link" onClick={() => handleOpenModal(decision)}>
                        <i className="bi bi-eye"></i>
                        <span className="ms-1">{t('decisions:consult')}</span>
                      </button>
                      {decision.pdf && (
                        <button 
                          onClick={() => handleDownload(decision.pdf, `${decision.title}.pdf`)}
                          className="btn btn-primary-custom btn-sm"
                        >
                          <i className="bi bi-download me-2"></i>{t('decisions:download')}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info text-center mt-4">
                {t('decisions:noResults')}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
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
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedDecision && (
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
                  <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedDecision.title}</h5>
                  <small className="text-muted d-block" style={{ fontSize: '0.9rem' }}>{selectedDecision.date}</small>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                <p style={{ textAlign: "justify" }}>{selectedDecision.description}</p>
              </div>
              
              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={handleCloseModal} className="hover-red-btn">
                      {t('decisions:close')}
                    </Button>
                    {selectedDecision.pdf && (
                      <Button
                        variant="primary"
                        onClick={() => handleDownload(selectedDecision.pdf, `${selectedDecision.title}.pdf`)}
                        className="hover-green-btn"
                      >
                        <i className="bi bi-download me-2"></i>
                        {t('decisions:downloadPdf')}
                      </Button>
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