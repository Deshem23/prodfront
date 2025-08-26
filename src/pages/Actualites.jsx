import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

// Import social media icons
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';

import LatestNewsCard from '../components/LatestNewsCard';
import ChantiersCard from '../components/ChantiersCard';
import StatsCard from '../components/StatsCard';
import SocialsCard from '../components/SocialsCard';
import RightSidebar from '../components/RightSidebar';

import './Actualites.css';

// Strapi API configuration
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function Actualites() {
  const { t, i18n } = useTranslation(['actualites', 'sidebar']);
  const primaryColor = "rgb(5, 40, 106)";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const articlesPerPage = 7;

  const handleOpenModal = useCallback((article) => {
    setSelectedArticle(article);
    setShowImage(false);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
    
        const response = await axios.get(
          `${STRAPI_API_URL}/articles?locale=${i18n.language}&populate=localizations,image,file`
        );
    
        const fetchedArticles = response.data.data.map(item => {
          let articleData = item.attributes || item;
    
          // ✅ Fallback if no content in current locale
          if (!articleData.title && articleData.localizations?.data?.length > 0) {
            articleData = articleData.localizations.data[0].attributes;
          }
    
          // ✅ Get image & pdf/file
          const imageUrl = articleData?.image?.url || null;
          const pdfUrl = articleData?.file?.url || null;
    
          return {
            id: item.id,
            date: articleData?.date ?? "No Date",
            image:
              imageUrl ||
              "https://via.placeholder.com/600x400.png?text=No+Image",
            pdf: pdfUrl || null,
            title: articleData?.title ?? "Untitled",
            fullExcerpt: articleData?.fullExcerpt ?? "No excerpt available.",
            fullText: articleData?.fullText ?? "No content available.",
            publishedAt: articleData?.publishedAt,
          };
        });
    
        // ✅ Sort newest first
        fetchedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        setArticles(fetchedArticles);
      } catch (err) {
        setError("Failed to fetch articles. Please check the API URL and permissions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [i18n.language, searchParams]);

  const handleOpenImageModal = (article) => {
    setSelectedArticle(article);
    setShowImage(true);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    setShowImage(false);
    setSearchParams({});
  };

  const handleShare = async (platform) => {
    if (!selectedArticle) return;

    const shareUrl = window.location.origin + `/actualites?id=${selectedArticle.id}`;
    const shareTitle = `Check out this article: ${selectedArticle.title}`;
    const shareText = selectedArticle.fullExcerpt;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        console.log('Content shared successfully');
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

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <motion.div
      className="container pt-3 pb-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-center mb-3" style={{ color: primaryColor }}>
        <i className="bi bi-newspaper me-2"></i>{t('actualites.title')}
      </h2>

      <p className="text-center text-muted mx-auto" style={{ maxWidth: "720px" }}>
        {t('actualites.subtitle')}
      </p>

      <hr className="my-4" style={{ borderTop: "2px solid #ccc", width: "120px", margin: "2rem auto" }} />

      <div className="row">
        <div className="col-lg-8 custom-width-73">
          <div className="mb-4 text-center">
            <input
              type="text"
              placeholder={t('actualites.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control w-100 mx-auto"
            />
          </div>

          {loading && <div className="text-center">Loading articles...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center">No articles found.</div>
          )}

          {!loading && !error && (
            <>
              <div className="row gy-2">
                {paginatedArticles.map((article) => (
                  <div className="col-12" key={article.id}>
                    <motion.div
                        className="article-card"
                        whileHover={{ scale: 1.01 }}
                    >
                      <div className="mobile-card-top-section">
                        <div className="article-image-container" onClick={() => handleOpenImageModal(article)}>
                            <img
                                src={article.image}
                                className="article-img"
                                alt={article.title}
                            />
                        </div>
                        <div className="article-content-container" onClick={() => handleOpenModal(article)}>
                            <div className="article-header-container">
                                <h5 className="card-title" style={{ color: primaryColor }}>{article.title}</h5>
                                <small className="text-muted d-block">{article.date}</small>
                            </div>
                        </div>
                      </div>
                      <div className="article-text-section" onClick={() => handleOpenModal(article)}>
                        <p className="card-text" style={{ textAlign: "justify" }}>
                            {article.fullExcerpt}
                        </p>
                        <span className="lire-plus-icon">
                            {t('actualites.readMore')} <i className="bi bi-eye"></i>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        });
                      }}
                    >
                      <button className="page-link">{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <LatestNewsCard />
          <ChantiersCard />
          <StatsCard />
          <SocialsCard />
          </div>
      </div>

      <AnimatePresence>
        {selectedArticle && (
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
                  <h5 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{selectedArticle.title}</h5>
                  <small className="text-muted d-block" style={{ fontSize: '0.9rem' }}>{selectedArticle.date}</small>
                </div>
              </div>

              <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', padding: '0.8rem 1rem' }}>
                {showImage ? (
                    <div className="modal-image-container">
                        <img
                            src={selectedArticle.image}
                            alt={selectedArticle.title}
                            className="img-fluid"
                            style={{ maxHeight: '80vh' }}
                        />
                    </div>
                ) : (
                    <p style={{ textAlign: "justify" }}>{selectedArticle.fullText}</p>
                )}
              </div>

              <div className="modal-footer" style={{ position: 'sticky', bottom: 0, backgroundColor: '#ffffff', zIndex: 10, padding: '0.5rem 1rem', borderTop: '1px solid #dee2e6' }}>
                  <div className="d-flex justify-content-between align-items-center w-100">
                      <div className="d-flex gap-2">
                        {!showImage && selectedArticle.image && selectedArticle.image !== 'https://via.placeholder.com/600x400.png?text=No+Image' && (
                            <Button
                                variant="secondary"
                                onClick={() => setShowImage(true)}
                                className="hover-green-btn"
                            >
                                {t('actualites.viewImage')}
                            </Button>
                        )}
                        {showImage && (
                            <Button
                                variant="secondary"
                                onClick={() => setShowImage(false)}
                                className="hover-green-btn"
                            >
                                {t('actualites.backToText')}
                            </Button>
                        )}
                        {!showImage && selectedArticle.pdf && (
                            <a href={selectedArticle.pdf} download className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                                {t('actualites.downloadPdf')}
                            </a>
                        )}
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="hover-red-btn"
                        >
                            {t('actualites.close')}
                        </Button>
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