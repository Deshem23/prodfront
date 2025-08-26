// src/layout/Header.jsx

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import LanguageSwitcher from "../components/LanguageSwitcher";
import conatelLogo from "../assets/conatel-logo.png";
import coatOfArms from "../assets/coat-of-arms.png";

export default function Header() {
  const { t } = useTranslation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Define a style for clickable elements to ensure the pointer cursor
  const clickableStyle = { cursor: 'pointer' };

  return (
    <header
      style={{
        backgroundColor: "rgb(5, 40, 106)",
        color: "#fff",
        padding: "0.5rem 0",
      }}
    >
      <div className="container">

        {/* ========== Desktop View ========== */}
        <div className="d-none d-md-flex align-items-center justify-content-between">
          
          {/* Logo (Left) - Use <Link> instead of <a> */}
          <div className="d-flex align-items-center me-3">
            <Link to="/" className="d-flex align-items-center" style={clickableStyle}>
              <img
                src={conatelLogo}
                alt="CONATEL Logo"
                style={{ height: "180px", objectFit: "contain" }}
              />
            </Link>
          </div>

          {/* Title and Subtitle (Center) - Use <Link> instead of <a> */}
          <div className="flex-grow-1 text-center px-2">
            <Link 
              to="/" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit', 
                ...clickableStyle 
              }}
            >
              <h1 className="display-6 fw-bold m-0 text-white">CONATEL</h1>
              <p className="m-0 small">{t("header.subtitle")}</p>
            </Link>
          </div>

          <div className="d-flex flex-column align-items-end gap-2 ms-3">
            <div className="d-flex align-items-center gap-3">
              {/* Coat of Arms (Desktop) - Increased height */}
              <img
                src={coatOfArms}
                alt="Haiti Coat of Arms"
                style={{ height: "110px" }} // Made bigger for desktop view
              />
              <div style={{ marginTop: "0.3rem" }}>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Note: The form remains as is, as it's for submission, not navigation */}
            <form className="search-form" role="search" action="/search" method="get">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  marginBottom: 1,
                  padding: "0.3rem 0.75rem",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  minWidth: "180px",
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
                    fontSize: "0.95rem",
                    flex: 1,
                    backgroundColor: "transparent",
                    color: "#000",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#333",
                    fontSize: "1.2rem",
                    paddingLeft: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ========== Mobile View ========== */}
        <div className="d-flex d-md-none flex-column p-2">
          
          {/* Mobile Header Row */}
          <div className="d-flex align-items-center justify-content-between w-100">
            
            {/* Logo (Left) - Use <Link> instead of <a> */}
            <div className="d-flex align-items-center">
              <Link to="/" className="d-flex align-items-center" style={clickableStyle}>
                <img
                  src={conatelLogo}
                  alt="CONATEL Logo"
                  style={{ height: "80px", objectFit: "contain" }}
                />
              </Link>
            </div>

            {/* Title and Subtitle (Center, stacked) - Use <Link> instead of <a> */}
            <div className="text-center flex-grow-1 mx-2">
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit', 
                  ...clickableStyle 
                }}
              >
                <h1 className="fw-bold m-0 text-white fs-5">CONATEL</h1>
                <p className="m-0" style={{ fontSize: '0.65rem' }}>Conseil National des Télécommunications</p>
              </Link>
            </div>

            {/* Boxes 3, 4, 5: Coat of Arms, Search icon, Language Switcher (Right side, horizontal) */}
            <div className="d-flex align-items-center gap-2">
              
              {/* Box 3: Coat of Arms (Mobile) - Remains 40px */}
              <div className="d-flex align-items-center">
                <img src={coatOfArms} alt="Haiti Coat of Arms" style={{ height: "40px" }} />
              </div>
              
              {/* Box 4: Search icon */}
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-light d-flex align-items-center justify-content-center"
                  aria-label="Search"
                  onClick={toggleMobileSearch}
                  style={{ fontSize: "1rem", width: "30px", height: "30px", padding: 0, }}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
              
              {/* Box 5: Language Switcher (Horizontally aligned) */}
              <div className="d-flex align-items-center">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Mobile Search Input (Visible only if showMobileSearch is true) */}
          {showMobileSearch && (
            <div className="w-100 mt-3">
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
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "0.3rem 0.75rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
                      fontSize: "0.95rem",
                      flex: 1,
                      backgroundColor: "transparent",
                      color: "#000",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#333",
                      fontSize: "1.2rem",
                      paddingLeft: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}