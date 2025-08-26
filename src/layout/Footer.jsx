// src/components/Footer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";

export default function Footer() {
    const { t } = useTranslation(['common']);
    const primaryColor = 'rgb(5, 40, 106)'; 

    const footerStyle = {
        // Background color is the primary blue
        backgroundColor: primaryColor,
        color: '#fff',
        // Increased vertical padding (py-5) to make the footer bigger
        paddingTop: '3rem', 
        paddingBottom: '3rem', 
    };

    const linkStyle = {
        color: '#fff',
        textDecoration: 'none',
        transition: 'color 0.3s',
    };

    const iconStyle = {
        color: '#fff',
        fontSize: '1.5rem',
        marginRight: '1rem',
    };

    // Style for footer column headers
    const headerStyle = {
        color: '#fff', 
        fontWeight: 'bold',
        marginBottom: '1rem',
        borderBottom: '2px solid red', 
        paddingBottom: '0.5rem',
    };

    const textStyle = {
        fontSize: '0.9rem',
        color: '#ccc',
    };

    return (
        <motion.footer
            style={footerStyle}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container">
                <div className="row justify-content-center">

                    {/* CONATEL Contact Info Column: Full width on mobile (col-12) */}
                    <div className="col-md-4 col-12 mb-4">
                        <div style={headerStyle}>
                            {t('common:footer_contact_title')}
                        </div>
                        <p style={textStyle}>
                            {t('common:footer_address_line1')} <br />
                            {t('common:footer_address_line2')}
                        </p>
                        <p style={textStyle}>
                            <i className="bi bi-telephone-fill me-2"></i> {t('common:footer_phone')}
                        </p>
                        <p style={textStyle}>
                            <i className="bi bi-envelope-fill me-2"></i> {t('common:footer_email')}
                        </p>
                        
                        <div className="d-flex mt-3">
                            <a href="https://twitter.com/conatelhaiti" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="https://facebook.com/conatelhaiti" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="https://linkedin.com/company/conatelhaiti" target="_blank" rel="noopener noreferrer" style={iconStyle}>
                                <i className="bi bi-linkedin"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column: Two sections per row on mobile (col-6) */}
                    <div className="col-md-4 col-6 mb-4">
                        <div style={headerStyle}>
                            {t('common:footer_links_title')}
                        </div>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/actualites" style={linkStyle}>{t('common:footer_news')}</a></li>
                            <li className="mb-2"><a href="/a-propos" style={linkStyle}>{t('common:footer_about')}</a></li>
                            <li className="mb-2"><a href="/services" style={linkStyle}>{t('common:footer_services')}</a></li>
                            <li className="mb-2"><a href="/publications" style={linkStyle}>{t('common:footer_publications')}</a></li>
                        </ul>
                    </div>

                    {/* Legal & Resources Column: Two sections per row on mobile (col-6) */}
                    <div className="col-md-4 col-6 mb-4">
                        <div style={headerStyle}>
                            {t('common:footer_resources_title')}
                        </div>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/lois-et-reglements" style={linkStyle}>{t('common:footer_laws')}</a></li>
                            <li className="mb-2"><a href="/rapports" style={linkStyle}>{t('common:footer_reports')}</a></li>
                            <li className="mb-2"><a href="/faqs" style={linkStyle}>{t('common:footer_faqs')}</a></li>
                            <li className="mb-2"><a href="/contact" style={linkStyle}>{t('common:footer_contact_page')}</a></li>
                        </ul>
                    </div>

                </div>

                {/* Footer Bottom Bar */}
                <hr style={{ borderColor: '#fff', marginTop: '2rem', marginBottom: '1rem' }} />
                <div className="row">
                    <div className="col-12 text-center text-white"> 
                        <small>
                            &copy; {new Date().getFullYear()} {t('common:footer_copyright_conatel')} | {t('common:footer_rights')}
                        </small>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}