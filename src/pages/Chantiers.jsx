import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from 'react-bootstrap';
import axios from 'axios';

// Import Social Media Icons
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

// Sidebar Components
import LatestNewsCard from '../components/LatestNewsCard';
import ChantiersCard from '../components/ChantiersCard';
import StatsCard from '../components/StatsCard';
import SocialsCard from '../components/SocialsCard';

import './Chantiers.css';

// Strapi API configuration
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || window.location.origin;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function Chantiers() {
  const { t } = useTranslation(['chantiers', 'common']);
  const primaryColor = "rgb(5, 40, 106)";
  
  const [selectedChantier, setSelectedChantier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [chantierData, setChantierData] = useState([]);
  const [pageContent, setPageContent] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 3;

  // Fetch data from Strapi with proper error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching chantiers from:", `${STRAPI_API_URL}/chantiers?populate=*`);

        // Fetch chantiers list
        const chantiersRes = await axios.get(
          `${STRAPI_API_URL}/chantiers?populate=*`,
          { timeout: 10000 }
        );

        console.log("Chantiers API response:", chantiersRes.data);

        // Format chantiers data
        const formattedChantiers = chantiersRes.data.data.map(item => {
          const chantierData = item.attributes || item;
          const imageUrl = chantierData?.image?.url || null;
          const documentation = chantierData?.documents?.data || [];

          return {
            id: item.id,
            title: chantierData?.title || "Untitled Chantier",
            shortText: chantierData?.shortDescription || "No description available",
            longText: chantierData?.longDescription || "No detailed description available",
            image: imageUrl,
            documentation: documentation.map(doc => {
              const docData = doc.attributes || doc;
              return {
                name: docData?.name || "Document",
                link: docData?.url || "#",
                type: docData?.mime || "application/pdf"
              };
            })
          };
        });

        setChantierData(formattedChantiers);

        // Fetch page content
        try {
          const pageRes = await axios.get(
            `${STRAPI_API_URL}/chantiers-page`,
            { timeout: 5000 }
          );
          const pageData = pageRes.data.data || {};
          
          setPageContent({
            title: pageData?.title || t('chantiers:title'),
            description: pageData?.description || t('chantiers:subtitle')
          });
        } catch (pageError) {
          console.warn("Could not fetch chantiers page content:", pageError);
          setPageContent({
            title: t('chantiers:title'),
            description: t('chantiers:subtitle')
          });
        }

      } catch (err) {
        console.error("API Error:", err);
        
        if (err.code === 'ECONNABORTED') {
          setError(t("common:timeout_error") || "Request timeout. Please check your connection.");
        } else if (err.response) {
          setError(t("common:api_error") || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError(t("common:connection_error") || "Cannot connect to server. Please check if Strapi is running.");
        } else {
          setError(t("common:api_error") || "Failed to load chantiers");
        }
        
        setChantierData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleOpenModal = useCallback((chantier) => {
    setSelectedChantier(chantier);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedChantier(null);
  }, []);

  const totalPages = Math.ceil(chantierData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentChantiers = chantierData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to handle file download
  const handleDownload = useCallback((url, filename) => {
    if (!url) {
      console.error('No file URL provided');
      return;
    }
    
    try {
      // Create a temporary anchor tag
      const link = document.createElement('a');
      
      // Force download by creating a blob URL
      fetch(url)
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
          link.href = url;
          link.download = filename || 'document.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      
    } catch (error) {
      console.error('Error downloading the file:', error);
      // Final fallback - open in new tab
      window.open(url, '_blank');
    }
  }, []);

  const handleShare = async (platform) => {
    if (!selectedChantier) return;
    
    const shareUrl = window.location.origin + '/chantiers#' + selectedChantier.id;
    const shareTitle = selectedChantier.title;
    const shareText = selectedChantier.shortText;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
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

    if (intentUrl) {
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
    }
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
              <p><strong>API URL:</strong> {STRAPI_API_URL}/chantiers</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
              <p><strong>Base URL:</strong> {STRAPI_BASE_URL}</p>
              <p><strong>VITE_STRAPI_API_URL:</strong> {import.meta.env.VITE_STRAPI_API_URL || 'Not set'}</p>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-hammer me-2"></i>{pageContent.title}
      </h2>

      <p className="text-center text-muted mx-auto" style={{ maxWidth: "720px" }}>
        {pageContent.description}
      </p>

      <hr className="my-4" style={{ borderTop: "2px solid #ccc", width: "120px", margin: "2rem auto" }} />

      <div className="row">
        <div className="col-lg-8 custom-width-73">
          {currentChantiers.length > 0 ? (
            <>
              {currentChantiers.map((chantier) => (
                <motion.div
                  key={chantier.id}
                  id={chantier.id}
                  className="chantier-item mb-4 p-3 rounded border d-flex flex-column"
                  whileHover={{ backgroundColor: '#f8f9fa' }}
                >
                  {chantier.image && (
                    <img 
                      src={chantier.image} 
                      alt={chantier.title} 
                      className="img-fluid mb-3 rounded chantier-image" 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <h5 style={{ color: primaryColor }}>
                    <i className="bi bi-gear me-2"></i>
                    {chantier.title}
                  </h5>
                  <p className="flex-grow-1 text-muted">
                    {chantier.shortText}
                  </p>
                  <button
                    className="btn btn-primary mt-2 align-self-start"
                    onClick={() => handleOpenModal(chantier)}
                  >
                    {t('chantiers:moreInfoButton')}
                  </button>
                </motion.div>
              ))}
              
              {totalPages > 1 && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center mt-4">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                        {t('chantiers:previous')}
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                        {t('chantiers:next')}
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            <div className="alert alert-info text-center">
              {t('chantiers:noChantiers')}
            </div>
          )}
        </div>

        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard chantiers={chantierData} />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>
      
      <AnimatePresence>
        {selectedChantier && (
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
                  <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                    <i className="bi bi-gear me-2"></i>
                    {selectedChantier.title}
                  </h5>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                <p style={{ textAlign: "justify" }}>{selectedChantier.longText}</p>
              </div>
              
              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                
                {selectedChantier?.documentation && selectedChantier.documentation.length > 0 && (
                  <div className="documentation-section w-100 mb-3">
                    <h6 className="text-start">{t('chantiers:documentationTitle')}</h6>
                    <div className="d-flex flex-wrap justify-content-start gap-2 mt-2">
                      {selectedChantier.documentation.map((doc, index) => (
                        <button 
                          key={index} 
                          onClick={() => handleDownload(doc.link, doc.name)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          {doc.name}
                          <i className="bi bi-download ms-1"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-flex justify-content-between align-items-center w-100">
                  <Button onClick={handleCloseModal} variant="secondary" className="hover-red-btn">
                    {t('chantiers:close')}
                  </Button>

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