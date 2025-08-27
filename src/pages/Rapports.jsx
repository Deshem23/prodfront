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

// Helper function to sort by date
const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

// Strapi API configuration - USING ENVIRONMENT VARIABLES PROPERLY
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL || window.location.origin;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

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
  const [chartsData, setChartsData] = useState([]);
  const [pageContent, setPageContent] = useState({ 
    title: '', 
    description: '',
    chartsTitle: '' 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const primaryColor = 'rgb(5, 40, 106)';
  const itemsPerPage = isMobile ? 5 : 7;
  const chartsPerPage = 6;

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

        console.log("Attempting to fetch from:", `${STRAPI_API_URL}/rapports?locale=${i18n.language}&populate=*`);

        // Fetch rapports list
        const rapportsRes = await axios.get(
          `${STRAPI_API_URL}/rapports?locale=${i18n.language}&populate=*`,
          { timeout: 10000 }
        );

        console.log("Rapports API response:", rapportsRes.data);

        // Format rapports data
        const formattedRapports = rapportsRes.data.data.map(item => {
          const rapportData = item.attributes || item;
          const pdfUrl = rapportData?.pdf?.url || null;

          return {
            id: item.id,
            title: rapportData?.title ?? "Untitled Rapport",
            description: rapportData?.description ?? "No description available",
            date: rapportData?.date ?? "No Date",
            pdf: pdfUrl
          };
        });

        // Fetch charts/images
        try {
          const chartsRes = await axios.get(
            `${STRAPI_API_URL}/rapport-images?locale=${i18n.language}&populate=*`,
            { timeout: 5000 }
          );
          const charts = chartsRes.data.data.map(img => {
            const chartData = img.attributes || img;
            return {
              id: img.id,
              title: chartData?.title || "Untitled Chart",
              image: chartData?.image?.url ||  null
            };
          });
          setChartsData(charts);
        } catch (chartsError) {
          console.warn("Could not fetch charts:", chartsError);
          setChartsData([]);
        }

        // Fetch page content
        try {
          const pageRes = await axios.get(
            `${STRAPI_API_URL}/rapport-page?locale=${i18n.language}`,
            { timeout: 5000 }
          );
          const pageData = pageRes.data.data || {};
          
          setPageContent({
            title: pageData?.title || t('rapports:title'),
            description: pageData?.description || t('rapports:description'),
            chartsTitle: pageData?.latestChartsTitle || t('rapports:latestChartsTitle')
          });
        } catch (pageError) {
          console.warn("Could not fetch rapports page content:", pageError);
          setPageContent({
            title: t('rapports:title'),
            description: t('rapports:description'),
            chartsTitle: t('rapports:latestChartsTitle')
          });
        }

        setRapportsData(formattedRapports);
      } catch (err) {
        console.error("API Error:", err);
        
        if (err.code === 'ECONNABORTED') {
          setError(t("common:timeout_error") || "Request timeout. Please check your connection.");
        } else if (err.response) {
          setError(t("common:api_error") || `Server error: ${err.response.status}`);
        } else if (err.request) {
          setError(t("common:connection_error") || "Cannot connect to server. Please check if Strapi is running.");
        } else {
          setError(t("common:api_error") || "Failed to load rapports");
        }
        
        setRapportsData([]);
        setChartsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  // Sort + filter
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

  const totalChartPages = Math.ceil(chartsData.length / chartsPerPage);
  const paginatedCharts = chartsData.slice((chartPage - 1) * chartsPerPage, chartPage * chartsPerPage);

  // Modal handlers
  const handleOpenModal = useCallback(rapport => setSelectedRapport(rapport), []);
  const handleOpenChartModal = useCallback(chart => setSelectedChart(chart), []);
  const handleCloseModal = useCallback(() => { 
    setSelectedRapport(null); 
    setSelectedChart(null); 
  }, []);

  // Share handler
  const handleShare = async (platform) => {
    const item = selectedRapport || selectedChart;
    if (!item) return;

    const shareUrl = window.location.origin + `/rapports?id=${item.id}`;
    const shareTitle = item.title;
    const shareText = item.description || '';

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
              <p><strong>API URL:</strong> {STRAPI_API_URL}/rapports</p>
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
      className="container my-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page header */}
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-bar-chart-fill me-2"></i>{pageContent.title}
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
                          <i className="bi bi-download me-2"></i>{t('rapports:downloadPdf')}
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

          {/* Charts Section */}
          {currentPage === 1 && chartsData.length > 0 && (
            <div className="latest-charts-section">
              <hr className="chart-section-divider" />
              <h3 className="mb-4 text-center" style={{ color: primaryColor }}>
                <i className="bi bi-graph-up-arrow me-2"></i>{pageContent.chartsTitle}
              </h3>
              <div className="charts-scroll-wrapper">
                <div className="row g-4">
                  {paginatedCharts.map((chart, index) => (
                    <React.Fragment key={index}>
                      <div className="col-md-4 chart-slide-item" onClick={() => handleOpenChartModal(chart)}>
                        <div className="chart-card bg-white p-4 rounded shadow-sm">
                          <h5 className="chart-title text-center">{chart.title}</h5>
                          <hr className="chart-divider" />
                          {chart.image && <img src={chart.image} alt={chart.title} className="chart-card-image img-fluid" />}
                        </div>
                      </div>
                      {(index + 1) % 3 === 0 && <hr className="w-100 my-4 chart-row-divider" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Charts Pagination */}
              {totalChartPages > 1 && (
                <div className="d-flex justify-content-center mt-4 chart-pagination">
                  <ul className="pagination">
                    {[...Array(totalChartPages)].map((_, i) => (
                      <li key={i} className={`page-item ${chartPage === i + 1 ? 'active' : ''}`} onClick={() => setChartPage(i + 1)}>
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

        {/* Sidebar */}
        <div className="col-lg-4 custom-width-27 mt-4 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
        </div>
      </div>

      {/* Rapport Modal */}
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
                style={{ padding: '0.3rem 0.6rem', fontSize: '1rem', zIndex: 20 }}
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
                    <Button variant="secondary" onClick={handleCloseModal} className="hover-red-btn">
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

      {/* Chart Modal */}
      <AnimatePresence>
        {selectedChart && (
          <motion.div className="custom-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal}>
            <motion.div className="custom-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', maxHeight: '95vh', maxWidth: '800px' }}>
              
              <button onClick={handleCloseModal} className="custom-modal-close-button">{t('rapports:close')}</button>

              <div className="modal-header text-center">
                <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedChart.title}</h5>
                <hr className="chart-modal-divider" />
              </div>
              
              <div className="modal-body text-center">
                {selectedChart.image && <img src={selectedChart.image} alt={selectedChart.title} style={{ maxWidth: '100%', height: 'auto' }} />}
              </div>

              <div className="modal-footer d-flex justify-content-center gap-2">
                <button onClick={() => handleShare('facebook')} className="share-icon-button"><FaFacebookF className="share-icon facebook" /></button>
                <button onClick={() => handleShare('twitter')} className="share-icon-button"><FaXTwitter className="share-icon twitter" /></button>
                <button onClick={() => handleShare('whatsapp')} className="share-icon-button"><FaWhatsapp className="share-icon whatsapp" /></button>
                <button onClick={() => handleShare('email')} className="share-icon-button"><MdEmail className="share-icon email" /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}