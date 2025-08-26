import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import React, { useState } from 'react';
import FormerDGsCarousel from '../components/FormerDGsCarousel';
import DGCard from '../components/DGCard';
import RightSidebar from '../components/RightSidebar';
import "./Apropos.css";

const AproposSkeleton = () => {
  return (
    <div className="apropos-page-content container">
      <div className="skeleton-line mb-4" style={{ height: '35px', width: '70%', backgroundColor: '#eee', borderRadius: '5px' }}></div>
      <div className="row">
        <div className="col-lg-8">
          <div className="skeleton-text-block mb-4" style={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <div className="skeleton-line mb-2" style={{ height: '18px', width: '95%', backgroundColor: '#e0e0e0' }}></div>
            <div className="skeleton-line mb-2" style={{ height: '18px', width: '90%', backgroundColor: '#e0e0e0' }}></div>
            <div className="skeleton-line mb-4" style={{ height: '18px', width: '80%', backgroundColor: '#e0e0e0' }}></div>
          </div>
          <div className="skeleton-line mt-4 mb-2" style={{ height: '25px', width: '50%', backgroundColor: '#e0e0e0' }}></div>
          <div className="skeleton-text-block" style={{ backgroundColor: '#f5f5f5', borderRadius: '5px', height: '120px' }}></div>
        </div>
        <div className="col-lg-4 custom-width-27 offset-lg-0">
          <div className="skeleton-card mb-4" style={{ height: '300px', backgroundColor: '#e0e0e0', borderRadius: '16px' }}></div>
          <div className="skeleton-card mb-4" style={{ height: '200px', backgroundColor: '#e0e0e0', borderRadius: '16px' }}></div>
          <div className="skeleton-card" style={{ height: '250px', backgroundColor: '#e0e0e0', borderRadius: '16px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default function Apropos() {
  const { t, ready } = useTranslation(['about', 'common', 'home']);

  const [selectedDg, setSelectedDg] = useState(null);
  const [showNewDgModal, setShowNewDgModal] = useState(false);

  const handleShowNewDgModal = (dgKey) => {
    setSelectedDg(dgKey);
    setShowNewDgModal(true);
  };

  const handleCloseNewDgModal = () => {
    setShowNewDgModal(false);
    setSelectedDg(null);
  };

  const directors = {
    previlon_huguens: {
      name: t('about:directors.previlon_huguens.name'),
      photo: "/leaders/previlon_huguens.jpg",
      title: t('about:directors.previlon_huguens.title'),
      role: t('about:leadership.director'),
      social: {
        linkedin: t('about:directors.previlon_huguens.social.linkedin'),
        facebook: t('about:directors.previlon_huguens.social.facebook'),
        twitter: t('about:directors.previlon_huguens.social.twitter')
      },
      bio: t('about:directors.previlon_huguens.bio')
    }
  };

  if (!ready) {
    return <AproposSkeleton />;
  }

  return (
    <motion.div
      className="apropos-page-content container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <hr className="horizontal-rule-danger hr-closer" />

      {/* Main Content (73%) and Side Cards (27%) section */}
      <h2 className="mb-4 pb-3 border-bottom border-danger">
        <i className="bi bi-building me-2"></i>
        {t("about:title")}
      </h2>
      <div className="row d-flex justify-content-between">
        <div className="col-lg-8 custom-width-73">
          <p className="text-muted">{t("about:intro")}</p>
          <h5 className="mt-4 pb-1 border-bottom border-danger">
            {t("about:mission_title")}
          </h5>
          <p>{t("about:mission.full_text")}</p>
          <h5 className="mt-4 pb-1 border-bottom border-danger">
            {t("about:vision_title")}
          </h5>
          <p>{t("about:vision_text")}</p>
          <h5 className="mt-4 pb-1 border-bottom border-danger">
            {t("about:values_title")}
          </h5>
          <p>{t("about:values.full_text")}</p>

          <div className="mt-5">
            <h3 className="mb-4 pb-1 border-bottom border-danger">{t("about:laws_title")}</h3>
            <p className="text-muted">
              {t("about:laws_intro") || t("about:laws_description")}
            </p>

            <div className="mt-5">
              <h4 className="mb-4 pb-1 border-bottom border-danger">
                <i className="bi bi-calendar-date me-2"></i>
                {t("about:timeline_title")}
              </h4>
              <p className="text-muted">
                {t("about:timeline.full_text")}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="mb-4 pb-1 border-bottom border-danger text-uppercase">
              {t("about:directors_general_title")}
            </h4>
            <div className="row">
              <div className="col-lg-6 d-flex flex-column align-items-center">
                <h5 className="mb-4 text-center">
                  {t("about:current_dg")}
                </h5>
                <div className="dg-card-container-fixed">
                  <DGCard
                    name={directors.previlon_huguens.name}
                    photo={directors.previlon_huguens.photo}
                    title={directors.previlon_huguens.title}
                    role={t("about:leadership.director")}
                    social={directors.previlon_huguens.social}
                    onClick={() => handleShowNewDgModal('previlon_huguens')}
                    isCurrent={true}
                  />
                </div>
              </div>
              
              <div className="col-lg-6">
                <h5 className="mb-4 text-center">
                  {t("about:former_directors_general")}
                </h5>
                <div className="p-4 card shadow-sm">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <FormerDGsCarousel fadeColor="blue" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="mb-4 pb-1 border-bottom border-danger text-uppercase">
              {t("about:foundational_texts_title")}
            </h4>
            <div className="d-flex align-items-start flex-wrap">
                <a
                  href="/path/to/your/decret_de_creation.pdf"
                  download
                  className="download-link text-center me-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                    <i className="bi bi-file-text-fill"></i>
                    <p className="mb-0 text-muted">{t("about:creation_decree_title")}</p>
                </a>
                <a
                  href="/path/to/your/loi_organique_du_conatel.pdf"
                  download
                  className="download-link text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                    <i className="bi bi-journal-text"></i>
                    <p className="mb-0 text-muted">{t("about:organic_law_title")}</p>
                </a>
            </div>
          </div>

        </div>
        
        <RightSidebar />

      </div>
      
      <hr className="my-5 horizontal-rule-danger" />

      <AnimatePresence>
        {showNewDgModal && selectedDg && (
          <motion.div
            className="new-dg-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseNewDgModal}
          >
            <motion.div
              className="new-dg-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={handleCloseNewDgModal} className="new-dg-modal-close-button">
                <i className="bi bi-x-lg"></i>
              </button>

              <div className="dg-modal-desktop-layout">
                <div className="dg-modal-sidebar">
                  <div className="dg-modal-sidebar-content">
                    <div className="dg-modal-image-container">
                        <img src={`/leaders/${selectedDg}.jpg`} alt={directors[selectedDg].name} />
                    </div>
                    <div className="dg-modal-info-container">
                        <h4>{directors[selectedDg].name}</h4>
                        <p className="title">{directors[selectedDg].title}</p>
                    </div>
                    <hr className="dg-modal-separator"/>
                    {directors[selectedDg].social && (
                      <div className="social-links d-flex justify-content-center">
                        {directors[selectedDg].social.linkedin && (
                          <a href={directors[selectedDg].social.linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        )}
                        {directors[selectedDg].social.facebook && (
                          <a href={directors[selectedDg].social.facebook} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-facebook"></i>
                          </a>
                        )}
                        {directors[selectedDg].social.twitter && (
                          <a href={directors[selectedDg].social.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <img
                    src="/coat-of-arms.png"
                    alt="Coat of arms"
                    className="dg-modal-coat-of-arms"
                  />
                </div>
                <div className="dg-modal-article-content">
                  <div className="dg-modal-header">
                    <h5>{t("about:biography_title")}</h5>
                  </div>
                  <div className="dg-modal-body">
                    {t(`about:directors.${selectedDg}.bio`).split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dg-modal-mobile-layout">
                <div className="dg-modal-mobile-header">
                  <div className="dg-modal-header-info">
                    <div className="dg-modal-image-container-mobile">
                      <img src={`/leaders/${selectedDg}.jpg`} alt={directors[selectedDg].name} />
                    </div>
                    <div className="dg-modal-info-container-mobile">
                      <h4>{directors[selectedDg].name}</h4>
                      <p className="title">{directors[selectedDg].title}</p>
                    </div>
                  </div>
                  <hr className="dg-modal-mobile-separator"/>
                  {directors[selectedDg].social && (
                    <div className="dg-modal-social-row-mobile">
                      <div className="dg-modal-social-links-mobile">
                        {directors[selectedDg].social.linkedin && (
                          <a href={directors[selectedDg].social.linkedin} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-linkedin"></i>
                          </a>
                        )}
                        {directors[selectedDg].social.facebook && (
                          <a href={directors[selectedDg].social.facebook} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-facebook"></i>
                          </a>
                        )}
                        {directors[selectedDg].social.twitter && (
                          <a href={directors[selectedDg].social.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-twitter-x"></i>
                          </a>
                        )}
                      </div>
                      <img
                        src="/coat-of-arms.png"
                        alt="Coat of arms"
                        className="dg-modal-coat-of-arms-mobile"
                      />
                    </div>
                  )}
                </div>

                <div className="dg-modal-article-content-mobile">
                  <div className="dg-modal-header">
                    <h5>{t("about:biography_title")}</h5>
                  </div>
                  <div className="dg-modal-body">
                    {t(`about:directors.${selectedDg}.bio`).split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
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