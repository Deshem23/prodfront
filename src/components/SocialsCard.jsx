// src/components/SocialsCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './SocialsCard.css';

const SocialsCard = () => {
    const { t } = useTranslation('sidebar');
    const primaryColor = 'rgb(5, 40, 106)';

    // Retrieve the links as a single object using the 'returnObjects' option.
    const socialLinks = t('socials.links', { returnObjects: true });

    const socialItems = [
        { icon: "bi bi-facebook", link: socialLinks.facebook },
        { icon: "bi bi-twitter-x", link: socialLinks.twitter },
        { icon: "bi bi-youtube", link: socialLinks.youtube },
        { icon: "bi bi-linkedin", link: socialLinks.linkedin },
    ];

    return (
        <div
            className="glass-card"
            style={{ borderTop: `15px solid ${primaryColor}` }}
        >
            <div
                className="card-header d-flex align-items-center justify-content-between"
                style={{
                    backgroundColor: 'transparent',
                    borderBottom: '1px solid red',
                    color: primaryColor,
                    padding: '0.25rem 1.5rem',
                    fontWeight: 'bold',
                    fontSize: '1.25rem'
                }}
            >
                <span>{t('socials.title')}</span>
                <i className="bi bi-share-fill fs-4" style={{ color: primaryColor }}></i>
            </div>
            <div className="card-body p-4">
                <div className="d-flex justify-content-around">
                    {socialItems.map((item, index) => (
                        <a
                            // Use the pre-translated link directly
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                            key={index}
                        >
                            <i className={`${item.icon} social-icon`}></i>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialsCard;