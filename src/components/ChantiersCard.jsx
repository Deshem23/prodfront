import React from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import './ChantiersCard.css';

export default function ChantiersCard() {
  const { t } = useTranslation('sidebar');
  const primaryColor = 'rgb(5, 40, 106)';

  const chantiers = [
    {
      icon: 'bi bi-shield-shaded',
      title: t('chantiers.cybersecurite'),
      link: '/chantiers#cybersecurite'
    },
    {
      icon: 'bi bi-pen-fill',
      title: t('chantiers.signature_electronique'),
      link: '/chantiers#signatureElectronique'
    },
    {
      icon: 'bi bi-gear-wide-connected',
      title: t('chantiers.transformation_numerique'),
      link: '/chantiers#transformationNumerique'
    },
    {
      icon: 'bi bi-speedometer2',
      title: t('chantiers.qos'),
      link: '/chantiers#qualiteDeService'
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true, // Arrows are now enabled
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

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
        <span>{t('chantiers.title')}</span>
        <i className="bi bi-hammer fs-4" style={{ color: primaryColor }}></i>
      </div>
      <div className="card-body">
        <Slider className="chantiers-slider" {...sliderSettings}>
          {chantiers.map((chantier, index) => (
            <div key={index} className="slide-item">
              <a
                href={chantier.link}
                className="d-flex flex-column align-items-center text-decoration-none text-reset p-3"
              >
                <i className={`${chantier.icon} chantier-icon mb-2`}></i>
                <span className="d-block text-muted">{chantier.title}</span>
              </a>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}