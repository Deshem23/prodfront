import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from 'react-bootstrap';
import axios from 'axios';

// Import Social Media Icons
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

import LatestNewsCard from '../components/LatestNewsCard';
import ChantiersCard from '../components/ChantiersCard';
import StatsCard from '../components/StatsCard';
import SocialsCard from '../components/SocialsCard';

import './Chantiers.css';

// Strapi API configuration - USING ENVIRONMENT VARIABLES PROPERLY
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || window.location.origin;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function Chantiers() {
  const { t, i18n } = useTranslation(['chantiers', 'common']);
  const primaryColor = "rgb(5, 40, 106)";
  
  const [chantiersData, setChantiersData] = useState([]);
  const [pageContent, setPageContent] = useState({ title: '', subtitle: '' });
  const [selectedChantier, setSelectedChantier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 3;

  // Fetch data from Strapi with proper error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch page content
        const pageRes = await axios.get(
          `${STRAPI_API_URL}/chantiers-page?locale=${i18n.language}`,
          { timeout: 10000 }
        );
        const pageContentData = pageRes.data.data.attributes || {};
        setPageContent({
          title: pageContentData.title || t('chantiers:title'),
          subtitle: pageContentData.subtitle || t('chantiers:subtitle'),
        });

        // Fetch chantiers with nested data (images and documentation)
        const chantiersRes = await axios.get(
          `${STRAPI_API_URL}/chantiers?locale=${i18n.language}&populate[0]=image&populate[1]=documentation.file`,
          { timeout: 10000 }
        );

        const fetchedChantiers = chantiersRes.data.data.map((item) => {
          const chantierData = item.attributes || item;
          const imageUrl = chantierData?.image?.data?.attributes?.url;
          
          return {
            id: item.id,
            // Dynamically get the icon class from Strapi
            iconClass: chantierData?.icon_class,
            // Correctly form the image URL
            image: imageUrl ? `${STRAPI_BASE_URL}${imageUrl}` : null,
            // The following fields will be handled by i18n
            shortTitle: chantierData?.short_title,
            shortText: chantierData?.short_text,
            longText: chantierData?.long_text,
            documentation: chantierData.documentation?.data?.map(doc => {
              const docData = doc.attributes || doc;
              return {
                name: docData?.name,
                // Correctly form the document URL
                link: docData?.file?.data?.attributes?.url ? `${STRAPI_BASE_URL}${docData.file.data.attributes.url}` : '#'
              };
            }) || [],
          };
        });
        
        setChantiersData(fetchedChantiers);

      } catch (err) {
        console.error("API Error:", err);
        if (err.response) {
            setError(t("common:api_error"));
        } else {
            setError(t("common:connection_error"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  const handleOpenModal = useCallback((chantier) => {
    setSelectedChantier(chantier);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedChantier(null);
  }, []);

  const totalPages = Math.ceil(chantiersData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentChantiers = chantiersData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleShare = async (platform) => {
    if (!selectedChantier) return;
    
    const shareUrl = window.location.origin + window.location.pathname + '#' + selectedChantier.id;
    // Assuming i18n keys match the data from Strapi
    const shareTitle = t(`chantiers.${selectedChantier.shortTitle}`);
    const shareText = t(`chantiers.${selectedChantier.shortText}`);

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
      className="container py-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-hammer me-2"></i>{pageContent.title}
      </h2>

      <p className="text-center text-muted mx-auto" style={{ maxWidth: "720px" }}>
        {pageContent.subtitle}
      </p>

      <hr className="my-4" style={{ borderTop: "2px solid #ccc", width: "120px", margin: "2rem auto" }} />

      <div className="row">
        <div className="col-lg-8 custom-width-73">
          {currentChantiers.map((chantier) => (
            <motion.div
              key={chantier.id}
              id={chantier.id}
              className="chantier-item mb-4 p-3 rounded border d-flex flex-column"
              whileHover={{ backgroundColor: '#f8f9fa' }}
            >
              <img src={chantier.image} alt={t(`chantiers.${chantier.id}.shortTitle`)} className="img-fluid mb-3 rounded chantier-image" />
              <h5 style={{ color: primaryColor }}>
                {/* Dynamically render the icon based on the class name from Strapi */}
                {chantier.iconClass && <i className={`${chantier.iconClass} me-2`}></i>}
                {t(`chantiers.${chantier.shortTitle}`)}
              </h5>
              <p className="flex-grow-1 text-muted">
                {t(`chantiers.${chantier.shortText}`)}
              </p>
              <button
                className="btn btn-primary mt-2 align-self-start"
                onClick={() => handleOpenModal(chantier)}
              >
                {t('chantiers.moreInfoButton')}
              </button>
            </motion.div>
          ))}
          
          {totalPages > 1 && (
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center mt-4">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                    {t('chantiers.previous')}
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
                    {t('chantiers.next')}
                  </button>
                </li>
              </ul>
            </nav>
          )}

        </div>

        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard chantiers={chantiersData} />
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
                    {selectedChantier.iconClass && <i className={`${selectedChantier.iconClass} me-2`}></i>}
                    {t(`chantiers.${selectedChantier.shortTitle}`)}
                  </h5>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                <p style={{ textAlign: "justify" }}>{t(`chantiers.${selectedChantier.longText}`)}</p>
              </div>
              
              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                
                {selectedChantier?.documentation && selectedChantier.documentation.length > 0 && (
                  <div className="documentation-section w-100 mb-3">
                    <h6 className="text-start">{t('chantiers.documentationTitle')}</h6>
                    <div className="d-flex flex-wrap justify-content-start gap-2 mt-2">
                      {selectedChantier.documentation.map((doc, index) => (
                        <a key={index} href={doc.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm">
                          {doc.name}
                          <i className="bi bi-file-earmark-arrow-down-fill ms-1"></i>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-flex justify-content-between align-items-center w-100">
                  <button onClick={handleCloseModal} className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                    {t('chantiers.close')}
                  </button>

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