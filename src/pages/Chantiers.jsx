import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Import Social Media Icons
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; // Correct import for the new X icon
import { MdEmail } from 'react-icons/md';

import LatestNewsCard from '../components/LatestNewsCard';
import ChantiersCard from '../components/ChantiersCard';
import StatsCard from '../components/StatsCard';
import SocialsCard from '../components/SocialsCard';

import './Chantiers.css';

// Import local images from your assets folder
import cybersecuriteImage from '../assets/cybersecurite.jpg';
import signatureImage from '../assets/signatureElectronique.jpg';
import transformationImage from '../assets/transformationNumerique.jpg';
import qosImage from '../assets/qualiteDeService.jpg';

// Data for each chantier with specific icons and images
const chantierData = [
  {
    id: 'cybersecurite',
    icon: <i className="bi bi-shield-shaded me-2"></i>,
    image: cybersecuriteImage,
    documentation: [
      { name: 'Document 1 sur la cybersécurité', link: '#' },
      { name: 'Guide des bonnes pratiques', link: '#' },
    ],
  },
  {
    id: 'signatureElectronique',
    icon: <i className="bi bi-pen-fill me-2"></i>,
    image: signatureImage,
    documentation: [
      { name: 'Loi sur la signature électronique', link: '#' },
      { name: 'Procédure d\'utilisation', link: '#' },
    ],
  },
  {
    id: 'transformationNumerique',
    icon: <i className="bi bi-gear-wide-connected me-2"></i>,
    image: transformationImage,
    documentation: [
      { name: 'Plan de transformation numérique', link: '#' },
      { name: 'Rapport d\'étape', link: '#' },
    ],
  },
  {
    id: 'qualiteDeService',
    icon: <i className="bi bi-speedometer2 me-2"></i>,
    image: qosImage,
    documentation: [
      { name: 'Indicateurs de qualité de service', link: '#' },
      { name: 'Enquête de satisfaction client', link: '#' },
    ],
  },
];

export default function Chantiers() {
  const { t } = useTranslation(['chantiers', 'sidebar']);
  const primaryColor = "rgb(5, 40, 106)";
  const [selectedChantier, setSelectedChantier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  
  const handleShare = async (platform) => {
    if (!selectedChantier) return;
    
    const shareUrl = window.location.origin + window.location.pathname + '#' + selectedChantier.id;
    const shareTitle = t(`chantiers.${selectedChantier.id}.shortTitle`);
    const shareText = t(`chantiers.${selectedChantier.id}.shortText`);

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

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-hammer me-2"></i>{t('chantiers.title')}
      </h2>

      <p className="text-center text-muted mx-auto" style={{ maxWidth: "720px" }}>
        {t('chantiers.subtitle')}
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
                {chantier.icon}
                {t(`chantiers.${chantier.id}.shortTitle`)}
              </h5>
              <p className="flex-grow-1 text-muted">
                {t(`chantiers.${chantier.id}.shortText`)}
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
                    {selectedChantier.icon}
                    {t(`chantiers.${selectedChantier.id}.shortTitle`)}
                  </h5>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                <p style={{ textAlign: "justify" }}>{t(`chantiers.${selectedChantier.id}.longText`)}</p>
              </div>
              
              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                
                {selectedChantier?.documentation && (
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