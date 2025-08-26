// src/pages/Contact.jsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { useState } from "react"; 

export default function Contact() {
  // Load the 'contact' namespace for page-specific translations
  const { t } = useTranslation(['contact', 'common']);
  
  // Primary color rgb(5, 40, 106)
  const primaryColor = 'rgb(5, 40, 106)'; 
  const mapEmbedUrl = "http://googleusercontent.com/maps.google.com/18";

  const [formData, setFormData] = useState({
    // Updated state to separate First Name and Last Name
    firstName: '',
    lastName: '',
    email: '',
    telephone: '', 
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Note: 'form_submitted' is accessed via the contact namespace
    alert(t('contact:form_submitted')); 
  };

  return (
    <div className="container my-5">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        
        {/* Main Introduction Section */}
        {/* Changed text-center to text-start for the introduction text container */}
        <div className="mb-4 text-start contact-intro">
          <h1 className="display-4" style={{ color: primaryColor }}>{t('contact:page_title')}</h1>
          {/* Added custom style to justify the intro text */}
          <p className="lead text-muted" style={{ textAlign: 'justify' }}>{t('contact:intro_text')}</p>
        </div>

        {/* Line below the intro */}
        <hr className="my-5" />

        {/* Separate Cards for Form and Contact Info */}
        <div className="row g-4">

          {/* Contact Form Card (col-lg-7) */}
          <div className="col-lg-7">
            <div 
              className="glass-card p-5 h-100" 
              style={{ borderTop: `5px solid ${primaryColor}` }}
            > 
              <h2 className="mb-4" style={{ color: primaryColor }}>{t('contact:title_form')}</h2>
              <p className="text-muted">{t('contact:intro_form')}</p>
              
              <form onSubmit={handleSubmit}>
                
                {/* First Name and Last Name fields (required) */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">{t('contact:firstName_label')}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="firstName" 
                      placeholder={t('contact:firstName_placeholder')} 
                      value={formData.firstName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">{t('contact:lastName_label')}</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="lastName" 
                      placeholder={t('contact:lastName_placeholder')} 
                      value={formData.lastName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                {/* Email field (required) */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">{t('contact:email_label')}</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder={t('contact:email_placeholder')} 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>

                {/* Telephone field (New, required) */}
                <div className="mb-3">
                  <label htmlFor="telephone" className="form-label">{t('contact:telephone_label')}</label>
                  <input 
                    type="tel" 
                    className="form-control" 
                    id="telephone" 
                    placeholder={t('contact:telephone_placeholder')} 
                    value={formData.telephone}
                    onChange={handleChange}
                    required 
                  />
                </div>

                {/* Subject field (required) */}
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">{t('contact:subject_label')}</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="subject" 
                    placeholder={t('contact:subject_placeholder')} 
                    value={formData.subject}
                    onChange={handleChange}
                    required 
                  />
                </div>

                {/* Message field (required, 600 character max) */}
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">{t('contact:message_label')}</label>
                  <textarea 
                    className="form-control" 
                    id="message" 
                    rows="5" 
                    placeholder={t('contact:message_placeholder')} 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={600} 
                  ></textarea>
                  <small className="form-text text-muted">
                    {t('contact:char_limit', { count: 600 })}
                  </small>
                </div>
                
                <button 
                  type="submit" 
                  className="btn px-4" 
                  style={{ backgroundColor: primaryColor, color: '#fff', border: 'none' }}
                >
                  {t('contact:send_button')}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info / Map Card (col-lg-5) */}
          <div className="col-lg-5">
            <div 
              className="glass-card p-5 h-100" 
              style={{ borderTop: `5px solid ${primaryColor}` }}
            >
              <h4 className="mb-3" style={{ color: primaryColor }}>{t('contact:details_title')}</h4>
              
              {/* Contact Details */}
              <ul className="list-unstyled text-muted">
                <li className="d-flex align-items-center mb-2">
                  <i className="bi bi-geo-alt-fill me-2" style={{ color: primaryColor }}></i>
                  {t('contact:address')}
                </li>
                <li className="d-flex align-items-center mb-2">
                  <i className="bi bi-telephone-fill me-2" style={{ color: primaryColor }}></i>
                  {t('contact:phone')}
                </li>
                <li className="d-flex align-items-center mb-2">
                  <i className="bi bi-envelope-fill me-2" style={{ color: primaryColor }}></i>
                  {t('contact:email')}
                </li>
              </ul>
              
              <hr />

              {/* Social Links */}
              <div className="mt-4">
                <h5 style={{ color: primaryColor }}>{t('contact:follow_us')}</h5>
                <a href="https://facebook.com" className="me-3 fs-4" style={{ color: primaryColor }}><i className="bi bi-facebook"></i></a>
                <a href="https://x.com" className="me-3 fs-4" style={{ color: primaryColor }}><i className="bi bi-twitter-x"></i></a>
                <a href="https://youtube.com" className="text-danger fs-4"><i className="bi bi-youtube"></i></a>
              </div>

              <hr />

              {/* Embedded Map */}
              <div className="mt-4">
                <iframe
                  title="Google Map"
                  src={mapEmbedUrl}
                  width="100%"
                  height="300" 
                  style={{ border: 0, borderRadius: '10px' }} 
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="my-5" />

      </motion.div>
    </div>
  );
}