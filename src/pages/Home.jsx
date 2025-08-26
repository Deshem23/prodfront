import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import React from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

import "./../styles/global.css";
import CarouselSlider from "../components/CarouselSlider";
import LatestNewsCard from "../components/LatestNewsCard";
import SocialsCard from "../components/SocialsCard";
import ChantiersCard from "../components/ChantiersCard";

// Strapi API configuration
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_API_URL;
const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

export default function Home() {
  const { t, i18n } = useTranslation(['home', 'common', 'sidebar', 'chantiers']);
  const primaryColor = 'rgb(5, 40, 106)';

  // State for the home page intro content
  const [introContent, setIntroContent] = useState({
    title: t("home:title"),
    intro: t("home:intro")
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntroContent = async () => {
      try {
        setLoading(true);
        
        // Fetch content from Strapi with current locale
        const response = await axios.get(
          `${STRAPI_API_URL}/home-page?locale=${i18n.language}`
        );
        
        console.log("Strapi API Response:", response.data); // Debugging
        
        if (response.data?.data) {
          const strapiData = response.data.data;
          setIntroContent({
            title: strapiData.title || t("home:title"),
            intro: strapiData.intro || t("home:intro")
          });
        } else {
          console.warn("No content received from Strapi, using translations");
        }

      } catch (err) {
        setError(t("home:api_error") || "Failed to load content");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntroContent();
  }, [i18n.language, t]); 

  const borderBottomStyle = {
    borderBottom: '1px solid red',
    paddingBottom: '10px'
  };

  // Loading state
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container text-center py-5 alert alert-danger">
        {error}
        <p className="mt-2">
          Showing default content instead.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container mb-4">
        <CarouselSlider />
      </div>

      <div className="container">
        <motion.div
          className="home-main-content-row equal-height-cards"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-card home-intro-column p-4 p-md-5" style={{ borderTop: `20px solid ${primaryColor}` }}>
            <h2 style={{ color: primaryColor, ...borderBottomStyle }}>
              {introContent.title}
            </h2>
            <p className="home-intro-text justify-text force-dark-text">
              {introContent.intro}
            </p>
            <Link
              to="/a-propos"
              className="learn-more-link"
              style={{ 
                color: primaryColor, 
                textDecoration: 'none', 
                fontWeight: 'bold' 
              }}
            >
              {t("home:learn_more")}
            </Link>
          </div>
          <div className="home-latest-news-column">
            <LatestNewsCard />
          </div>
        </motion.div>

        <motion.div
          className="mid-section-row equal-height-cards"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="home-intro-column">
            <ChantiersCard t={t} />
          </div>
          <div className="home-latest-news-column mt-0">
            <SocialsCard />
          </div>
        </motion.div>
      </div>
    </>
  );
}