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

import './Rapports.css';

// Strapi API configuration
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

export default function Rapports() {
  const { t, i18n } = useTranslation(['rapports', 'common']);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartPage, setChartPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [rapportsData, setRapportsData] = useState([]);
  const [pageContent, setPageContent] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryColor = 'rgb(5, 40, 106)';
  const itemsPerPage = isMobile ? 5 : 15;
  const chartsPerPage = 6;

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

  // Fetch rapports + page content
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch rapports (main content)
        const rapportsRes = await axios.get(
          `${STRAPI_API_URL}/rapports?locale=${i18n.language}&populate[0]=localizations&populate[1]=pdf&populate[2]=image`
        );

        console.log("Rapports API response:", rapportsRes.data);

        // Debug: Check the first rapport's structure
        if (rapportsRes.data.data.length > 0) {
          const firstRapport = rapportsRes.data.data[0];
          console.log("First rapport data:", firstRapport);
          console.log("First rapport PDF URL:", firstRapport.attributes?.pdf?.url);
          console.log("First rapport Image URL:", firstRapport.attributes?.image?.url);
        }

        const formattedRapports = rapportsRes.data.data.map(item => {
          const rapportData = item.attributes || item;

          // Get PDF and image URLs
          const pdfUrl = rapportData?.pdf?.url || null;
          const imageUrl = rapportData?.image?.url || null;

          return {
            id: item.id,
            title: rapportData?.title || "Untitled Rapport",
            description: rapportData?.description || "No description available",
            date: rapportData?.date || "No date",
            pdf: pdfUrl,
            image: imageUrl
          };
        });

        // Fetch page content
        const pageRes = await axios.get(
          `${STRAPI_API_URL}/rapports-page?locale=${i18n.language}`
        );
        const pageData = pageRes.data.data;

        setRapportsData(formattedRapports);
        setPageContent({
          title: pageData?.title || '',
          description: pageData?.description || '',
        });

      } catch (err) {
        console.error("API Error:", err);
        setError(t("common:api_error") || "Failed to load rapports");
        setRapportsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  // Filter + paginate
  const sortedRapports = [...rapportsData].sort(sortByDate);
  const filteredRapports = sortedRapports.filter(rapport =>
    (rapport.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (rapport.description || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (rapport.date || '').toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredRapports.length / itemsPerPage);
  const paginatedRapports = filteredRapports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalChartPages = Math.ceil(sortedRapports.length / chartsPerPage);
  const paginatedCharts = sortedRapports.slice(
    (chartPage - 1) * chartsPerPage,
    chartPage * chartsPerPage
  );

  // Modal handlers
  const handleOpenModal = useCallback((rapport) => {
    setSelectedRapport(rapport);
  }, []);
  
  const handleOpenChartModal = useCallback((chart) => {
    setSelectedChart(chart);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setSelectedRapport(null);
    setSelectedChart(null);
  }, []);

  // Function to handle file download for all devices
  const handleDownload = useCallback((pdfUrl, filename) => {
    if (!pdfUrl) {
      console.error('No PDF URL provided');
      return;
    }
    
    try {
      // Create a temporary anchor tag
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = filename || 'document.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download initiated for:', filename);
    } catch (error) {
      console.error('Error downloading the file:', error);
      window.open(pdfUrl, '_blank');
    }
  }, []);

  // Share handler
  const handleShare = async (platform) => {
    const item = selectedRapport || selectedChart;
    if (!item) return;

    const shareUrl = window.location.origin + `/rapports?id=${item.id}`;
    const shareTitle = `Check out this report: ${item.title}`;
    const shareText = item.description || `A chart from the report titled: ${item.title}`;

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
        <i className="bi bi-bar-chart-fill me-2"></i>{pageContent.title}
      </h2>
      <p className="text-center text-muted mx-auto" style={{ maxWidth: '720px' }}>
        {pageContent.description}
      </p>

      <div className="row mt-5">
        <div className="col-lg-8 custom-width-73">
          <div className="mb-4">
            <input
              type="text"
              placeholder={t('rapports:searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control w-100 mx-auto"
            />
          </div>

          <div className={`rapports-list-container bg-white rounded p-4 shadow-sm ${isMobile ? 'mobile-scrollable' : ''}`}>
            {filteredRapports.length > 0 ? (
              <ul className="list-unstyled mb-0">
                {paginatedRapports.map(rapport => (
                  <li key={rapport.id} className="rapport-item py-3">
                    <div className="d-flex align-items-center flex-grow-1">
                      <i className="bi bi-file-earmark-bar-graph me-3 rapport-item-icon"></i>
                      <div>
                        <h6 className="mb-0 rapport-item-title">{rapport.title}</h6>
                        <small className="rapport-item-date">
                          <i className="bi bi-calendar-event me-1"></i>{rapport.date}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 rapport-actions">
                      <button className="consulter-link" onClick={() => handleOpenModal(rapport)}>
                        <i className="bi bi-eye"></i>
                        <span className="ms-1">{t('rapports:consult')}</span>
                      </button>
                      {rapport.pdf && (
                        <button 
                          onClick={() => handleDownload(rapport.pdf, `${rapport.title}.pdf`)}
                          className="btn btn-primary-custom btn-sm"
                        >
                          <i className="bi bi-download me-2"></i>{t('rapports:download')}
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info text-center mt-4">
                {t('rapports:noResults')}
              </div>
            )}
          </div>
          
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
          
          {currentPage === 1 && (
            <div className="latest-charts-section">
              <hr className="chart-section-divider" />
              <h3 className="mb-4" style={{ color: primaryColor, textAlign: 'center' }}>
                <i className="bi bi-graph-up-arrow me-2"></i>{t('rapports:latestChartsTitle')}
              </h3>
              <div className="charts-scroll-wrapper">
                <div className="row g-4">
                  {paginatedCharts.map((chart, index) => (
                    <React.Fragment key={index}>
                      <div 
                        className="col-md-4 chart-slide-item" 
                        onClick={() => handleOpenChartModal(chart)}
                      >
                        <div className="chart-card bg-white p-4 rounded shadow-sm">
                          <h5 className="chart-title text-center">{chart.title}</h5>
                          <hr className="chart-divider" />
                          {chart.image && (
                            <img 
                              src={chart.image} 
                              alt={`Chart for ${chart.title}`} 
                              className="chart-card-image img-fluid" 
                            />
                          )}
                        </div>
                      </div>
                      {/* Add a line after every third chart */}
                      {(index + 1) % 3 === 0 && <hr className="w-100 my-4 chart-row-divider" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {totalChartPages > 1 && (
                <div className="d-flex justify-content-center mt-4 chart-pagination">
                  <ul className="pagination">
                    {[...Array(totalChartPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${chartPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setChartPage(i + 1)}
                      >
                        <button className="page-link">{i + 1}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <hr className="chart-section-divider-bottom" />
            </div>
          )}
        </div>

        <div className="col-lg-4 custom-width-27 mt-4 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>
      
      <AnimatePresence>
        {selectedRapport && (
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
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '1rem',
                  zIndex: 20
                }}
              >
                <i className="bi bi-x-lg" style={{ color: 'black' }}></i>
              </button>

              <div className="modal-header" style={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderBottom: '1px solid #dee2e6' }}>
                <div style={{ textAlign: 'left' }}>
                  <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedRapport.title}</h5>
                  <small className="text-muted d-block" style={{ fontSize: '0.9rem' }}>{selectedRapport.date}</small>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                <p style={{ textAlign: "justify" }}>{selectedRapport.description}</p>
              </div>
              
              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="d-flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleCloseModal}
                      className="hover-red-btn"
                    >
                      {t('rapports:close')}
                    </Button>
                    {selectedRapport.pdf && (
                      <Button
                        variant="primary"
                        onClick={() => handleDownload(selectedRapport.pdf, `${selectedRapport.title}.pdf`)}
                        className="hover-green-btn"
                      >
                        <i className="bi bi-download me-2"></i>
                        {t('rapports:downloadPdf')}
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

      <AnimatePresence>
        {selectedChart && (
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
              >
                <i className="bi bi-x-lg" style={{ color: 'black' }}></i>
              </button>

              <div className="modal-header">
                <div className="text-center w-100">
                  <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedChart.title}</h5>
                  <hr className="chart-modal-divider" />
                </div>
              </div>
              
              <div className="modal-body text-center">
                {selectedChart.image && (
                  <img 
                    src={selectedChart.image} 
                    alt={selectedChart.title} 
                    style={{ maxWidth: '100%', height: 'auto' }} 
                  />
                )}
              </div>
              
              <div className="modal-footer">
                <div className="social-share-container d-flex gap-2 w-100 justify-content-center">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}