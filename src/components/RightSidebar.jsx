// src/components/RightSidebar.jsx
import React from 'react';
import { useTranslation } from "react-i18next";
import LatestNewsCard from './LatestNewsCard';
import ChantiersCard from './ChantiersCard';
import StatsCard from './StatsCard';
import SocialsCard from './SocialsCard';
import './RightSidebar.css';

export default function RightSidebar() {
  const { t } = useTranslation(['sidebar', 'chantiers', 'stats', 'home']);

  // This is the hardcoded data needed for the LatestNewsCard to function.
  const latestNewsData = [
    {
      date: '10 Jun 2025',
      item: 'Nouvelle politique d\'inclusion numérique pour les zones rurales',
      link: '/news-item-1'
    },
    {
      date: '05 Jun 2025',
      item: 'Consultation publique pour l\'attribution du spectre 5G',
      link: '/news-item-2'
    },
    {
      date: '28 May 2025',
      item: 'CONATEL s\'associe aux FAI locaux pour améliorer la connectivité',
      link: '/news-item-3'
    }
  ];

  return (
    // The main container for the sidebar, using the custom width class
    <div className="custom-width-27 mt-4 mt-lg-0">
      <LatestNewsCard t={t} newsData={latestNewsData} />
      <ChantiersCard t={t} />
      <StatsCard t={t} />
      <SocialsCard />
    </div>
  );
}