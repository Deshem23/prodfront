// src/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./Navbar.css";
import React from 'react';

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const collapseRef = useRef(null);
  const [showMobileSearchNavbar, setShowMobileSearchNavbar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (collapseRef.current) {
      if (window.bootstrap && window.bootstrap.Collapse) {
        const collapseInstance = window.bootstrap.Collapse.getInstance(collapseRef.current) || new window.bootstrap.Collapse(collapseRef.current, { toggle: false });
        collapseInstance.hide();
      } else {
        if (collapseRef.current.classList.contains('show')) {
          collapseRef.current.classList.remove('show');
          const toggler = document.querySelector('[data-bs-toggle="collapse"]');
          if (toggler) {
            toggler.setAttribute('aria-expanded', 'false');
          }
        }
      }
    }
  };

  const toggleMobileSearchNavbar = () => {
    setShowMobileSearchNavbar(!showMobileSearchNavbar);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        const navbarTop = navbarRef.current.getBoundingClientRect().top;
        setIsScrolled(navbarTop <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div style={{ height: "2px", backgroundColor: "#ffffff" }}></div>
      <nav
        ref={navbarRef}
        className="navbar navbar-expand-lg custom-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1020,
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="container">
          <div className="d-flex d-lg-none align-items-center justify-content-between w-100 position-relative">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
              aria-controls="mainNav"
              aria-expanded="false"
              aria-label={t("navbar.toggle")}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`mobile-sticky-brand ${isScrolled ? 'show' : ''}`}>
              CONATEL
            </div>
            <div className="d-flex align-items-center">
              <div className="me-2 language-switcher-mobile-icon">
                 <LanguageSwitcher isMobileVersion={true} />
              </div>
              <button
                onClick={toggleMobileSearchNavbar}
                className="btn btn-link p-0"
                aria-label={t("header.searchPlaceholder")}
                style={{ color: "rgb(5, 40, 106)" }}
              >
                <i className="bi bi-search" style={{ fontSize: '1.5rem' }}></i>
              </button>
            </div>
          </div>
          <div
            className="collapse navbar-collapse"
            id="mainNav"
            ref={collapseRef}
          >
            <ul className="navbar-nav flex-wrap">
              <li className="nav-item">
                <Link
                  to="/"
                  className={`nav-link nav-hover ${isActive("/") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.home")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/a-propos"
                  className={`nav-link nav-hover ${isActive("/a-propos") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.about")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/actualites"
                  className={`nav-link nav-hover ${isActive("/actualites") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.news")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/procedures"
                  className={`nav-link nav-hover ${isActive("/procedures") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.procedures")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/decisions"
                  className={`nav-link nav-hover ${isActive("/decisions") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.decisions")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/chantiers"
                  className={`nav-link nav-hover ${isActive("/chantiers") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.chantiers")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/rapports"
                  className={`nav-link nav-hover ${isActive("/rapports") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.reports")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/galerie"
                  className={`nav-link nav-hover ${isActive("/galerie") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.gallery")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/archives"
                  className={`nav-link nav-hover ${isActive("/archives") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.archives")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className={`nav-link nav-hover ${isActive("/contact") ? "active-link" : ""}`}
                  onClick={handleLinkClick}
                >
                  {t("navbar.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {showMobileSearchNavbar && (
        <div
          className="d-md-none w-100 p-3"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
            zIndex: 1019,
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
          }}
        >
          <form
            className="search-form"
            role="search"
            action="/search"
            method="get"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "25px",
                padding: "0.5rem 1rem",
                border: "1px solid #ced4da",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <input
                type="search"
                name="q"
                placeholder={t("header.searchPlaceholder")}
                aria-label={t("header.searchPlaceholder")}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "1rem",
                  flex: 1,
                  backgroundColor: "transparent",
                  color: "#343a40",
                  paddingRight: "0.5rem",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "none",
                  border: "none",
                  color: "rgb(5, 40, 106)",
                  fontSize: "1.3rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}