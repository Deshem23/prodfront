// src/components/Sidebar.jsx
import React from 'react';
// Comment out the other cards for now
// import LatestNewsCard from './LatestNewsCard';
// import ChantiersCard from './ChantiersCard';
// import StatsCard from './StatsCard';
import SocialMediaCard from './SocialMediaCard';

export default function Sidebar() {
  return (
    <>
      {/* <div className="apropos-side-card">
        <LatestNewsCard />
      </div>
      <div className="apropos-side-card">
        <ChantiersCard />
      </div>
      <div className="apropos-side-card">
        <StatsCard />
      </div> */}
      <div className="apropos-side-card">
        <SocialMediaCard />
      </div>
    </>
  );
}