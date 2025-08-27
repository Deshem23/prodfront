import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// Sidebar Components
import LatestNewsCard from '../components/LatestNewsCard';
import ChantiersCard from '../components/ChantiersCard';
import StatsCard from '../components/StatsCard';
import SocialsCard from '../components/SocialsCard';

import './Rapports.css';

// Use environment variable for API URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:1337';
const API_URL = `${API_BASE}/api`;

const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);

export default function Rapports() {
  const { t, i18n } = useTranslation(['rapports', 'sidebar']);
  
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [chartPage, setChartPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [pageData, setPageData] = useState({ title: '', description: '', chartsTitle: '' });
  const [rapportsData, setRapportsData] = useState([]);
  const [chartsData, setChartsData] = useState([]);

  const primaryColor = 'rgb(5, 40, 106)';
  const itemsPerPage = 7;
  const chartsPerPage = 6;

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Page title + description (single type)
        const pageRes = await axios.get(`${API_URL}/rapport-page?locale=${i18n.language}`);
        const page = pageRes.data.data || {};
        setPageData({
          title: page.title,
          description: page.description,
          chartsTitle: page.latestChartsTitle || t('latestChartsTitle')
        });

        // Rapports list
        const rapportsRes = await axios.get(`${API_URL}/rapports?populate=pdf&locale=${i18n.language}`);
        const rapports = rapportsRes.data.data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          date: r.date,
          pdf: r.pdf?.url ? `${API_BASE}${r.pdf.url}` : null
        }));
        setRapportsData(rapports);

        // Charts / Images
        const chartsRes = await axios.get(`${API_URL}/rapport-images?populate=image&locale=${i18n.language}`);
        const charts = chartsRes.data.data.map(img => ({
          id: img.id,
          title: img.title,
          image: img.image?.url ? `${API_BASE}${img.image.url}` : null
        }));
        setChartsData(charts);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
    fetchData();
  }, [i18n.language, t]);

  // Handle resize
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

  const sortedRapports = [...rapportsData].sort(sortByDate);
  const filteredRapports = sortedRapports.filter(rapport =>
    (rapport.title || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (rapport.description || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (rapport.date || '').toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRapports.length / itemsPerPage);
  const paginatedRapports = filteredRapports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalChartPages = Math.ceil(chartsData.length / chartsPerPage);
  const paginatedCharts = chartsData.slice((chartPage - 1) * chartsPerPage, chartPage * chartsPerPage);

  // Modals
  const handleOpenModal = useCallback((rapport) => setSelectedRapport(rapport), []);
  const handleOpenChartModal = useCallback((chart) => setSelectedChart(chart), []);
  const handleCloseModal = useCallback(() => { setSelectedRapport(null); setSelectedChart(null); }, []);

  // New function to handle file download
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Download failed. Please try again.');
    }
  };

  // Social share
  const handleShare = async (platform) => {
    const item = selectedRapport || selectedChart;
    if (!item) return;

    const shareUrl = window.location.origin + `/rapports?id=${item.id}`;
    const shareTitle = item.title;
    const shareText = item.description || '';

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
        intentUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
        break;
      default: break;
    }
    if (intentUrl) window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div className="container my-5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      {/* Title + Description */}
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-bar-chart-fill me-2"></i>{pageData.title}
      </h2>
      <p className="text-center text-muted mx-auto" style={{ maxWidth: '720px' }}>
        {pageData.description}
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

          {/* Rapports List */}
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
                      <a href="#" className="consulter-link" onClick={(e) => { e.preventDefault(); handleOpenModal(rapport); }}>
                        <i className="bi bi-eye"></i>
                        <span className="ms-1">{t('consult')}</span>
                      </a>
                      {rapport.pdf && (
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(rapport.pdf, `${rapport.title}.pdf`);
                          }} 
                          className="btn btn-primary-custom btn-sm"
                        >
                          <i className="bi bi-download me-2"></i>{t('downloadPdf')}
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info text-center mt-4">{t('noResults')}</div>
            )}
          </div>

          {/* Rapports Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <ul className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                  <button className="page-link">{i + 1}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Charts Section */}
          {currentPage === 1 && (
            <div className="latest-charts-section">
              <hr className="chart-section-divider" />
              <h3 className="mb-4 text-center" style={{ color: primaryColor }}>
                <i className="bi bi-graph-up-arrow me-2"></i>{pageData.chartsTitle}
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
              <div className="d-flex justify-content-center mt-4 chart-pagination">
                <ul className="pagination">
                  {[...Array(totalChartPages)].map((_, i) => (
                    <li key={i} className={`page-item ${chartPage === i + 1 ? 'active' : ''}`} onClick={() => setChartPage(i + 1)}>
                      <button className="page-link">{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </div>
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

      {/* Rapports Modal */}
      <AnimatePresence>
        {selectedRapport && (
          <motion.div className="custom-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal}>
            <motion.div className="custom-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', maxHeight: '95vh', maxWidth: '800px' }}>
              
              <button onClick={handleCloseModal} className="custom-modal-close-button">
                <i className="bi bi-x-lg" style={{ color: 'black' }}></i> {t('close')}
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
                    <Button variant="secondary" onClick={handleCloseModal}>{t('close')}</Button>
                    {selectedRapport.pdf && (
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(selectedRapport.pdf, `${selectedRapport.title}.pdf`);
                        }} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        {t('downloadPdf')}
                      </a>
                    )}
                  </div>
                  <div className="social-share-container d-flex gap-2">
                    <button onClick={() => handleShare('facebook')} className="share-icon-button"><FaFacebookF className="share-icon facebook" /></button>
                    <button onClick={() => handleShare('twitter')} className="share-icon-button"><FaXTwitter className="share-icon twitter" /></button>
                    <button onClick={() => handleShare('whatsapp')} className="share-icon-button"><FaWhatsapp className="share-icon whatsapp" /></button>
                    <button onClick={() => handleShare('email')} className="share-icon-button"><MdEmail className="share-icon email" /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts Modal */}
      <AnimatePresence>
        {selectedChart && (
          <motion.div className="custom-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal}>
            <motion.div className="custom-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', maxHeight: '95vh', maxWidth: '800px' }}>
              
              <button onClick={handleCloseModal} className="custom-modal-close-button">{t('close')}</button>

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