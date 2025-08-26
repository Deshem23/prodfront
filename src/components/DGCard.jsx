// src/components/DGCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './DGCard.css';

const DGCard = ({ name, photo, title, role, onClick, isCurrent }) => {
  const { t } = useTranslation('about');

  return (
    <>
      <motion.div 
        className="card shadow-sm p-4 bg-light dg-card" 
        onClick={onClick}
        // Hover and tap animations
        whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.95 }}
        // Initial and transition properties
        initial={{ scale: 1, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <a href="#" onClick={e => e.preventDefault()}>
          <div className="dg-photo-container">
            <img src={photo} alt={`Photo de ${name}`} />
          </div>
        </a>
        <div className="dg-card-content">
          <h6 className="mb-1">{name}</h6>
          <small className="text-muted d-block">{title}</small>
          <small className="text-muted d-block">{role}</small>
          <div className="dg-button-container">
            <button className="btn btn-sm" style={{ backgroundColor: 'var(--primary-color)', color: '#fff' }} onClick={onClick}>
              <i className="bi bi-eye me-2"></i> {t("view_more")}
            </button>
          </div>
        </div>
      </motion.div>
      {isCurrent && (
        <hr className="horizontal-rule-danger" style={{ borderWidth: '3px', marginTop: '10px' }} />
      )}
    </>
  );
};

DGCard.propTypes = {
  name: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool,
};

DGCard.defaultProps = {
  isCurrent: false,
};

export default DGCard;